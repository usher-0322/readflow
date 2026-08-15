const url=(import.meta.env.VITE_SUPABASE_URL||'').replace(/\/$/,'')
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||''
const SESSION_KEY='readflow-supabase-session'

export const cloudConfigured=Boolean(url&&key)

const readSession=()=>{try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}}
const writeSession=session=>{if(session)localStorage.setItem(SESSION_KEY,JSON.stringify(session));else localStorage.removeItem(SESSION_KEY)}

async function authRequest(path,body){
  const response=await fetch(`${url}/auth/v1/${path}`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify(body)})
  const result=await response.json().catch(()=>({}))
  if(!response.ok)throw new Error(result.msg||result.message||result.error_description||'Authentication failed')
  return result
}

async function activeSession(){
  if(!cloudConfigured)return null
  let session=readSession()
  if(!session)return null
  if((session.expires_at||0)*1000>Date.now()+60000)return session
  try{
    session=await authRequest('token?grant_type=refresh_token',{refresh_token:session.refresh_token})
    writeSession(session)
    return session
  }catch{
    writeSession(null)
    return null
  }
}

export async function signIn(email,password){
  const session=await authRequest('token?grant_type=password',{email,password})
  writeSession(session)
  return session.user
}

export async function signUp(email,password){
  const result=await authRequest('signup',{email,password})
  if(result.access_token)writeSession(result)
  return{user:result.user,needsConfirmation:!result.access_token}
}

export function signOut(){writeSession(null)}

export async function getCurrentUser(){return(await activeSession())?.user||null}

async function dataRequest(path,options={}){
  const session=await activeSession()
  if(!session)throw new Error('Please sign in again')
  const response=await fetch(`${url}/rest/v1/${path}`,{...options,headers:{apikey:key,Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json',...(options.headers||{})}})
  if(!response.ok){const result=await response.json().catch(()=>({}));throw new Error(result.message||result.hint||'Cloud sync failed')}
  if(response.status===204)return null
  return response.json()
}

export async function pullCloudState(){
  const rows=await dataRequest('reading_states?select=data,updated_at&limit=1')
  return rows?.[0]||null
}

export async function pushCloudState(data){
  const session=await activeSession()
  if(!session)throw new Error('Please sign in again')
  await dataRequest('reading_states?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:session.user.id,data,updated_at:new Date().toISOString()})})
}
