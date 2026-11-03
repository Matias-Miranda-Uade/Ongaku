import { useEffect } from 'react'
import { hasPreview, useRadio } from '../../context/RadioContext'
import AudioVisualizer from './AudioVisualizer'
import RadioControls from './RadioControls'

export default function AudioPreview({ vinyl, onPlaybackChange }) {
  const radio = useRadio()
  const active = String(radio.track?.vinyl.id) === String(vinyl.id)
  useEffect(() => { onPlaybackChange?.(active && radio.playing) }, [active, radio.playing, onPlaybackChange])
  if (!hasPreview(vinyl)) return null
  return <section className="audio-preview-section detail-radio-preview">
    <div><p className="eyebrow">PREVIEW / ONGAKU RADIO</p><h2>Escuchá el vinilo</h2><p>Tu música sigue sonando mientras explorás.</p></div>
    <div>
      {active && radio.track.source.type === 'audio' ? <RadioControls /> : <button type="button" className="music-button" disabled={radio.loading} onClick={() => active ? radio.setMinimized(false) : radio.playVinyl(vinyl)}>{active ? 'Abrir reproductor externo ↗' : '▶ Escuchar preview'}</button>}
      <AudioVisualizer active={active} />
    </div>
  </section>
}
