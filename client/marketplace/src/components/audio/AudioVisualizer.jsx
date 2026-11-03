import { useEffect, useRef, useState } from 'react'
import { useRadio } from '../../context/RadioContext'

export default function AudioVisualizer({ active = true }) {
  const radio = useRadio()
  const bars = useRef(null)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const spans = bars.current?.children
    if (!spans) return
    let frame
    const reset = () => Array.from(spans).forEach(span => { span.style.transform = 'scaleY(.08)' })
    const draw = () => {
      const values = new Uint8Array(radio.analyser.frequencyBinCount)
      radio.analyser.getByteFrequencyData(values)
      Array.from(spans).forEach((span, index) => { span.style.transform = `scaleY(${Math.max(.04, values[index * 3] / 255)})` })
      frame = requestAnimationFrame(draw)
    }
    const update = () => {
      cancelAnimationFrame(frame)
      if (active && radio?.analyser && radio.playing && !reduced && !document.hidden) draw()
      else reset()
    }
    update(); document.addEventListener('visibilitychange', update)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', update); reset() }
  }, [radio?.analyser, radio?.playing, reduced, active])
  return <div className="radio-visualizer">
    <div className="radio-bars" ref={bars} aria-hidden="true">{Array.from({ length: 32 }, (_, i) => <span key={i} />)}</div>
    <p>{!active ? 'Elegí este preview para visualizar su sonido.' : reduced ? 'Visual estático · movimiento reducido.' : radio?.analysisNote || (radio?.playing ? 'SEÑAL EN VIVO / 音' : 'SEÑAL EN PAUSA')}</p>
  </div>
}
