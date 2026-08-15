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
export function targetFor(book){ const total=Number(book.totalPages)||0,current=Number(book.currentPage)||0,left=Math.max(0,total-current); if(book.planMode==='pages') return Math.max(1,Number(book.dailyPages)||1); const target=new Date(book.targetDate),rawDays=(target-new Date())/86400000,days=Number.isFinite(rawDays)?Math.max(1,Math.ceil(rawDays)):1; return Math.max(1,Math.ceil(left/days)||1) }
export function prediction(book,sessions){ const recent=sessions.filter(s=>s.bookId===book.id && new Date(s.date)>=new Date(Date.now()-7*86400000)); const speed=recent.reduce((a,s)=>a+(Number(s.pages)||0),0)/Math.max(1,recent.length),perDay=Math.max(1,speed||targetFor(book)||1),remaining=Math.max(0,(Number(book.totalPages)||0)-(Number(book.currentPage)||0)); const d=new Date(); d.setDate(d.getDate()+Math.ceil(remaining/perDay)); const planned=new Date(book.targetDate),hasPlannedDate=!Number.isNaN(planned.getTime()); return {date:iso(d),delta:hasPlannedDate?Math.round((d-planned)/86400000):0,speed:Math.round(perDay*10)/10} }
