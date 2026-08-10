import ReadAlongPlayer from './ReadAlongPlayer'

export default function LessonContent({ lesson }) {
  const hasReading = lesson.reading?.lines?.length
  const hasListening = lesson.listening?.lines?.length
  if (!hasReading && !hasListening) return null
  return <div className="lesson-content-stack">
    {hasReading && <ReadAlongPlayer title={lesson.reading.title} lines={lesson.reading.lines} label="Reading passage" mode="reading" rate={0.88}/>} 
    {hasListening && <ReadAlongPlayer title={lesson.listening.title} lines={lesson.listening.lines} label="Listening lesson" mode="listening" rate={0.92}/>} 
  </div>
}
