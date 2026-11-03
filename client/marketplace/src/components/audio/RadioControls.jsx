import { useRadio } from '../../context/RadioContext'
const clock = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
export default function RadioControls() {
  const radio = useRadio()
  if (radio.track?.source.type !== 'audio') return null
  return <div className="radio-controls">
    <div className="radio-transport">
      <button type="button" aria-label="Preview anterior" disabled={radio.queue.length < 2 || radio.loading} onClick={() => radio.step(-1)}>↤</button>
      <button className="radio-play" type="button" aria-label={radio.playing ? 'Pausar audio' : 'Reproducir audio'} aria-pressed={radio.playing} disabled={radio.loading} onClick={radio.toggle}>{radio.playing ? 'Ⅱ' : '▶'}</button>
      <button type="button" aria-label="Preview siguiente" disabled={radio.queue.length < 2 || radio.loading} onClick={() => radio.step(1)}>↦</button>
    </div>
    <label className="radio-progress"><span>{clock(radio.time)}</span><input aria-label="Posición del preview" type="range" min="0" max={radio.duration || 1} step=".1" value={Math.min(radio.time, radio.duration || 1)} disabled={!radio.duration} onChange={event => radio.seek(event.target.value)} /><span>{clock(radio.duration)}</span></label>
    <label className="radio-volume">Volumen<input aria-label="Volumen" type="range" min="0" max="1" step=".01" value={radio.volume} onChange={event => radio.changeVolume(event.target.value)} /></label>
  </div>
}
