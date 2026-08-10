import { useEffect, useMemo, useState } from 'react'
import { conversationLessons, CONVERSATION_LEVELS } from '../data/conversation'
import ReadAlongPlayer from './ReadAlongPlayer'
import SentencePractice from './SentencePractice'
import AudioRecorder from './AudioRecorder'
import LibrarySearchFilter from './LibrarySearchFilter'
import TranslateButton from './TranslateButton'
import StatusFilter from './StatusFilter'
import CompleteControl from './CompleteControl'
import { countStatus, getContentState, markStarted } from '../lib/contentProgress'

export default function ConversationPage(){
 const [cat,setCat]=useState('All'),[query,setQuery]=useState(''),[selected,setSelected]=useState(1),[level,setLevel]=useState('Easy'),[status,setStatus]=useState('All'),[statusTick,setStatusTick]=useState(0)
 const cats=['All',...new Set(conversationLessons.map(x=>x.category))]
 const baseList=useMemo(()=>conversationLessons.filter(x=>(cat==='All'||x.category===cat)&&(!query||`${x.title} ${x.topic} ${x.intent}`.toLowerCase().includes(query.toLowerCase()))),[cat,query])
 const list=useMemo(()=>baseList.filter(x=>status==='All'||getContentState('Conversation',x.id).status===status),[baseList,status,statusTick])
 const progressCounts=countStatus('Conversation',conversationLessons)
 const filterCounts=countStatus('Conversation',baseList)
useEffect(()=>{const f=()=>setStatusTick(x=>x+1);window.addEventListener('toefl-content-status-updated',f);return()=>window.removeEventListener('toefl-content-status-updated',f)},[])
 const lesson=conversationLessons.find(x=>x.id===selected&&list.some(y=>y.id===x.id))||list[0]
 if(!lesson)return null
 const lines=lesson.levels[level]
 const userLines=lines.filter(x=>x.startsWith('You:')).map(x=>x.replace(/^You:\s*/,''))
 return <div className="skill-library-page">
  <section className="panel skill-hero"><div><span className="eyebrow">Reflex training</span><h2>Conversation</h2><p>Listen to realistic dialogue, repeat useful lines, then role-play without reading. Practice quick responses for daily life, work, healthcare, travel, and more.</p></div><div className="skill-count"><strong>{progressCounts.completed}</strong><span>of 1000 completed</span></div></section>
  <LibrarySearchFilter query={query} placeholder="Search conversation" categories={cats} activeCategory={cat} countForCategory={c=>c==='All'?conversationLessons.length:conversationLessons.filter(x=>x.category===c).length} onQueryChange={value=>{setQuery(value);setStatus('All');setSelected(0)}} onCategoryChange={c=>{setCat(c);setQuery('');setStatus('All');setSelected(0)}}/>
 <StatusFilter value={status} onChange={v=>{setStatus(v);setSelected(0)}} counts={filterCounts}/>
 <div className="skill-layout"><aside key={`${cat}-${query}`} className="panel skill-index"><div className="skill-list">{list.map(x=><button key={x.id} className={lesson.id===x.id?'active':''} onClick={()=>{markStarted('Conversation',x.id,x.title);setSelected(x.id)}}><span className={`content-status-dot ${getContentState('Conversation',x.id).status==='Completed'?'done':getContentState('Conversation',x.id).status==='Need Review'?'review':''}`}>{getContentState('Conversation',x.id).status==='Completed'?'✓':String(x.id).padStart(4,'0')}</span><div><strong>{x.topic}</strong><small>{x.intent} · {getContentState('Conversation',x.id).status}</small></div></button>)}</div></aside>
  <div className="skill-detail">
   <section className="panel skill-title"><span className="eyebrow">{lesson.category} · {lesson.roles}</span><h2>{lesson.title}</h2><CompleteControl type="Conversation" id={lesson.id} label={lesson.title}/><div className="level-tabs library-level-tabs">{CONVERSATION_LEVELS.map(x=><button key={x} className={level===x?'active':''} onClick={()=>setLevel(x)}>{x}</button>)}</div><p>{lesson.prompt}</p><TranslateButton text={[lesson.prompt,...lines]} /></section>
   <ReadAlongPlayer key={`${lesson.id}-${level}`} title="1. Listen to the dialogue" lines={lines} label="Conversation audio & read-along" rate={level==='Easy'?.78:level==='Developing'?.88:level==='Intermediate'?.98:1.06} mode="listening"/>
   <SentencePractice key={`repeat-${lesson.id}-${level}`} sentences={userLines}/>
   <section className="practice-card"><span className="eyebrow">3. Role-play</span><h3>Answer without reading</h3><p className="prompt-text">{lesson.challenge}</p><div className="role-cues">{lines.filter(x=>!x.startsWith('You:')).map((x,i)=><p key={i}>{x}</p>)}</div><AudioRecorder key={`role-${lesson.id}-${level}`} maxSeconds={level==='Easy'?35:level==='Developing'?50:70} skill="Conversation" practiceId={`conversation:${lesson.id}`} practiceLabel={lesson.title} completionType="Conversation" completionId={lesson.id} completionLabel={lesson.title} completeOnRecord/></section>
  </div></div>
 </div>
}
