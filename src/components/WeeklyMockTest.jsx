
import { useMemo, useState } from 'react'
import AudioRecorder from './AudioRecorder'
import { recordAttempt } from '../lib/learningTracker'

const RESULT_KEY='toefl112-weekly-mock-results'
const topics=[
 ['Campus planning','A university introduced a reservation system for popular study rooms. At first, students complained that spontaneous group meetings became harder. After reviewing usage data, the library kept reservations during busy hours but reopened some rooms for walk-in use. The change reduced long waits without removing all flexibility.'],
 ['Technology adoption','A small company replaced several manual reports with an automated dashboard. Managers initially expected the main benefit to be faster reporting. Instead, the largest improvement came from everyone using the same definitions for key metrics. The project showed that shared meaning can matter as much as speed.'],
 ['Health routines','Researchers studying sleep habits found that consistency was strongly associated with better daytime attention. Sleeping much longer on weekends did not fully compensate for irregular sleep during the week. The researchers therefore emphasized stable routines rather than occasional recovery sleep.'],
 ['Learning strategy','Students often believe rereading is the safest way to prepare for an exam because the material feels familiar. However, retrieval practice—trying to recall information without looking—usually reveals gaps more clearly. The difficulty of retrieval can make it feel less effective even when it improves long-term memory.']
]
const readingQs=[
 {q:'What is the main idea of the passage?',options:['A practical change produced a more balanced result.','The original system should never have changed.','Cost was the only important factor.','Students refused to use the new system.'],a:0},
 {q:'Why does the author mention the initial expectation?',options:['To show how the actual result differed from what people predicted.','To criticize all planning.','To introduce a historical date.','To define a vocabulary word.'],a:0},
 {q:'What can be inferred?',options:['Evidence led people to adjust their first approach.','No one measured the result.','The final decision ignored users.','The original problem became worse.'],a:0},
 {q:'Which word best describes the organization?',options:['Problem → evidence → adjustment','Chronological biography','Definition only','Question without answer'],a:0},
 {q:'What is the author’s attitude?',options:['Analytical and practical','Angry','Uncertain about every fact','Humorous'],a:0}
]
const listenScripts=[
 ['Student: I wanted to ask about changing one class.','Advisor: Is the problem the course itself or the time?','Student: The time. My work schedule changed this week.','Advisor: Then do not drop it yet. Join the other section’s waitlist first.','Student: So I keep my current seat until I know the other one is available?','Advisor: Exactly. That protects you from losing both options.'],
 ['Manager: Our release is scheduled for Friday, but the new report is not ready.','Developer: The report is separate from the core workflow.','Manager: Could we release the core feature and keep the report disabled?','Developer: Yes. We can put it behind a feature flag and finish testing next week.','Manager: Good. Let’s communicate that scope clearly to the customer.'],
 ['Caller: I’m calling because my appointment reminder shows the wrong time.','Staff: Let me verify the appointment in the system.','Caller: I have ten thirty written down.','Staff: Ten thirty is correct. The reminder used an old timezone setting.','Caller: Do I need to reschedule?','Staff: No. I’ll send a corrected confirmation right now.'],
 ['Professor: Many systems become more efficient by removing unused capacity.','That works well under stable conditions.','However, a system with no spare capacity can be fragile when demand suddenly changes.','Resilience often requires keeping resources that appear unnecessary during normal periods.','The best design therefore depends on whether efficiency or recovery is the higher priority.']
]
const listenQs=[
 {q:'What is the main problem?',options:['A detail or constraint requires a decision.','The speakers cannot understand English.','No action is possible.','The conversation is about history.'],a:0},
 {q:'Why does the second speaker ask a question?',options:['To clarify the situation before recommending an action.','To end the conversation.','To change the subject.','To complain.'],a:0},
 {q:'What solution is preferred?',options:['A reversible practical step that protects the current option.','Starting everything over.','Ignoring the problem.','Waiting without checking.'],a:0},
 {q:'What can be inferred about the speakers?',options:['They value confirmation and reducing risk.','They prefer unnecessary complexity.','They have no deadline.','They disagree about every detail.'],a:0},
 {q:'How is the conversation organized?',options:['Situation → clarification → solution','Biography → conclusion','Definition → poem','List with no connection'],a:0}
]
const speakingPrompts=[
 'Do you prefer solving a difficult problem alone first, or asking someone for help early? Explain your choice with a specific example.',
 'A team has a deadline, but one optional feature is not ready. What should the team do? Explain your reasoning.',
 'Describe a time when you changed your plan after receiving new information. What did you learn?',
 'Explain one technology concept you know well to a non-technical person using a simple example.'
]
const speakingModels=[
 'I prefer trying the problem alone for a short time and then asking for help if I am blocked. This gives me a chance to understand the problem, but it also prevents me from wasting too much time. For example, when I debug software, I first reproduce the issue and check the logs. If I still cannot identify the cause, I ask a teammate a specific question. That approach helps me learn while still moving efficiently.',
 'I would release the stable core feature and delay the optional feature if they can be separated safely. The team should communicate the reduced scope clearly and finish the remaining work after the release. This protects the deadline without hiding unfinished work. It is better than rushing an optional feature into production and creating a larger problem.',
 'I once planned to solve a project problem by changing a large part of the system. After reviewing the logs, I discovered that only one configuration value was wrong. I changed the smaller issue and the system recovered immediately. I learned to verify evidence before making a large change because the first explanation is not always correct.',
 'An API is like a waiter in a restaurant. A customer does not enter the kitchen and tell every cook what to do. The customer gives the order to the waiter, and the waiter carries the request to the kitchen and brings back the result. In software, an API provides a defined way for one system to request information or actions from another system.'
]
const writingPrompts=[
 'Some people prefer a fixed daily study schedule, while others prefer a flexible schedule. Which approach is better for you and why?',
 'Should companies allow employees to work remotely whenever their job can be done online? Explain your position.',
 'Do you think AI tools improve education when students use them responsibly? Give reasons and examples.',
 'What is one important skill people should develop before starting a technical career? Explain why.'
]

function weekIndex(){const start=new Date(new Date().getFullYear(),0,1);return Math.floor((Date.now()-start)/604800000)%16}
function speak(text){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.95;speechSynthesis.speak(u)}
function percentCorrect(map,qs){return Math.round(qs.reduce((n,q,i)=>n+(Number(map[i])===q.a?1:0),0)/qs.length*100)}
function pctTo30(p){return Math.max(0,Math.min(30,Math.round(p*.30)))}
function sectionBand(score30){
 if(score30>=29)return 6
 if(score30>=27)return 5.5
 if(score30>=24)return 5
 if(score30>=22)return 4.5
 if(score30>=18)return 4
 if(score30>=13)return 3.5
 if(score30>=9)return 3
 if(score30>=6)return 2.5
 if(score30>=3)return 2
 if(score30>=1)return 1.5
 return 1
}
function totalBand(values){const avg=values.reduce((a,b)=>a+b,0)/values.length;return Math.round(avg*2)/2}
function bandTo120(b){if(b>=6)return 116;if(b>=5.5)return 110;if(b>=5)return 100;if(b>=4.5)return 90;if(b>=4)return 80;if(b>=3.5)return 65;if(b>=3)return 50;if(b>=2.5)return 38;if(b>=2)return 28;if(b>=1.5)return 15;return 5}
function loadResults(){try{return JSON.parse(localStorage.getItem(RESULT_KEY)||'[]')}catch{return[]}}

export function latestMockResult(){return loadResults()[0]||null}

export default function WeeklyMockTest({onClose,onSaved}){
 const seed=weekIndex(), idx=seed%4
 const [step,setStep]=useState(0),[reading,setReading]=useState({}),[listening,setListening]=useState({}),[speakingScore,setSpeakingScore]=useState(0),[writing,setWriting]=useState(''),[writingChecks,setWritingChecks]=useState({})
 const passage=topics[idx][1], listen=listenScripts[idx], sp=speakingPrompts[idx], model=speakingModels[idx], wp=writingPrompts[idx]
 const progress=[reading,listening,speakingScore,writing]
 function finish(){
  const rPct=percentCorrect(reading,readingQs),lPct=percentCorrect(listening,listenQs)
  const sPct=speakingScore||estimateSpeakingPractice()
  const wc=writing.trim().split(/\s+/).filter(Boolean).length
  const checks=Object.values(writingChecks).filter(Boolean).length
  const wPct=Math.min(100,Math.round((Math.min(wc,180)/180)*55+(checks/4)*45))
  const sec30={Reading:pctTo30(rPct),Listening:pctTo30(lPct),Speaking:pctTo30(sPct),Writing:pctTo30(wPct)}
  const bands=Object.fromEntries(Object.entries(sec30).map(([k,v])=>[k,sectionBand(v)]))
  const overall=totalBand(Object.values(bands))
  const result={id:Date.now(),date:new Date().toISOString(),week:seed+1,overall,comparable120:bandTo120(overall),sections:bands,practice30:sec30,percent:{Reading:rPct,Listening:lPct,Speaking:sPct,Writing:wPct}}
  recordAttempt({skill:'Reading',id:`mock-${seed}-reading`,label:'Weekly Mock Reading',score:rPct})
  recordAttempt({skill:'Listening',id:`mock-${seed}-listening`,label:'Weekly Mock Listening',score:lPct})
  recordAttempt({skill:'Speaking',id:`mock-${seed}-speaking`,label:'Weekly Mock Speaking',score:sPct})
  recordAttempt({skill:'Writing',id:`mock-${seed}-writing`,label:'Weekly Mock Writing',score:wPct})
  const old=loadResults();localStorage.setItem(RESULT_KEY,JSON.stringify([result,...old].slice(0,24)))
  window.dispatchEvent(new Event('toefl-learning-updated'));onSaved?.(result);setStep(4)
 }
 function estimateSpeakingPractice(){
   const wc=model.split(/\s+/).length
   return Math.min(82,55+Math.round(wc/12))
 }
 if(step===4){const r=latestMockResult();return <Result result={r} onClose={onClose}/>}
 return <div className="mock-test-page">
  <section className="panel mock-head"><div><span className="eyebrow">Weekly TOEFL practice test</span><h2>Mock Test · Week {seed+1}</h2><p>Short 20–30 minute diagnostic. Scores are practice estimates, not official ETS scores.</p></div><button onClick={onClose}>×</button></section>
  <div className="mock-stepper">{['Reading','Listening','Speaking','Writing'].map((x,i)=><button className={step===i?'active':step>i?'done':''} onClick={()=>setStep(i)} key={x}><span>{step>i?'✓':i+1}</span>{x}</button>)}</div>
  {step===0&&<section className="panel mock-section"><span className="eyebrow">Reading · 5 questions</span><h3>{topics[idx][0]}</h3><div className="mock-passage">{passage}</div><Questions qs={readingQs} answers={reading} setAnswers={setReading}/><Next onClick={()=>setStep(1)} disabled={Object.keys(reading).length<5}/></section>}
  {step===1&&<section className="panel mock-section"><span className="eyebrow">Listening · 5 questions</span><h3>Listen once before answering</h3><button className="primary-skill-btn" onClick={()=>speak(listen.join(' '))}>▶ Play listening</button><Questions qs={listenQs} answers={listening} setAnswers={setListening}/><Next onClick={()=>setStep(2)} disabled={Object.keys(listening).length<5}/></section>}
  {step===2&&<section className="panel mock-section"><span className="eyebrow">Speaking · 60 seconds</span><h3>{sp}</h3><p className="mock-tip">Prepare briefly, then answer in your own words. After recording, compare yourself with the sample and choose the closest practice level.</p><AudioRecorder maxSeconds={60} skill="Speaking" practiceId={`weekly-mock-${seed}`} practiceLabel={sp}/><details className="mock-model"><summary>Show model after recording</summary><p>{model}</p><button onClick={()=>speak(model)}>🔊 Listen model</button></details><div className="self-score"><strong>How close was your response?</strong>{[[55,'Needs work'],[70,'Developing'],[82,'Good'],[92,'Strong']].map(([v,l])=><button className={speakingScore===v?'active':''} onClick={()=>setSpeakingScore(v)} key={v}>{l}</button>)}</div><Next onClick={()=>setStep(3)} disabled={!speakingScore}/></section>}
  {step===3&&<section className="panel mock-section"><span className="eyebrow">Writing · short response</span><h3>{wp}</h3><textarea className="mock-writing" value={writing} onChange={e=>setWriting(e.target.value)} placeholder="Write about 120–180 words…"/><div className="writing-meta">{writing.trim()?writing.trim().split(/\s+/).length:0} words</div><div className="writing-checks">{['Clear position','At least 2 supporting reasons/details','Specific example','Conclusion / final takeaway'].map((x,i)=><label key={x}><input type="checkbox" checked={!!writingChecks[i]} onChange={e=>setWritingChecks(v=>({...v,[i]:e.target.checked}))}/>{x}</label>)}</div><button className="primary-skill-btn finish-mock" disabled={(writing.trim().split(/\s+/).filter(Boolean).length)<80} onClick={finish}>Finish & estimate score</button></section>}
 </div>
}
function Questions({qs,answers,setAnswers}){return <div className="mock-questions">{qs.map((q,i)=><div className="mock-q" key={i}><strong>{i+1}. {q.q}</strong>{q.options.map((x,j)=><label key={j}><input type="radio" name={`q-${i}`} checked={Number(answers[i])===j} onChange={()=>setAnswers(a=>({...a,[i]:j}))}/><span>{x}</span></label>)}</div>)}</div>}
function Next({onClick,disabled}){return <div className="mock-next"><button className="primary-skill-btn" disabled={disabled} onClick={onClick}>Next section →</button></div>}
function Result({result,onClose}){if(!result)return null;return <div className="mock-test-page"><section className="panel mock-result"><span className="eyebrow">Practice estimate</span><h2>Estimated TOEFL: {result.overall.toFixed(1)} / 6</h2><p className="mock-equivalent">Approx. comparable legacy total: <strong>~{result.comparable120}/120</strong></p><div className="mock-section-scores">{Object.entries(result.sections).map(([k,v])=><div key={k}><span>{k}</span><strong>{v.toFixed(1)}</strong><small>practice {result.practice30[k]}/30</small></div>)}</div><div className="mock-disclaimer">This is an in-app diagnostic estimate based on a short practice set and self-assessed productive tasks. It is not an official TOEFL score or an ETS scoring algorithm.</div><button className="primary-skill-btn" onClick={onClose}>Back to My Learning</button></section></div>}
