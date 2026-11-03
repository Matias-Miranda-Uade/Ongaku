import { useEffect } from 'react'
import { useRadio } from '../../context/RadioContext'
import RadioControls from './RadioControls'

// Adaptador para previews existentes (incluida la previsualización del administrador).
export default function AudioPlayer({ preview, onPlaybackChange }) {
  const radio = useRadio()
  const active = radio.track?.source.url === preview?.url
  useEffect(() => { onPlaybackChange?.(active && radio.playing) }, [active, radio.playing, onPlaybackChange])
  return active && radio.track.source.type === 'audio' ? <RadioControls /> : <button type="button" className="music-button" disabled={!preview?.url || radio.loading} onClick={() => active ? radio.setMinimized(false) : radio.playVinyl({ id: `preview-${preview.id ?? preview.url}`, name: 'Audio Preview', albumUrl: preview.url }, preview)}>{active ? 'Abrir en Ongaku Radio ↗' : '▶ Escuchar en Ongaku Radio'}</button>
}
