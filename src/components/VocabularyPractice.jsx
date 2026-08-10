import AudioRecorder from './AudioRecorder'

export default function VocabularyPractice({ items = [] }) {
  function speak(text) {
    speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'; utter.rate = .9
    speechSynthesis.speak(utter)
  }
  return (
    <section className="panel vocab-practice-panel">
      <div className="panel-head"><h3>Vocabulary practice</h3><span>{items.length} sentences</span></div>
      <p className="panel-note">Listen, repeat, then record yourself. Recordings are temporary and disappear after refresh.</p>
      <div className="vocab-sentence-list">
        {items.map((item, i) => <article className="vocab-sentence" key={`${item.word}-${i}`}>
          <div className="vocab-line"><span className="vocab-index">{i+1}</span><p>{highlightWord(item.sentence, item.word)}</p><button className="listen-icon" onClick={()=>speak(item.sentence)} aria-label={`Listen to ${item.word}`}>🔊</button></div>
          <AudioRecorder maxSeconds={18} compact targetText={item.sentence} />
        </article>)}
      </div>
    </section>
  )
}

function highlightWord(sentence, word) {
  const regex = new RegExp(`(${escapeRegex(word)})`, 'ig')
  return sentence.split(regex).map((part, i) => part.toLowerCase() === word.toLowerCase() ? <mark key={i}>{part}</mark> : part)
}
function escapeRegex(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
