import { scoreSpeech } from '../lib/speechScore'

export default function SpeechScore({ reference, transcript, compact = false }) {
  if (!transcript?.trim() || !reference?.trim()) return null
  const result = scoreSpeech(reference, transcript)

  return (
    <div className={compact ? 'speech-score compact' : 'speech-score'}>
      <div className="score-summary">
        <div className={`score-number score-${band(result.score)}`}>{result.score}<small>/100</small></div>
        <div><strong>{result.label}</strong><span>{result.matched}/{result.expectedCount} words matched</span></div>
      </div>
      <div className="score-meter"><span style={{ width: `${result.score}%` }} /></div>
      {!compact && <>
        <div className="match-text" aria-label="Sentence match result">
          {result.referenceTokens.map((token, i) => (
            <span key={`${token.word}-${i}`} className={`match-word ${token.status}`} title={token.status === 'wrong' ? `Heard: ${token.heard}` : token.status}>{token.word}</span>
          ))}
        </div>
        <div className="score-stats">
          <span>✓ {result.matched} correct</span>
          <span>○ {result.missing} missing</span>
          <span>↔ {result.replaced} different</span>
          <span>+ {result.extra} extra</span>
        </div>
        {result.extraWords.length > 0 && <p className="extra-words"><strong>Extra:</strong> {result.extraWords.join(', ')}</p>}
      </>}
    </div>
  )
}

function band(score) {
  if (score >= 85) return 'high'
  if (score >= 70) return 'mid'
  return 'low'
}
