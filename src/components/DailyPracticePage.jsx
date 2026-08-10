import { useEffect, useMemo, useState } from 'react'
import { pronunciationLessons } from '../data/pronunciation'
import { lessons } from '../data/course'
import AudioRecorder from './AudioRecorder'
import { scoreSpeech } from '../lib/speechScore'
import { recordAttempt } from '../lib/learningTracker'

const SCORE_KEY = 'toefl112-daily-practice-scores'
const DONE_KEY = 'toefl112-daily-practice-done'

function loadJson(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} }
}

function dayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function hash(text) {
  let h = 2166136261
  for (let i=0;i<text.length;i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

function deterministicSort(items, seed) {
  return [...items].sort((a,b) => hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`))
}

function pickWithWeak(items, count, scores, seed) {
  const weak = items
    .filter(x => scores[x.id]?.best < 80)
    .sort((a,b) => (scores[a.id]?.best ?? 0) - (scores[b.id]?.best ?? 0))
  const weakIds = new Set(weak.map(x=>x.id))
  const fresh = deterministicSort(items.filter(x => !weakIds.has(x.id)), seed)
  return [...weak, ...fresh].slice(0, count)
}

function buildVocabularyItems() {
  const map = new Map()
  lessons.forEach(l => (l.vocabularyPractice || []).forEach(v => {
    if (!map.has(v.word)) map.set(v.word, {
      id:`vocab:${v.word}`,
      type:'Vocabulary',
      label:v.word,
      target:v.sentence,
      hint:`Say the sentence naturally. Give extra stress to “${v.word}”.`
    })
  }))
  return [...map.values()]
}

function buildSoundItems() {
  return pronunciationLessons
    .filter(x => x.category === 'Sounds' || x.category === 'Minimal Pairs')
    .map(x => ({
      id:`sound:${x.id}`,
      type:'Sound',
      label:x.title,
      target:x.sentence,
      hint:x.mouth,
      pattern:x.pattern
    }))
}

function buildConversationItems() {
  return pronunciationLessons
    .filter(x => x.category === 'Daily Conversation')
    .map(x => ({
      id:`conversation:${x.id}`,
      type:'Conversation',
      label:x.title,
      target:x.sentence,
      hint:'Say it as one natural thought. Stress the important words and reduce small grammar words.'
    }))
}

export default function DailyPracticePage() {
  const today = dayKey()
  const [scores, setScores] = useState(() => loadJson(SCORE_KEY))
  const [doneMap, setDoneMap] = useState(() => loadJson(DONE_KEY))
  const [activeTab, setActiveTab] = useState('All')
  const [activeIndex, setActiveIndex] = useState(0)

  const soundPool = useMemo(buildSoundItems, [])
  const vocabPool = useMemo(buildVocabularyItems, [])
  const conversationPool = useMemo(buildConversationItems, [])

  const set = useMemo(() => [
    ...pickWithWeak(soundPool, 5, scores, `${today}:sounds`),
    ...pickWithWeak(vocabPool, 10, scores, `${today}:vocab`),
    ...pickWithWeak(conversationPool, 10, scores, `${today}:conversation`),
  ], [today, scores, soundPool, vocabPool, conversationPool])

  const visible = activeTab === 'All' ? set : set.filter(x => x.type === activeTab)
  const doneToday = doneMap[today] || {}
  const completed = set.filter(x => doneToday[x.id]).length
  const average = set.length ? Math.round(set.reduce((n,x)=>n+(scores[x.id]?.last || 0),0) / set.length) : 0
  const weakCount = set.filter(x => (scores[x.id]?.best ?? 100) < 80).length

  useEffect(() => {
    if (activeIndex >= visible.length) setActiveIndex(0)
  }, [activeTab, visible.length, activeIndex])

  function saveScore(item, score) {
    recordAttempt({skill:item.type==='Sound'?'Pronunciation':item.type,id:item.id,label:item.label,score})
    setScores(prev => {
      const old = prev[item.id] || {}
      const next = {
        ...prev,
        [item.id]: { last:score, best:Math.max(old.best || 0, score), attempts:(old.attempts || 0)+1, updatedAt:Date.now() }
      }
      localStorage.setItem(SCORE_KEY, JSON.stringify(next))
      return next
    })
    if (score >= 70) {
      setDoneMap(prev => {
        const next = {...prev, [today]: {...(prev[today] || {}), [item.id]:true}}
        localStorage.setItem(DONE_KEY, JSON.stringify(next))
        return next
      })
    }
  }

  return <div className="daily-practice-page">
    <section className="daily-hero panel">
      <div>
        <span className="eyebrow">15–20 minute daily speaking habit</span>
        <h2>Daily Practice</h2>
        <p>5 sounds + 10 vocabulary sentences + 10 everyday conversation sentences. Items below 80 automatically come back for more practice.</p>
      </div>
      <div className="daily-stats">
        <div><strong>{completed}<small>/25</small></strong><span>done today</span></div>
        <div><strong>{average}<small>/100</small></strong><span>today avg.</span></div>
        <div><strong>{weakCount}</strong><span>weak items</span></div>
      </div>
      <div className="daily-progress"><span style={{width:`${completed/25*100}%`}}/></div>
    </section>

    <div className="daily-tabs">
      {['All','Sound','Vocabulary','Conversation'].map(t => <button key={t} className={activeTab===t?'active':''} onClick={()=>{setActiveTab(t);setActiveIndex(0)}}>{t}{t!=='All' && <small>{set.filter(x=>x.type===t).length}</small>}</button>)}
    </div>

    <div className="daily-layout">
      <aside className="panel daily-list">
        {visible.map((x,i) => {
          const s=scores[x.id]
          return <button key={x.id} className={activeIndex===i?'active':''} onClick={()=>setActiveIndex(i)}>
            <span className={`practice-dot ${doneToday[x.id]?'done':''}`}>{doneToday[x.id]?'✓':i+1}</span>
            <div><strong>{x.label}</strong><small>{x.type}{s ? ` · best ${s.best}` : ' · new'}</small></div>
          </button>
        })}
      </aside>

      <div className="daily-card-wrap">
        {visible[activeIndex] && <DailyPracticeItem
          key={visible[activeIndex].id}
          item={visible[activeIndex]}
          scoreInfo={scores[visible[activeIndex].id]}
          onScore={saveScore}
          position={activeIndex+1}
          total={visible.length}
          onPrev={()=>setActiveIndex(i=>Math.max(0,i-1))}
          onNext={()=>setActiveIndex(i=>Math.min(visible.length-1,i+1))}
        />}
      </div>
    </div>
  </div>
}

function DailyPracticeItem({item, scoreInfo, onScore, position, total, onPrev, onNext}) {
  const [transcript, setTranscript] = useState('')
  const result = transcript ? scoreSpeech(item.target, transcript) : null
  const [savedTranscript, setSavedTranscript] = useState('')

  useEffect(() => {
    if (!transcript || transcript === savedTranscript) return
    const timer = setTimeout(() => {
      const r = scoreSpeech(item.target, transcript)
      if (r.expectedCount > 0) {
        onScore(item, r.score)
        setSavedTranscript(transcript)
      }
    }, 900)
    return () => clearTimeout(timer)
  }, [transcript, savedTranscript, item, onScore])

  function speak(text, rate=.82) {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang='en-US'; u.rate=rate
    speechSynthesis.speak(u)
  }

  return <section className="practice-card daily-practice-card">
    <div className="daily-card-head">
      <div><span className="eyebrow">{item.type} · {position} of {total}</span><h2>{item.label}</h2></div>
      {scoreInfo && <div className={`daily-best ${scoreInfo.best>=80?'good':'weak'}`}><strong>{scoreInfo.best}</strong><span>best</span></div>}
    </div>
    {item.pattern && <div className="daily-rule"><small>RECOGNIZE</small><p>{item.pattern}</p></div>}
    <div className="daily-tip"><small>HOW TO SAY IT</small><p>{item.hint}</p></div>
    <div className="sentence-box daily-target"><p>{item.target}</p><button className="listen-btn" onClick={()=>speak(item.target)}>🔊 Listen slowly</button><button className="listen-btn secondary" onClick={()=>speak(item.target,1)}>▶ Natural speed</button></div>
    <AudioRecorder maxSeconds={30} targetText={item.target} onTranscript={setTranscript}/>
    {result && <div className="daily-result-note">{result.score >= 80 ? '✓ Good — move on when it feels natural.' : result.score >= 70 ? 'Almost there — repeat once more.' : 'Practice again — focus on the highlighted missing/different words.'}</div>}
    <div className="daily-card-nav"><button onClick={onPrev} disabled={position===1}>‹ Previous</button><button onClick={onNext} disabled={position===total}>Next ›</button></div>
  </section>
}
