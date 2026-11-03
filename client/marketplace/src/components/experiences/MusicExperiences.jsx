import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchVinyls } from '../../Redux/actions/catalogActions'
import { selectVinyls } from '../../Redux/slices/catalogSlice'
import VinylCover from '../vinyl/VinylCover'
import VinylPrice from '../vinyl/VinylPrice'
import { hasPreview, useRadio } from '../../context/RadioContext'
import { chooseSurprise } from './musicDiscovery'
import './musicExperiences.css'

function RecordChoice({ vinyl, onOpen }) {
  const radio = useRadio()
  return <div className="music-choice">
    <VinylCover src={vinyl.image} alt={`Portada de ${vinyl.name}`} />
    <div><p className="eyebrow">{vinyl.artistName}</p><h3>{vinyl.name}</h3><p>{[vinyl.year, ...(vinyl.genreNames || [])].filter(Boolean).join(' / ')}</p><VinylPrice vinyl={vinyl} /><div className="music-choice-actions"><button type="button" className="music-button" onClick={() => onOpen(vinyl.id)}>Explorar disco ↗</button>{hasPreview(vinyl) && <button type="button" className="music-button music-button-outline" disabled={radio.loading} onClick={() => radio.playVinyl(vinyl)}>▶ Preview</button>}</div></div>
  </div>
}

export function SurpriseMe({ catalog, onOpen }) {
  const [selectedId, setSelectedId] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const timer = useRef(null)
  const selected = catalog.find(item => String(item.id) === String(selectedId))
  useEffect(() => () => clearTimeout(timer.current), [])
  const surprise = () => {
    setSpinning(true)
    const next = chooseSurprise(catalog, selectedId)
    timer.current = setTimeout(() => { setSelectedId(next); setSpinning(false) }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850)
  }
  return <section className={`surprise-section ${spinning ? 'is-spinning' : ''}`} aria-labelledby="surprise-title">
    <div className="surprise-intro"><p className="eyebrow">EL AZAR TAMBIÉN TIENE BUEN OÍDO / 偶然</p><h2 id="surprise-title">「SURPRISE ME」</h2><p>Dejá que la música te encuentre.</p><button type="button" className="surprise-trigger" disabled={!catalog.length || spinning} onClick={surprise}><span className="surprise-disc" aria-hidden="true">●</span><span>{spinning ? 'Buscando tu próximo disco…' : selected ? 'Sorprendeme otra vez ↗' : 'Elegí un disco para mí ↗'}</span></button></div>
    <div className="surprise-result" aria-live="polite" aria-busy={spinning}>{selected && !spinning ? <RecordChoice key={selected.id} vinyl={selected} onOpen={onOpen} /> : <div className="surprise-placeholder"><span aria-hidden="true">音</span><p>{catalog.length ? 'Una portada. Un encuentro inesperado.' : 'Esperando discos del catálogo.'}</p></div>}</div>
  </section>
}

export default function MusicExperiences() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const catalog = useSelector(selectVinyls)
  const request = useSelector(state => state.catalog.list)
  useEffect(() => { dispatch(fetchVinyls()) }, [dispatch])
  const open = id => navigate(`/app/catalog/${encodeURIComponent(id)}`)
  return <div className="music-experiences">
    {request.status === 'loading' && !catalog.length && <p role="status">Abriendo el archivo sonoro…</p>}
    {request.error && <div role="alert"><p>{request.error}</p><button type="button" className="music-button" onClick={() => dispatch(fetchVinyls({ force: true }))}>Reintentar</button></div>}
    <SurpriseMe catalog={catalog} onOpen={open} />
  </div>
}
