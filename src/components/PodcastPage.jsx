import { useEffect, useMemo, useState } from 'react'
import { podcastLessons, PODCAST_LEVELS } from '../data/podcasts'
import ReadAlongPlayer from './ReadAlongPlayer'
import AudioRecorder from './AudioRecorder'
import LibrarySearchFilter from './LibrarySearchFilter'
import TranslateButton from './TranslateButton'
import StatusFilter from './StatusFilter'
import CompleteControl from './CompleteControl'
import { countStatus, getContentState, markStarted } from '../lib/contentProgress'

export default function PodcastPage(){
 const [cat,setCat]=useState('All'),[query,setQuery]=useState(''),[selected,setSelected]=useState(1),[level,setLevel]=useState('Easy'),[show,setShow]=useState(false),[status,setStatus]=useState('All'),[statusTick,setStatusTick]=useState(0)
 const cats=['All',...new Set(podcastLessons.map(x=>x.category))]
 const baseList=useMemo(()=>podcastLessons.filter(x=>(cat==='All'||x.category===cat)&&(!query||`${x.title} ${x.topic} ${x.angle}`.toLowerCase().includes(query.toLowerCase()))),[cat,query])
 const list=useMemo(()=>baseList.filter(x=>status==='All'||getContentState('Podcast',x.id).status===status),[baseList,status,statusTick])
 const progressCounts=countStatus('Podcast',podcastLessons)
 const filterCounts=countStatus('Podcast',baseList)
useEffect(()=>{const f=()=>setStatusTick(x=>x+1);window.addEventListener('toefl-content-status-updated',f);return()=>window.removeEventListener('toefl-content-status-updated',f)},[])
 const lesson=podcastLessons.find(x=>x.id===selected&&list.some(y=>y.id===x.id))||list[0]
 if(!lesson)return null
 const cur=lesson.levels[level]
 const listen=()=>{if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(cur.script.join(' '));u.lang='en-US';u.rate=cur.rate;speechSynthesis.speak(u)}
 return <div className="skill-library-page">
  <section className="panel skill-hero"><div><span className="eyebrow">Long-form listening</span><h2>Podcast Library</h2><p>500 short browser-native podcasts. Listen blind first, reveal the transcript, replay with highlighting, then summarize aloud.</p></div><div className="skill-count"><strong>{progressCounts.completed}</strong><span>of 500 completed</span></div></section>
  <LibrarySearchFilter query={query} placeholder="Search podcasts" categories={cats} activeCategory={cat} countForCategory={c=>c==='All'?podcastLessons.length:podcastLessons.filter(x=>x.category===c).length} onQueryChange={value=>{setQuery(value);setStatus('All');setSelected(0)}} onCategoryChange={c=>{setCat(c);setQuery('');setStatus('All');setSelected(0)}}/>
 <StatusFilter value={status} onChange={v=>{setStatus(v);setSelected(0)}} counts={filterCounts}/>
 <div className="skill-layout"><aside key={`${cat}-${query}`} className="panel skill-index"><div className="skill-list">{list.map(x=><button key={x.id} className={lesson.id===x.id?'active':''} onClick={()=>{markStarted('Podcast',x.id,x.title);setSelected(x.id);setShow(false)}}><span className={`content-status-dot ${getContentState('Podcast',x.id).status==='Completed'?'done':getContentState('Podcast',x.id).status==='Need Review'?'review':''}`}>{getContentState('Podcast',x.id).status==='Completed'?'✓':String(x.id).padStart(3,'0')}</span><div><strong>{x.topic}</strong><small>{x.angle} · {getContentState('Podcast',x.id).status}</small></div></button>)}</div></aside>
  <div className="skill-detail">
   <section className="panel skill-title"><span className="eyebrow">{lesson.category} · Podcast {lesson.id}/500</span><h2>{lesson.title}</h2><CompleteControl type="Podcast" id={lesson.id} label={lesson.title}/><div className="level-tabs library-level-tabs">{PODCAST_LEVELS.map(x=><button key={x} className={level===x?'active':''} onClick={()=>{setLevel(x);setShow(false)}}>{x}</button>)}</div><p>{cur.script.length} sentences · speed {cur.rate}×</p><TranslateButton text={cur.script} /></section>
   {!show?<section className="panel blind-listen"><h3>1. Listen without transcript</h3><p>Focus on the main idea, transitions, and supporting examples.</p><button className="primary-skill-btn" onClick={listen}>▶ Play podcast</button><button className="secondary-skill-btn" onClick={()=>setShow(true)}>Reveal transcript</button></section>:<ReadAlongPlayer key={`${lesson.id}-${level}`} title="2. Transcript & read-along" lines={cur.script} label="Podcast transcript" rate={cur.rate} mode="listening"/>}
   <section className="practice-card"><span className="eyebrow">3. Speaking summary</span><h3>Explain what you heard</h3><p className="prompt-text">Summarize the main idea, one supporting detail, and the final takeaway in your own words.</p><AudioRecorder key={`pod-${lesson.id}-${level}`} maxSeconds={level==='Easy'?40:level==='Developing'?50:60} skill="Podcast" practiceId={`podcast:${lesson.id}`} practiceLabel={lesson.title} completionType="Podcast" completionId={lesson.id} completionLabel={lesson.title} completeOnRecord/></section>
  </div></div>
 </div>
}
