import { useEffect, useMemo, useState } from 'react'
import ReadAlongPlayer from './ReadAlongPlayer'
import SentencePractice from './SentencePractice'
import AudioRecorder from './AudioRecorder'

const LEVELS = ['Easy', 'Developing', 'Intermediate', 'Advanced']

export default function LevelSamplePractice({ title='Sample answers by level', samples={}, eyebrow='Copy the model', maxSeconds=60 }) {
  const available = useMemo(() => LEVELS.filter(level => samples?.[level]?.length), [samples])
  const [level, setLevel] = useState(available[0] || 'Easy')

  useEffect(() => {
    if (!available.includes(level)) setLevel(available[0] || 'Easy')
  }, [available.join('|')])

  const lines = samples?.[level] || []
  if (!lines.length) return null
  const fullText = lines.join(' ')

  return (
    <section className="practice-card level-sample-practice">
      <div className="practice-top">
        <div><span className="eyebrow">{eyebrow}</span><h3>{title}</h3></div>
        <span className="step-count">{level}</span>
      </div>
      <div className="level-tabs" role="tablist" aria-label="Sample answer level">
        {available.map(item => <button key={item} className={item===level?'active':''} onClick={()=>setLevel(item)}>{item}</button>)}
      </div>
      <div className="level-guidance">
        {level==='Easy' && 'Short, clear sentences. Copy the rhythm first.'}
        {level==='Developing' && 'Add a reason or detail with because, so, or but.'}
        {level==='Intermediate' && 'Use a clear structure: main idea → detail → result.'}
        {level==='Advanced' && 'Paraphrase naturally, use transitions, and recover smoothly if you self-correct.'}
      </div>
      <ReadAlongPlayer key={`read-${level}`} title={`${level} sample`} lines={lines} label="Listen to sample" mode="speaking" rate={level==='Advanced'?1:.88}/>
      <SentencePractice key={`shadow-${level}`} sentences={lines}/>
      <div className="full-sample-record">
        <strong>Now copy the full sample</strong>
        <p>Try to keep the same meaning, rhythm, and sentence order. Your match score is based on the sample text.</p>
        <AudioRecorder key={`full-${level}`} maxSeconds={maxSeconds} targetText={fullText}/>
      </div>
    </section>
  )
}
