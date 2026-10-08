import { useEffect, useRef, useState } from 'react'
import AudioProgress from './AudioProgress'
import AudioWaveform from './AudioWaveform'

const AudioPlayer = ({ preview }) => {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    setPlaying(false)
    setCurrentTime(0)
  }, [preview?.id])

  const toggle = () => {
    if (!preview?.url) {
      setPlaying((current) => !current)
      return
    }
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play()
    else audio.pause()
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
        />
      )}
      <button type="button" onClick={toggle}>{playing ? 'Ⅱ' : '▶'}</button>
      <div className="audio-player-body">
        <AudioWaveform />
        <AudioProgress value={currentTime} duration={preview?.durationSeconds || 30} />
      </div>
      <span>{preview?.durationSeconds || 30}s</span>
    </div>
  )
}
export default AudioPlayer
