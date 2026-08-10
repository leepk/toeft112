import { useEffect, useMemo, useState } from 'react'
import { domainVocabulary } from '../data/domainVocabulary'
import AudioRecorder from './AudioRecorder'
import LibrarySearchFilter from './LibrarySearchFilter'
import StatusFilter from './StatusFilter'
import CompleteControl from './CompleteControl'
import { countStatus, getContentState, markStarted } from '../lib/contentProgress'

const DOMAINS=['All','Acupuncture','Software','AI & ML','Math']
const vocabKey=x=>`${x.domain}:${x.word}`

export default function DomainVocabularyPage(){
 const [domain,setDomain]=useState('All'),[query,setQuery]=useState(''),[selected,setSelected]=useState(null),[status,setStatus]=useState('All'),[statusTick,setStatusTick]=useState(0)
 const baseList=useMemo(()=>{
   const q=query.trim().toLowerCase()
   return domainVocabulary.filter(x=>{
     const domainOk=domain==='All' || x.domain===domain
     const searchOk=!q || `${x.word} ${x.meaning} ${x.definition} ${x.example}`.toLowerCase().includes(q)
     return domainOk && searchOk
   })
 },[domain,query])
 const list=useMemo(()=>baseList.filter(x=>status==='All'||getContentState('Vocabulary',vocabKey(x)).status===status),[baseList,status,statusTick])
 const progressCounts=countStatus('Vocabulary',domainVocabulary.map(x=>({...x,id:vocabKey(x)})))
 const filterCounts=countStatus('Vocabulary',baseList.map(x=>({...x,id:vocabKey(x)})))
 const item=list.find(x=>vocabKey(x)===selected) || list[0] || null
 useEffect(()=>{const f=()=>setStatusTick(x=>x+1);window.addEventListener('toefl-content-status-updated',f);return()=>window.removeEventListener('toefl-content-status-updated',f)},[])
 function speak(text,rate=.88){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=rate;speechSynthesis.speak(u)}
 return <div className="domain-vocab-page">
  <section className="panel skill-hero"><div><span className="eyebrow">Professional vocabulary trainer</span><h2>Domain Vocabulary</h2><p>Acupuncture, Software Engineering, AI / Machine Learning, and Math. Learn meaning, listen, pronounce, record, and compare your speech.</p></div><div className="skill-count"><strong>{progressCounts.completed}</strong><span>of {domainVocabulary.length} completed</span></div></section>
  <LibrarySearchFilter query={query} placeholder="Search word, meaning, definition…" categories={DOMAINS} activeCategory={domain}
   countForCategory={d=>d==='All'?domainVocabulary.length:domainVocabulary.filter(x=>x.domain===d).length}
   onQueryChange={value=>{setQuery(value);setStatus('All'); const q=value.trim().toLowerCase(); const next=domainVocabulary.find(x=>(domain==='All'||x.domain===domain)&&(!q||`${x.word} ${x.meaning} ${x.definition} ${x.example}`.toLowerCase().includes(q))); setSelected(next?vocabKey(next):null)}}
   onCategoryChange={d=>{setDomain(d);setQuery('');setStatus('All');const next=domainVocabulary.find(x=>d==='All'||x.domain===d);setSelected(next?vocabKey(next):null)}}/>
  <StatusFilter value={status} onChange={v=>{setStatus(v);setSelected(null)}} counts={filterCounts}/>
  <div className="domain-vocab-layout">
   <aside key={`${domain}-${query}`} className="panel domain-word-list">{list.map((x,i)=><button key={`${x.domain}-${x.word}-${i}`} className={item&&vocabKey(item)===vocabKey(x)?'active':''} onClick={()=>{markStarted('Vocabulary',vocabKey(x),x.word);setSelected(vocabKey(x))}}><span className={`content-status-dot ${getContentState('Vocabulary',vocabKey(x)).status==='Completed'?'done':getContentState('Vocabulary',vocabKey(x)).status==='Need Review'?'review':''}`}>{getContentState('Vocabulary',vocabKey(x)).status==='Completed'?'✓':i+1}</span><div><strong>{x.word}</strong><small>{x.meaning} · {getContentState('Vocabulary',vocabKey(x)).status}</small></div></button>)}</aside>
   {item&&<div className="domain-word-detail">
    <section className="panel vocab-focus-card"><span className="eyebrow">{item.domain}</span><CompleteControl type="Vocabulary" id={vocabKey(item)} label={item.word}/><div className="vocab-title-row"><h2>{item.word}</h2><button className="primary-skill-btn" onClick={()=>speak(item.word,.72)}>🔊 Listen word</button></div><h3 className="vn-meaning">{item.meaning}</h3><p className="definition"><strong>English:</strong> {item.definition}</p></section>
    <section className="practice-card"><span className="eyebrow">Pronunciation</span><h3>Say the word</h3><p className="big-practice-word">{item.word}</p><button className="secondary-skill-btn" onClick={()=>speak(item.word,.62)}>🔊 Slow</button><button className="secondary-skill-btn" onClick={()=>speak(item.word,1)}>🔊 Natural</button><AudioRecorder key={`word-${vocabKey(item)}`} maxSeconds={10} targetText={item.word}/></section>
    <section className="practice-card"><span className="eyebrow">Use it in context</span><h3>Example sentence</h3><p className="prompt-text">{item.example}</p><button className="secondary-skill-btn" onClick={()=>speak(item.example,.82)}>🔊 Listen sentence</button><AudioRecorder key={`sentence-${vocabKey(item)}`} maxSeconds={20} targetText={item.example} skill="Vocabulary" practiceId={`vocab:${vocabKey(item)}`} practiceLabel={item.word} completionType="Vocabulary" completionId={vocabKey(item)} completionLabel={item.word}/></section>
   </div>}
  </div>
 </div>
}
