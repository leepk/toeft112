
import { useEffect, useState } from 'react'
import { learningSummary } from '../lib/learningTracker'
import WeeklyMockTest, { latestMockResult } from './WeeklyMockTest'
import { countStatus } from '../lib/contentProgress'
import { pronunciationLessons } from '../data/pronunciation'
import { domainVocabulary } from '../data/domainVocabulary'
import { listeningLessons, speakingLessons } from '../data/listeningSpeaking'
import { conversationLessons } from '../data/conversation'
import { podcastLessons } from '../data/podcasts'

export default function LearningDashboard({onGoDaily}){
 const [s,setS]=useState(()=>learningSummary())
 const [showMock,setShowMock]=useState(false)
 const [mockResult,setMockResult]=useState(()=>latestMockResult())
 useEffect(()=>{const f=()=>setS(learningSummary());window.addEventListener('toefl-learning-updated',f);window.addEventListener('toefl-content-status-updated',f);return()=>{window.removeEventListener('toefl-learning-updated',f);window.removeEventListener('toefl-content-status-updated',f)}},[])
 const avg=s.todayA.length?Math.round(s.todayA.reduce((n,x)=>n+x.score,0)/s.todayA.length):0
 const weakest=s.weak[0]
 const libraries=[
  ['Pronunciation',pronunciationLessons],
  ['Vocabulary',domainVocabulary.map(x=>({...x,id:`${x.domain}:${x.word}`}))],
  ['Listening',listeningLessons],
  ['Speaking',speakingLessons],
  ['Conversation',conversationLessons],
  ['Podcast',podcastLessons]
 ].map(([name,items])=>({name,...countStatus(name,items)}))
 if(showMock) return <WeeklyMockTest onClose={()=>{setShowMock(false);setMockResult(latestMockResult())}} onSaved={r=>setMockResult(r)}/>
 return <div className="learning-dashboard">
  <section className="panel learning-hero"><div><span className="eyebrow">Adaptive learning loop</span><h2>My Learning</h2><p>Practice → score → review weak items → retry. The app keeps this progress locally on this device.</p></div>
   <div className="learning-kpis"><div><strong>{avg || '—'}</strong><span>today score</span></div><div><strong>{s.todayA.length}</strong><span>attempts today</span></div><div><strong>{s.due.length}</strong><span>reviews due</span></div></div>
  </section>
  <section className="panel library-progress-panel"><div className="section-head"><div><span className="eyebrow">Content progress</span><h3>Library Progress</h3></div><span className="progress-status-note">Completed stays saved on this device</span></div>
   <div className="library-progress-grid">{libraries.map(x=><div key={x.name}><div className="library-progress-top"><strong>{x.name}</strong><span>{x.completed}/{x.total}</span></div><div className="mini-meter"><i style={{width:`${x.total?x.completed/x.total*100:0}%`}}/></div><small>{x.inProgress} in progress · {x.review} need review</small></div>)}</div>
  </section>
  <section className="panel"><div className="section-head"><div><span className="eyebrow">Skill map</span><h3>Weak Skills</h3></div>{weakest&&<span className="weak-badge">Focus: {weakest[0]}</span>}</div>
   <div className="skill-score-grid">{Object.entries(s.bySkill).map(([k,v])=><div key={k}><div><strong>{k}</strong><span>{v??'New'}{v!==null&&'/100'}</span></div><div className="mini-meter"><i style={{width:`${v||0}%`}}/></div></div>)}</div>
  </section>
  <section className="panel"><div className="section-head"><div><span className="eyebrow">1 / 3 / 7 / 14 day cycle</span><h3>Spaced Review & Mistake Book</h3></div><button className="primary-skill-btn" onClick={onGoDaily}>Start Daily Review</button></div>
   {s.due.length?<div className="mistake-list">{s.due.slice(0,12).map((x,i)=><div key={`${x.skill}:${x.id}`}><span>{i+1}</span><div><strong>{x.label||x.id}</strong><small>{x.skill} · last {x.last}/100 · {x.count} weak attempt{x.count>1?'s':''}</small></div></div>)}</div>:<p className="empty-learning">No review is due yet. Items scoring below 80 will automatically appear here.</p>}
  </section>
  <section className="panel mock-launch">
   <div className="section-head"><div><span className="eyebrow">Weekly TOEFL diagnostic</span><h3>Mock Test & Estimated Score</h3></div><button className="primary-skill-btn" onClick={()=>setShowMock(true)}>{mockResult?'Take another mock':'Start weekly mock'}</button></div>
   {mockResult?<div className="latest-mock"><div className="mock-big-score"><strong>{mockResult.overall.toFixed(1)}</strong><span>/ 6 estimated</span><small>~{mockResult.comparable120}/120 comparable</small></div><div className="mock-mini-sections">{Object.entries(mockResult.sections).map(([k,v])=><span key={k}><b>{k}</b>{v.toFixed(1)}</span>)}</div></div>:<p className="empty-learning">No weekly mock yet. The short test covers Reading, Listening, Speaking, and Writing.</p>}
   <p className="mock-note">Practice estimate only — not an official ETS score.</p>
  </section>
  <WeeklyCheck attempts={s.attempts}/>
 </div>
}
function WeeklyCheck({attempts}){
 const recent=attempts.filter(x=>x.at>Date.now()-7*86400000)
 const avg=recent.length?Math.round(recent.reduce((n,x)=>n+x.score,0)/recent.length):0
 const target=Math.min(100,Math.round(recent.length/35*100))
 return <section className="panel weekly-check"><span className="eyebrow">Weekly check</span><h3>7-day consistency</h3><div className="weekly-row"><div><strong>{recent.length}</strong><span>scored practices</span></div><div><strong>{avg||'—'}</strong><span>average score</span></div><div><strong>{target}%</strong><span>35-practice target</span></div></div><p>{recent.length>=35?'Good volume. Use the next week to raise your weakest skill score.':'Aim for about 5 scored practices per day. Quality and retry matter more than adding more content.'}</p></section>
}
