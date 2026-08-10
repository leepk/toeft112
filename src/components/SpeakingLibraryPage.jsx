import { useEffect, useMemo, useState } from 'react'
import { speakingLessons, LEVELS } from '../data/listeningSpeaking'
import ReadAlongPlayer from './ReadAlongPlayer'
import SentencePractice from './SentencePractice'
import AudioRecorder from './AudioRecorder'
import LevelSamplePractice from './LevelSamplePractice'
import LibrarySearchFilter from './LibrarySearchFilter'
import TranslateButton from './TranslateButton'
import StatusFilter from './StatusFilter'
import CompleteControl from './CompleteControl'
import { countStatus, getContentState, markStarted } from '../lib/contentProgress'

export default function SpeakingLibraryPage(){
 const [selected,setSelected]=useState(1),[level,setLevel]=useState('Easy'),[query,setQuery]=useState(''),[cat,setCat]=useState('All'),[status,setStatus]=useState('All'),[statusTick,setStatusTick]=useState(0)
 const cats=['All',...new Set(speakingLessons.map(x=>x.category))]
 const baseList=useMemo(()=>speakingLessons.filter(x=>(cat==='All'||x.category===cat)&&(!query||`${x.title} ${x.category}`.toLowerCase().includes(query.toLowerCase()))),[query,cat])
 const list=useMemo(()=>baseList.filter(x=>status==='All'||getContentState('Speaking',x.id).status===status),[baseList,status,statusTick])
 const progressCounts=countStatus('Speaking',speakingLessons)
 const filterCounts=countStatus('Speaking',baseList)
 const lesson=speakingLessons.find(x=>x.id===selected && list.some(y=>y.id===x.id))||list[0]||speakingLessons[0]
 const current=lesson.levels[level]||lesson.levels.Easy
 useEffect(()=>{const f=()=>setStatusTick(x=>x+1);window.addEventListener('toefl-content-status-updated',f);return()=>window.removeEventListener('toefl-content-status-updated',f)},[])
 return <div className="skill-library-page"><section className="panel skill-hero"><div><span className="eyebrow">500 speaking tasks · multiple formats</span><h2>Speaking Library</h2><p>500 varied tasks across Independent, Choose A/B, Agree/Disagree, Experience, Advice, Problem/Solution, Campus, Integrated, Workplace, and Technical Explanation formats.</p></div><div className="skill-count"><strong>{progressCounts.completed}</strong><span>of 500 completed</span></div></section>
 <LibrarySearchFilter query={query} placeholder="Search speaking" categories={cats} activeCategory={cat} countForCategory={c=>c==='All'?speakingLessons.length:speakingLessons.filter(x=>x.category===c).length} onQueryChange={value=>{setQuery(value);setStatus('All');setSelected(0)}} onCategoryChange={c=>{setCat(c);setQuery('');setStatus('All');setSelected(0)}}/>
 <StatusFilter value={status} onChange={v=>{setStatus(v);setSelected(0)}} counts={filterCounts}/>
 <div className="skill-layout"><aside key={`${cat}-${query}`} className="panel skill-index"><div className="skill-list">{list.map(x=><button key={x.id} className={lesson.id===x.id?'active':''} onClick={()=>{markStarted('Speaking',x.id,x.title);setSelected(x.id)}}><span className={`content-status-dot ${getContentState('Speaking',x.id).status==='Completed'?'done':getContentState('Speaking',x.id).status==='Need Review'?'review':''}`}>{getContentState('Speaking',x.id).status==='Completed'?'✓':String(x.id).padStart(3,'0')}</span><div><strong>{x.title}</strong><small>{x.category} · {getContentState('Speaking',x.id).status}</small></div></button>)}</div></aside>
 <div className="skill-detail"><section className="panel skill-title"><span className="eyebrow">Speaking task {lesson.id}/500</span><h2>{lesson.title}</h2><CompleteControl type="Speaking" id={lesson.id} label={lesson.title}/><div className="level-tabs library-level-tabs">{LEVELS.map(x=><button key={x} className={level===x?'active':''} onClick={()=>setLevel(x)}>{x}</button>)}</div><div className="level-guidance"><strong>{level}:</strong> {level==='Easy'?'short, clear answer with one idea':level==='Developing'?'add a reason, example, and follow-up detail':level==='Intermediate'?'use structure, transitions, and a natural conclusion':'develop a full response with nuance, recovery, and natural pacing'}.</div><p>{current.prompt}</p><TranslateButton text={[current.prompt,...current.model]} /></section>
 <ReadAlongPlayer key={`model-${lesson.id}-${level}`} title={`${level} model response`} lines={current.model} label="Listen & follow" mode="speaking" rate={current.rate}/><SentencePractice key={`shadow-${lesson.id}-${level}`} sentences={current.sentences}/><LevelSamplePractice title="Answer without restarting — sample by level" eyebrow="Recovery & self-correction" samples={lesson.restartSamples} maxSeconds={60}/><section className="practice-card"><span className="eyebrow">Your own response · {level}</span><h3>Answer without restarting</h3><p className="prompt-text">{current.prompt}</p><div className="recovery-tip"><strong>Useful recovery phrases:</strong> Actually, let me say that again. · Let me rephrase that. · What I mean is… · More specifically…</div><AudioRecorder key={`own-${lesson.id}-${level}`} maxSeconds={current.seconds} skill="Speaking" practiceId={`speak:${lesson.id}`} practiceLabel={lesson.title} completionType="Speaking" completionId={lesson.id} completionLabel={lesson.title} completeOnRecord/></section></div></div></div>
}
