import { useEffect, useRef, useState } from 'react'
import AudioProgress from './AudioProgress'
import AudioWaveform from './AudioWaveform'

const AudioPlayer = ({ preview }) => {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    setPlaying(false)
    setCurrentTime(0)
    setError('')
  }, [preview?.id])

  const toggle = async () => {
    if (!preview?.url) return
    const audio = audioRef.current
    if (!audio) return
    setError('')
    try {
      if (audio.paused) await audio.play()
      else audio.pause()
    } catch {
      setPlaying(false)
      setError('No se pudo reproducir el audio.')
    }
  }

  return (
    <div className="audio-player">
      {preview?.url && (
        <audio
          ref={audioRef}
          src={preview.url}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onEnded={() => setPlaying(false)}
          onError={() => { setPlaying(false); setError('No se pudo cargar el audio.') }}
        />
      )}
      <button type="button" disabled={!preview?.url} aria-label={playing ? 'Pausar audio' : 'Reproducir audio'} onClick={toggle}>{playing ? 'Ⅱ' : '▶'}</button>
      <div className="audio-player-body">
        <AudioWaveform />
        <AudioProgress value={currentTime} duration={preview?.durationSeconds || 30} />
      </div>
      <span>{preview?.durationSeconds || 30}s</span>
      {error && <p role="alert">{error}</p>}
    </div>
  )
}
export default AudioPlayer
