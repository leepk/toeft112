import { useEffect, useMemo, useRef, useState } from 'react'
import TranslateButton from './TranslateButton'

export default function ReadAlongPlayer({ title, lines = [], label = 'Read along', rate = 0.9, mode = 'reading' }) {
  const [activeLine, setActiveLine] = useState(-1)
  const [activeChar, setActiveChar] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(rate)
  const utterRef = useRef(null)
  const text = useMemo(() => lines.join(' '), [lines])
  const offsets = useMemo(() => {
    let pos = 0
    return lines.map(line => { const start = pos; pos += line.length + 1; return start })
  }, [lines])

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  function stop() {
    window.speechSynthesis?.cancel()
    utterRef.current = null
    setPlaying(false)
    setActiveLine(-1)
    setActiveChar(-1)
  }

  function play() {
    if (!('speechSynthesis' in window)) return
    stop()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = speed
    utter.onstart = () => { setPlaying(true); setActiveLine(0); setActiveChar(0) }
    utter.onboundary = e => {
      const idx = Math.max(0, e.charIndex || 0)
      let lineIndex = 0
      for (let i = 0; i < offsets.length; i++) if (offsets[i] <= idx) lineIndex = i
      setActiveLine(lineIndex)
      setActiveChar(idx - offsets[lineIndex])
    }
    utter.onend = stop
    utter.onerror = stop
    utterRef.current = utter
    window.speechSynthesis.speak(utter)
  }

  return (
    <section className={`readalong ${mode}`}>
      <div className="readalong-head">
        <div><span className="eyebrow">{label}</span><h4>{title}</h4></div>
        <div className="player-actions">
          <select value={speed} onChange={e=>setSpeed(Number(e.target.value))} aria-label="Speech speed">
            <option value="0.75">0.75×</option><option value="0.9">0.9×</option><option value="1">1×</option><option value="1.1">1.1×</option>
          </select>
          {!playing ? <button onClick={play}>▶ Play</button> : <button className="stop-mini" onClick={stop}>■ Stop</button>}
        </div>
      </div>
      <div className="readalong-text">
        {lines.map((line, i) => <p key={i} className={i === activeLine ? 'active-line' : ''}>{i === activeLine ? <HighlightedLine text={line} charIndex={activeChar}/> : line}</p>)}
      </div>
      <TranslateButton text={lines} />
    </section>
  )
}

function HighlightedLine({ text, charIndex }) {
  const safe = Math.max(0, Math.min(charIndex, text.length))
  const rest = text.slice(safe)
  const match = rest.match(/^\S+/)
  const word = match?.[0] || ''
  return <><span>{text.slice(0, safe)}</span><mark>{word}</mark><span>{text.slice(safe + word.length)}</span></>
}
