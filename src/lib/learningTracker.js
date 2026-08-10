
const KEY='toefl112-learning'
export function loadLearning(){
 try{return JSON.parse(localStorage.getItem(KEY)||'{"attempts":[],"mistakes":{},"reviews":{}}')}catch{return {attempts:[],mistakes:{},reviews:{}}}
}
export function recordAttempt({skill='Speaking',id='unknown',label='',score=0}){
 const d=loadLearning(), now=Date.now(), key=`${skill}:${id}`
 d.attempts=[...(d.attempts||[]),{skill,id,label,score,at:now}].slice(-1200)
 if(score<80){
  const old=d.mistakes[key]||{skill,id,label,count:0,best:0}
  const count=(old.count||0)+1
  const intervals=[1,3,7,14,30]
  d.mistakes[key]={...old,skill,id,label,count,best:Math.max(old.best||0,score),last:score,updatedAt:now,dueAt:now+intervals[Math.min(count-1,intervals.length-1)]*86400000}
 }else if(d.mistakes[key]){
  d.mistakes[key]={...d.mistakes[key],best:Math.max(d.mistakes[key].best||0,score),last:score,updatedAt:now,dueAt:now+7*86400000}
 }
 localStorage.setItem(KEY,JSON.stringify(d))
 window.dispatchEvent(new Event('toefl-learning-updated'))
}
export function learningSummary(){
 const d=loadLearning(), attempts=d.attempts||[], today=new Date().toDateString()
 const todayA=attempts.filter(x=>new Date(x.at).toDateString()===today)
 const skills=['Reading','Listening','Speaking','Writing','Pronunciation','Vocabulary','Conversation','Podcast']
 const bySkill=Object.fromEntries(skills.map(s=>{
   const a=attempts.filter(x=>x.skill===s).slice(-30)
   return [s,a.length?Math.round(a.reduce((n,x)=>n+x.score,0)/a.length):null]
 }))
 const due=Object.values(d.mistakes||{}).filter(x=>(x.dueAt||0)<=Date.now()).sort((a,b)=>(a.last||0)-(b.last||0))
 const weak=Object.entries(bySkill).filter(([,v])=>v!==null).sort((a,b)=>a[1]-b[1])
 return {attempts,todayA,bySkill,due,weak,mistakes:Object.values(d.mistakes||{})}
}
