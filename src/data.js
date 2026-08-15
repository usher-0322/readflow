const iso = d => d.toISOString().slice(0,10)
export const uid = () => crypto.randomUUID()
export const seed = {
  types: [
    {id:'t1',name:'小说',color:'#A86143',order:0},{id:'t2',name:'专业',color:'#857268',order:1},{id:'t3',name:'日语原版',color:'#9A765F',order:2}
  ],
  books: [],
  sessions: [],
  excerpts: []
}
export const statusLabels={unread:'待读',planned:'计划中',reading:'阅读中',read:'阅读完成',excerpt:'待摘抄',done:'全部完成'}
export const bookProgress = b => Math.min(100,Math.round((b.currentPage/b.totalPages)*100)||0)
export function targetFor(book){ const left=Math.max(0,book.totalPages-book.currentPage); if(book.planMode==='pages') return Math.max(1,+book.dailyPages||1); const days=Math.max(1,Math.ceil((new Date(book.targetDate)-new Date())/86400000)); return Math.max(1,Math.ceil(left/days)) }
export function prediction(book,sessions){ const recent=sessions.filter(s=>s.bookId===book.id && new Date(s.date)>=new Date(Date.now()-7*86400000)); const speed=recent.reduce((a,s)=>a+s.pages,0)/Math.max(1,recent.length); const perDay=speed||targetFor(book); const d=new Date(); d.setDate(d.getDate()+Math.ceil((book.totalPages-book.currentPage)/perDay)); const planned=new Date(book.targetDate); return {date:iso(d),delta:Math.round((d-planned)/86400000),speed:Math.round(perDay*10)/10} }
