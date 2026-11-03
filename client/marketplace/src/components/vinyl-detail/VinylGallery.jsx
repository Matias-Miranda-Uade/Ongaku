import { useEffect, useRef, useState } from 'react'
import VinylCover from '../vinyl/VinylCover'

export default function VinylGallery({ vinyl, playing }) {
  const [open, setOpen] = useState(false)
  const disc = useRef(null)
  const speed = useRef(0)
  const angle = useRef(0)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame
    let previous
    const tick = now => {
      const dt = previous == null ? 0 : Math.min((now - previous) / 1000, .05)
      previous = now
      const target = playing && !reduced.matches ? 200 : 0
      speed.current += (target - speed.current) * (1 - Math.exp(-dt * 5))
      angle.current = (angle.current + speed.current * dt) % 360
      if (disc.current) disc.current.style.transform = `rotate(${angle.current}deg)`
      if (target || speed.current > .1) frame = requestAnimationFrame(tick)
    }
    const start = () => { cancelAnimationFrame(frame); previous = undefined; frame = requestAnimationFrame(tick) }
    start()
    reduced.addEventListener('change', start)
    return () => { cancelAnimationFrame(frame); reduced.removeEventListener('change', start) }
  }, [playing])
  return <section className={`detail-gallery record-gallery ${playing ? 'is-playing' : ''} ${open ? 'is-open' : ''}`}>
    <div className="gallery-number" aria-hidden="true">音 / 01</div>
    <button className="record-scene" type="button" aria-label={`${open ? 'Guardar' : 'Explorar'} el disco de ${vinyl.name}`} aria-pressed={open} onClick={() => setOpen(value => !value)}>
      <span className="record-slide" aria-hidden="true"><span ref={disc} className="record-spin"><span className="record-label"><VinylCover src={vinyl.image} alt="" /><span className="record-hole" /></span></span><span className="record-sheen" /></span>
      <VinylCover className="record-sleeve" src={vinyl.image} alt={vinyl.name} />
      <span className="sleeve-edge" aria-hidden="true" />
    </button>
    <div className="record-caption"><span>{playing ? '● EN REPRODUCCIÓN' : 'EXPLORÁ EL OBJETO SONORO'}</span><span>{vinyl.year || 'ONGAKU'} / 音楽</span></div>
  </section>
}
