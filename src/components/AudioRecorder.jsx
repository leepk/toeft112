import { useEffect, useRef, useState } from 'react'
import SpeechScore from './SpeechScore'
import { scoreSpeech } from '../lib/speechScore'
import { recordAttempt } from '../lib/learningTracker'
import { markCompleted, recordContentScore } from '../lib/contentProgress'

// Session-only recorder: recordings live in component memory and disappear on refresh.
// targetText enables browser-side sentence matching from the live speech-recognition transcript.
export default function AudioRecorder({ maxSeconds = 60, onTranscript, compact = false, targetText = '', skill='Speaking', practiceId='', practiceLabel='', completionType='', completionId='', completionLabel='', completeOnRecord=false }) {
  const [state, setState] = useState('idle')
  const [seconds, setSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState('')
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(true)
  const [recognitionSupported, setRecognitionSupported] = useState(true)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const recognitionRef = useRef(null)
  const urlRef = useRef('')

  useEffect(() => () => cleanup(), [])

  useEffect(() => {
    if (!targetText || !transcript?.trim()) return
    const timer=setTimeout(()=>{
      const result=scoreSpeech(targetText, transcript)
      if(result.expectedCount>0) {
        recordAttempt({skill,id:practiceId||targetText.slice(0,60),label:practiceLabel||targetText.slice(0,80),score:result.score})
        if(completionType && completionId) recordContentScore(completionType,completionId,completionLabel||practiceLabel||targetText.slice(0,80),result.score)
      }
    },1100)
    return()=>clearTimeout(timer)
  }, [transcript, targetText, skill, practiceId, practiceLabel, completionType, completionId, completionLabel])


  function cleanup() {
    clearInterval(timerRef.current)
    try { recognitionRef.current?.stop() } catch {}
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
  }

  async function start() {
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error('unsupported')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder
      chunksRef.current = []
      recorder.ondataavailable = e => { if (e.data.size) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        if (urlRef.current) URL.revokeObjectURL(urlRef.current)
        const nextUrl = URL.createObjectURL(blob)
        urlRef.current = nextUrl
        setAudioUrl(nextUrl)
        setState('ready')
        if(completeOnRecord && completionType && completionId) markCompleted(completionType,completionId,completionLabel||practiceLabel||'Practice')
      }
      setupRecognition()
      recorder.start()
      setSeconds(0)
      setTranscript('')
      onTranscript?.('')
      setState('recording')
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s + 1 >= maxSeconds) stop()
          return Math.min(s + 1, maxSeconds)
        })
      }, 1000)
    } catch {
      setSupported(false)
    }
  }

  function setupRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setRecognitionSupported(false); return }
    setRecognitionSupported(true)
    const rec = new SpeechRecognition()
    rec.lang = 'en-US'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = event => {
      let text = ''
      for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript + ' '
      text = text.trim()
      setTranscript(text)
      onTranscript?.(text)
    }
    rec.onerror = () => {}
    try { rec.start(); recognitionRef.current = rec } catch {}
  }

  function stop() {
    clearInterval(timerRef.current)
    try { recognitionRef.current?.stop() } catch {}
    recognitionRef.current = null
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  function remove() {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = ''
    setAudioUrl('')
    setTranscript('')
    onTranscript?.('')
    setSeconds(0)
    setState('idle')
  }

  if (!supported) return <div className="permission-note">Microphone access is required. Use HTTPS or localhost and allow microphone permission.</div>

  return (
    <div className={compact ? 'recorder compact' : 'recorder'}>
      <div className="record-row">
        {state !== 'recording' ?
          <button className="record-btn" onClick={start}>● <span>{audioUrl ? 'Again' : 'Record'}</span></button> :
          <button className="stop-btn" onClick={stop}>■ <span>Stop</span></button>}
        <div className={state === 'recording' ? 'timer live' : 'timer'}>{format(seconds)} / {format(maxSeconds)}</div>
      </div>
      {audioUrl && <div className="playback-row"><audio controls src={audioUrl}/><button className="icon-action danger" onClick={remove} title="Delete temporary recording">⌫</button></div>}
      {transcript && !compact && <div className="transcript"><strong>Recognized</strong><p>{transcript}</p></div>}
      {targetText && transcript && <SpeechScore reference={targetText} transcript={transcript} compact={compact}/>} 
      {targetText && audioUrl && !recognitionSupported && <div className="score-unavailable">Sentence scoring is unavailable in this browser because Speech Recognition is not supported.</div>}
    </div>
  )
}

function format(n) { return `0:${String(n).padStart(2, '0')}` }
