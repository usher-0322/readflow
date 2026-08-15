const iso = d => d.toISOString().slice(0,10)
const today = new Date(), ago = n => { const d=new Date(today); d.setDate(d.getDate()-n); return iso(d) }, later = n => { const d=new Date(today); d.setDate(d.getDate()+n); return iso(d) }
export const uid = () => crypto.randomUUID()
export const seed = {
  types: [
    {id:'t1',name:'小说',color:'#A86143',order:0},{id:'t2',name:'专业',color:'#857268',order:1},{id:'t3',name:'日语原版',color:'#9A765F',order:2}
  ],
  books: [
    {id:'b1',title:'百年孤独',author:'加西亚·马尔克斯',totalPages:360,currentPage:168,startDate:ago(12),targetDate:later(12),status:'reading',typeId:'t1',tags:['拉美文学'],planMode:'date',dailyPages:15,frequency:'每天',excludedDays:[],needsExcerpts:true,excerptProgress:20,color:'#B97558'},
    {id:'b2',title:'日本庭园史',author:'重森三玲',totalPages:288,currentPage:92,startDate:ago(9),targetDate:later(25),status:'reading',typeId:'t2',tags:['园林','设计'],planMode:'pages',dailyPages:8,frequency:'工作日',excludedDays:[0,6],needsExcerpts:true,excerptProgress:45,color:'#8B7A70'},
    {id:'b3',title:'コンビニ人間',author:'村田沙耶香',totalPages:192,currentPage:126,startDate:ago(7),targetDate:later(9),status:'reading',typeId:'t3',tags:['小说','通勤'],planMode:'date',dailyPages:9,frequency:'每天',excludedDays:[],needsExcerpts:false,excerptProgress:100,color:'#A68673'}
  ],
  sessions: Array.from({length:22},(_,i)=>({id:'s'+i,bookId:['b1','b2','b3'][i%3],date:ago(i%14),minutes:18+(i*7)%39,pages:5+(i*4)%15})),
  excerpts: [
    {id:'e1',bookId:'b1',page:87,content:'过去都是假的，回忆是一条没有归途的路。',note:'时间与记忆',status:'organized',date:ago(3)},
    {id:'e2',bookId:'b2',page:52,content:'庭园不是自然的复制，而是对自然秩序的重新理解。',note:'待补充案例',status:'pending',date:ago(1)}
  ]
}
export const statusLabels={unread:'待读',planned:'计划中',reading:'阅读中',read:'阅读完成',excerpt:'待摘抄',done:'全部完成'}
export const bookProgress = b => Math.min(100,Math.round((b.currentPage/b.totalPages)*100)||0)
export function targetFor(book){ const left=Math.max(0,book.totalPages-book.currentPage); if(book.planMode==='pages') return Math.max(1,+book.dailyPages||1); const days=Math.max(1,Math.ceil((new Date(book.targetDate)-new Date())/86400000)); return Math.max(1,Math.ceil(left/days)) }
export function prediction(book,sessions){ const recent=sessions.filter(s=>s.bookId===book.id && new Date(s.date)>=new Date(Date.now()-7*86400000)); const speed=recent.reduce((a,s)=>a+s.pages,0)/Math.max(1,recent.length); const perDay=speed||targetFor(book); const d=new Date(); d.setDate(d.getDate()+Math.ceil((book.totalPages-book.currentPage)/perDay)); const planned=new Date(book.targetDate); return {date:iso(d),delta:Math.round((d-planned)/86400000),speed:Math.round(perDay*10)/10} }
