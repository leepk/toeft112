import AudioRecorder from './AudioRecorder'
import SentencePractice from './SentencePractice'
import ReadAlongPlayer from './ReadAlongPlayer'

export default function SpeakingPractice({ lesson }) {
  const sentences = lesson.speaking?.sentences || []
  return (
    <div className="speaking-stack">
      {lesson.speaking?.model?.length > 0 && <ReadAlongPlayer title="Model response" lines={lesson.speaking.model} label="Listen & follow" mode="speaking" rate={0.9}/>} 
      {sentences.length > 0 && <SentencePractice sentences={sentences}/>} 
      <section className="practice-card full-answer">
        <div className="practice-top"><div><span className="eyebrow">Full response</span><h3>Record without restarting</h3></div><span className="step-count">60 sec</span></div>
        <p className="prompt-text">{lesson.speakingPrompt}</p>
        <AudioRecorder maxSeconds={60}/>
      </section>
    </div>
  )
}
