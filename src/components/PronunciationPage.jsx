import { useEffect, useMemo, useState } from 'react'
import { pronunciationCategories, pronunciationLessons } from '../data/pronunciation'
import { lessons } from '../data/course'
import AudioRecorder from './AudioRecorder'
import ReadAlongPlayer from './ReadAlongPlayer'
import LibrarySearchFilter from './LibrarySearchFilter'
import StatusFilter from './StatusFilter'
import CompleteControl from './CompleteControl'
import { countStatus, getContentState, markStarted } from '../lib/contentProgress'

export default function PronunciationPage() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(pronunciationLessons[0].id)
  const [status,setStatus]=useState('All')
  const [statusTick,setStatusTick]=useState(0)
  const baseFiltered = pronunciationLessons.filter(x => (category === 'All' || x.category === category) && `${x.title} ${x.pattern} ${x.examples.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  const filtered = baseFiltered.filter(x=>status==='All'||getContentState('Pronunciation',x.id).status===status)
  const progressCounts=countStatus('Pronunciation',pronunciationLessons)
  const filterCounts=countStatus('Pronunciation',baseFiltered)
  const item = pronunciationLessons.find(x => x.id === activeId && filtered.some(y=>y.id===x.id)) || filtered[0] || pronunciationLessons[0]
  const related = useMemo(() => {
    const words = [...new Set(lessons.flatMap(l => l.vocabulary))]
    return words.filter(w => item.match?.test(w)).slice(0, 12)
  }, [item])

  useEffect(()=>{const f=()=>setStatusTick(x=>x+1);window.addEventListener('toefl-content-status-updated',f);return()=>window.removeEventListener('toefl-content-status-updated',f)},[])

  function speak(text, rate=.82) {
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang='en-US'; u.rate=rate; speechSynthesis.speak(u)
  }

  return <div className="pronounce-page">
    <section className="pronounce-hero panel">
      <div><span className="eyebrow">Pronunciation course</span><h2>Recognize patterns. Hear them. Say them.</h2><p>{pronunciationLessons.length} browser-native lessons for sounds, spelling patterns, stress, rhythm, connected speech, academic chunks and daily conversation.</p></div>
      <div className="pronounce-count"><strong>{progressCounts.completed}</strong><span>of {pronunciationLessons.length} completed</span></div>
    </section>

    <LibrarySearchFilter query={query} placeholder="Search pronunciation" categories={pronunciationCategories} activeCategory={category}
      countForCategory={c=>c==='All'?pronunciationLessons.length:pronunciationLessons.filter(x=>x.category===c).length}
      onQueryChange={value=>{setQuery(value);setStatus('All');setActiveId(null)}} onCategoryChange={c=>{setCategory(c);setQuery('');setStatus('All');setActiveId(null)}}/>
    <StatusFilter value={status} onChange={v=>{setStatus(v);setActiveId(null)}} counts={filterCounts}/>
    <div className="pronounce-layout">
      <aside key={`${category}-${query}`} className="pronounce-index panel">
        <div className="pronounce-list">{filtered.map((x,i)=><button key={x.id} className={item.id===x.id?'active':''} onClick={()=>{markStarted('Pronunciation',x.id,x.title);setActiveId(x.id)}}><span className={`content-status-dot ${getContentState('Pronunciation',x.id).status==='Completed'?'done':getContentState('Pronunciation',x.id).status==='Need Review'?'review':''}`}>{getContentState('Pronunciation',x.id).status==='Completed'?'✓':String(pronunciationLessons.indexOf(x)+1).padStart(2,'0')}</span><div><strong>{x.title}</strong><small>{x.category} · {getContentState('Pronunciation',x.id).status}</small></div></button>)}</div>
      </aside>

      <div className="pronounce-detail">
        <section className="panel pronunciation-rule">
          <span className="eyebrow">{item.category}</span><h2>{item.title}</h2><CompleteControl type="Pronunciation" id={item.id} label={item.title}/>
          <div className="rule-grid"><div><small>HOW TO RECOGNIZE</small><p>{item.pattern}</p></div><div><small>MOUTH / TONGUE</small><p>{item.mouth}</p></div></div>
        </section>

        <section className="panel"><div className="panel-head"><h3>Sound examples</h3><span>Tap to hear</span></div><div className="sound-example-grid">{item.examples.map(x=><button key={x} onClick={()=>speak(x)}>🔊 <strong>{x}</strong></button>)}</div></section>

        <ReadAlongPlayer title="Practice the phrase groups" label="Chunk practice" lines={item.phrases} rate={0.78} mode="speaking"/>

        <section className="practice-card pronounce-record"><div className="practice-top"><div><span className="eyebrow">Pronounce & score</span><h3>Listen → Record → Match</h3></div></div>
          <div className="sentence-box"><p>{item.sentence}</p><button className="listen-btn" onClick={()=>speak(item.sentence,.82)}>🔊 Listen</button></div>
          <AudioRecorder key={item.id} maxSeconds={25} targetText={item.sentence} skill="Pronunciation" practiceId={`pronounce:${item.id}`} practiceLabel={item.title} completionType="Pronunciation" completionId={item.id} completionLabel={item.title}/>
        </section>

        {related.length > 0 && <section className="panel"><div className="panel-head"><h3>From your TOEFL vocabulary</h3><span>{related.length} related</span></div><div className="related-vocab">{related.map(w=><button key={w} onClick={()=>speak(w)}><span>🔊</span>{w}</button>)}</div></section>}
      </div>
    </div>
  </div>
}
