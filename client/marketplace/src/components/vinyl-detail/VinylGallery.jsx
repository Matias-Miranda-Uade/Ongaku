import VinylCover from '../vinyl/VinylCover'
import { useState } from 'react'

const VinylGallery = ({ vinyl }) => {
  const [motionPaused, setMotionPaused] = useState(false)
  return (
  <section className={`detail-gallery ${motionPaused ? 'disc-animation-paused' : ''}`}>
    <div className="gallery-number">0{String(vinyl.id).slice(-1)}</div>
    <VinylCover className="detail-cover" src={vinyl.image} alt={vinyl.name} />
    <button className="clear-button gallery-motion-control disc-motion-control" type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused((value) => !value)}>
      {motionPaused ? 'Reanudar giro' : 'Pausar giro'}
    </button>
    <p>EDICIÓN ANALÓGICA · {vinyl.year}</p>
  </section>
  )
}
export default VinylGallery
