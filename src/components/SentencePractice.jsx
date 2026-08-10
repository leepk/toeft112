import { useState } from 'react'
import AudioRecorder from './AudioRecorder'

export default function SentencePractice({ sentences }) {
  const [active, setActive] = useState(0)
  const sentence = sentences[active]
  function speak(text) {
    speechSynthesis.cancel(); const utter = new SpeechSynthesisUtterance(text); utter.lang='en-US'; utter.rate=.9; speechSynthesis.speak(utter)
  }
  return (
    <section className="practice-card">
      <div className="practice-top"><div><span className="eyebrow">Shadowing mode</span><h3>Listen → Repeat → Compare</h3></div><span className="step-count">{active + 1}/{sentences.length}</span></div>
      <div className="sentence-box"><p>{sentence}</p><button className="listen-btn" onClick={() => speak(sentence)}>🔊 Listen</button></div>
      <AudioRecorder key={active} maxSeconds={20} targetText={sentence} skill="Pronunciation" practiceId={`sentence:${sentence}`} practiceLabel={sentence}/>
      <div className="sentence-nav"><button disabled={active===0} onClick={()=>setActive(v=>v-1)}>‹ Previous</button><button disabled={active===sentences.length-1} onClick={()=>setActive(v=>v+1)}>Next ›</button></div>
    </section>
  )
}
