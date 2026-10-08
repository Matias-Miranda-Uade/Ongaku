const AudioProgress = ({ value = 0, duration = 30 }) => {
  const percentage = duration ? Math.min(100, (value / duration) * 100) : 0
  return (
    <div className="audio-progress" aria-label="Progreso del audio">
      <span style={{ width: `${percentage}%` }} />
    </div>
  )
}
export default AudioProgress
