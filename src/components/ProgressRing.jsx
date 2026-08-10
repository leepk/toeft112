export default function ProgressRing({ value }) {
  return (
    <div className="progress-ring" style={{'--p': `${Math.max(0, Math.min(100, value)) * 3.6}deg`}}>
      <div><strong>{Math.round(value)}%</strong><span>complete</span></div>
    </div>
  )
}
