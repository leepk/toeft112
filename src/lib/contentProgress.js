
const KEY='toefl112-content-status'
function load(){
 try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}
}
function save(data){
 localStorage.setItem(KEY,JSON.stringify(data))
 window.dispatchEvent(new Event('toefl-content-status-updated'))
}
export function contentKey(type,id){return `${type}:${id}`}
export function getContentState(type,id){
 const d=load(), x=d[contentKey(type,id)]
 if(!x)return {status:'Not Started',score:null}
 if(x.reviewDueAt && x.reviewDueAt<=Date.now()) return {...x,status:'Need Review'}
 return x
}
export function markStarted(type,id,label=''){
 const d=load(),k=contentKey(type,id),old=d[k]
 if(!old){d[k]={type,id,label,status:'In Progress',startedAt:Date.now(),updatedAt:Date.now(),score:null};save(d)}
}
export function markCompleted(type,id,label=''){
 const d=load(),k=contentKey(type,id),old=d[k]||{}
 d[k]={...old,type,id,label,status:'Completed',completedAt:Date.now(),updatedAt:Date.now(),reviewDueAt:null}
 save(d)
}
export function recordContentScore(type,id,label,score){
 const d=load(),k=contentKey(type,id),old=d[k]||{}
 const next={...old,type,id,label,score,best:Math.max(old.best||0,score),updatedAt:Date.now()}
 if(score>=80){next.status='Completed';next.completedAt=old.completedAt||Date.now();next.reviewDueAt=null}
 else {next.status='Need Review';next.reviewDueAt=Date.now()+86400000}
 d[k]=next;save(d)
}
export function toggleCompleted(type,id,label=''){
 const cur=getContentState(type,id)
 if(cur.status==='Completed'){
  const d=load(),k=contentKey(type,id)
  d[k]={...d[k],status:'In Progress',completedAt:null,updatedAt:Date.now()}
  save(d)
 }else markCompleted(type,id,label)
}
export function statusMap(type,items){
 const map={}
 items.forEach(x=>map[x.id]=getContentState(type,x.id))
 return map
}
export function countStatus(type,items){
 let completed=0,inProgress=0,review=0
 items.forEach(x=>{
  const s=getContentState(type,x.id).status
  if(s==='Completed')completed++
  else if(s==='In Progress')inProgress++
  else if(s==='Need Review')review++
 })
 return {completed,inProgress,review,total:items.length}
}
