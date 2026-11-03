import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRadio } from '../../context/RadioContext'
import VinylCover from '../vinyl/VinylCover'
import AudioVisualizer from './AudioVisualizer'
import RadioControls from './RadioControls'
import './radio.css'

export default function OngakuRadio() {
  const radio = useRadio()
  const [leaving, setLeaving] = useState(false)
  const timer = useRef(null)
  const previous = useRef(null)
  useEffect(() => { setLeaving(false); clearTimeout(timer.current) }, [radio.track, radio.loading])
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (!radio.track && !radio.loading) document.body.classList.remove('has-ongaku-radio')
    else document.body.classList.add('has-ongaku-radio')
    return () => document.body.classList.remove('has-ongaku-radio')
  }, [radio.track, radio.loading])
  if (!radio.track && !radio.loading && !radio.error) return null
  const vinyl = radio.track?.vinyl
  const dismiss = () => { setLeaving(true); timer.current = setTimeout(radio.close, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200) }
  return <aside className={`ongaku-radio ${radio.minimized ? 'is-mini' : ''} ${leaving ? 'is-leaving' : ''}`} aria-label="Ongaku Radio">
    <header><span>「ONGAKU RADIO」 <i className={radio.playing ? 'is-on' : ''} /></span><div><button ref={previous} type="button" aria-expanded={!radio.minimized} aria-label={radio.minimized ? 'Expandir radio' : 'Minimizar radio'} onClick={() => radio.setMinimized(!radio.minimized)}>{radio.minimized ? '↗' : '−'}</button><button type="button" aria-label="Cerrar radio y detener audio" onClick={dismiss}>×</button></div></header>
    {radio.loading && <p role="status">Sintonizando preview…</p>}
    {vinyl && <div className="radio-now"><VinylCover src={vinyl.image} alt="" /><div><p>{vinyl.artistName}</p><Link to={`/app/catalog/${encodeURIComponent(vinyl.id)}`}>{vinyl.name}</Link></div>{radio.minimized && radio.track.source.type === 'audio' && <button type="button" onClick={radio.toggle} aria-label={radio.playing ? 'Pausar audio' : 'Reproducir audio'}>{radio.playing ? 'Ⅱ' : '▶'}</button>}</div>}
    <div className="radio-expanded" hidden={radio.minimized}>
      <RadioControls />
      {radio.track?.source.type === 'embed' && <><iframe src={radio.track.source.embedUrl} title={`Preview en ${radio.track.source.platform}`} width="100%" height={radio.track.source.height} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen /><p className="radio-external">Usá los controles del reproductor externo. Su estado, progreso y volumen no se comparten con Radio.</p><div className="radio-transport"><button type="button" disabled={radio.queue.length < 2} onClick={() => radio.step(-1)}>← Anterior</button><button type="button" disabled={radio.queue.length < 2} onClick={() => radio.step(1)}>Siguiente →</button></div></>}
      <AudioVisualizer />
    </div>
    {radio.error && <p role="alert">{radio.error}</p>}
  </aside>
}
