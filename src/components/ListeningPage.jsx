import { useEffect, useMemo, useState } from 'react'
import { listeningLessons, LEVELS } from '../data/listeningSpeaking'
import ReadAlongPlayer from './ReadAlongPlayer'
import AudioRecorder from './AudioRecorder'
import LevelSamplePractice from './LevelSamplePractice'
import LibrarySearchFilter from './LibrarySearchFilter'
import TranslateButton from './TranslateButton'
import StatusFilter from './StatusFilter'
import CompleteControl from './CompleteControl'
import { countStatus, getContentState, markStarted } from '../lib/contentProgress'

export default function ListeningPage(){
 const [selected,setSelected]=useState(1),[level,setLevel]=useState('Easy'),[query,setQuery]=useState(''),[cat,setCat]=useState('All'),[showText,setShowText]=useState(false),[answers,setAnswers]=useState({}),[status,setStatus]=useState('All'),[statusTick,setStatusTick]=useState(0)
 const cats=['All',...new Set(listeningLessons.map(x=>x.category))]
 const baseList=useMemo(()=>listeningLessons.filter(x=>(cat==='All'||x.category===cat)&&(!query||`${x.title} ${x.category}`.toLowerCase().includes(query.toLowerCase()))),[query,cat])
 const list=useMemo(()=>baseList.filter(x=>status==='All'||getContentState('Listening',x.id).status===status),[baseList,status,statusTick])
 const progressCounts=countStatus('Listening',listeningLessons)
 const filterCounts=countStatus('Listening',baseList)
 const lesson=listeningLessons.find(x=>x.id===selected && list.some(y=>y.id===x.id))||list[0]||listeningLessons[0]
 const current=lesson.levels[level]||lesson.levels.Easy
 useEffect(()=>{setShowText(false);setAnswers({})},[lesson.id,level])
 useEffect(()=>{const f=()=>setStatusTick(x=>x+1);window.addEventListener('toefl-content-status-updated',f);return()=>window.removeEventListener('toefl-content-status-updated',f)},[])
 return <div className="skill-library-page"><section className="panel skill-hero"><div><span className="eyebrow">500 TOEFL / academic lessons · multiple formats</span><h2>Listening Library</h2><p>500 varied lessons across campus conversations, academic lectures, announcements, problem-solving, interviews, narratives, instructions, meetings, phone calls, and reports.</p></div><div className="skill-count"><strong>{progressCounts.completed}</strong><span>of 500 completed</span></div></section>
 <LibrarySearchFilter query={query} placeholder="Search listening" categories={cats} activeCategory={cat} countForCategory={c=>c==='All'?listeningLessons.length:listeningLessons.filter(x=>x.category===c).length} onQueryChange={value=>{setQuery(value);setStatus('All');setSelected(0)}} onCategoryChange={c=>{setCat(c);setQuery('');setStatus('All');setSelected(0)}}/>
 <StatusFilter value={status} onChange={v=>{setStatus(v);setSelected(0)}} counts={filterCounts}/>
 <div className="skill-layout"><aside key={`${cat}-${query}`} className="panel skill-index"><div className="skill-list">{list.map(x=><button key={x.id} className={lesson.id===x.id?'active':''} onClick={()=>{markStarted('Listening',x.id,x.title);setSelected(x.id);setShowText(false)}}><span className={`content-status-dot ${getContentState('Listening',x.id).status==='Completed'?'done':getContentState('Listening',x.id).status==='Need Review'?'review':''}`}>{getContentState('Listening',x.id).status==='Completed'?'✓':String(x.id).padStart(3,'0')}</span><div><strong>{x.title}</strong><small>{x.category} · {getContentState('Listening',x.id).status}</small></div></button>)}</div></aside>
 <div className="skill-detail"><section className="panel skill-title"><span className="eyebrow">Listening lesson {lesson.id}/500</span><h2>{lesson.title}</h2><CompleteControl type="Listening" id={lesson.id} label={lesson.title}/><div className="level-tabs library-level-tabs">{LEVELS.map(x=><button key={x} className={level===x?'active':''} onClick={()=>setLevel(x)}>{x}</button>)}</div><div className="level-guidance"><strong>{level}:</strong> {level==='Easy'?'short sentences and clear main ideas':level==='Developing'?'more details, reasons, and simple contrasts':level==='Intermediate'?'inference, attitude, and longer organization':'natural speed, denser ideas, and full summary structure'}.</div><div className="practice-instruction"><strong>1.</strong> Listen with transcript hidden. <strong>2.</strong> Replay with text. <strong>3.</strong> Answer questions. <strong>4.</strong> Record a summary.</div><TranslateButton text={current.lines} /></section>
 {!showText?<section className="panel blind-listen"><h3>{level} listening — no transcript</h3><p>{current.lines.length} sentences · speed {current.rate}×</p><button className="primary-skill-btn" onClick={()=>speakLines(current.lines,current.rate)}>▶ Play listening</button><button className="secondary-skill-btn" onClick={()=>setShowText(true)}>Reveal transcript</button></section>:<ReadAlongPlayer key={`${lesson.id}-${level}`} title={`${lesson.title} · ${level}`} lines={current.lines} label="Transcript & read-along" rate={current.rate} mode="listening"/>}
 <section className="panel"><div className="panel-head"><h3>Comprehension</h3><span>{current.questions.length} TOEFL-style questions</span></div>{current.questions.map((q,i)=><div className="listen-question" key={i}><strong>{i+1}. {q.q}</strong><button onClick={()=>setAnswers(a=>({...a,[`${lesson.id}-${level}-${i}`]:!a[`${lesson.id}-${level}-${i}`]}))}>{answers[`${lesson.id}-${level}-${i}`]?'Hide answer':'Check answer'}</button>{answers[`${lesson.id}-${level}-${i}`]&&<p>{q.a}</p>}</div>)}</section>
 <LevelSamplePractice title="Speaking from listening — sample by level" eyebrow="Speaking from listening" samples={lesson.summarySamples} maxSeconds={60}/><section className="practice-card"><span className="eyebrow">Your own answer · {level}</span><h3>{current.seconds}–{Math.min(60,current.seconds+10)} second summary</h3><p className="prompt-text">{current.summaryPrompt}</p><AudioRecorder key={`own-${lesson.id}-${level}`} maxSeconds={60} skill="Listening" practiceId={`listen:${lesson.id}`} practiceLabel={lesson.title} completionType="Listening" completionId={lesson.id} completionLabel={lesson.title} completeOnRecord/></section></div></div></div>
}
function speakLines(lines,rate){ if(!('speechSynthesis'in window))return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(lines.join(' '));u.lang='en-US';u.rate=rate;speechSynthesis.speak(u)}
