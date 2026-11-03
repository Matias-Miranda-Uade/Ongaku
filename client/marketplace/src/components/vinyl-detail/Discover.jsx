import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectVinyls } from '../../Redux/slices/catalogSlice'
import { fetchVinyls } from '../../Redux/actions/catalogActions'
import { useDispatch } from 'react-redux'
import VinylCover from '../vinyl/VinylCover'
import VinylPrice from '../vinyl/VinylPrice'
import { recommendVinyls } from './recommendations'

export default function Discover({ vinyl, onOpen }) {
  const catalog = useSelector(selectVinyls)
  const request = useSelector(state => state.catalog.list)
  const dispatch = useDispatch()
  const rail = useRef(null)
  const items = recommendVinyls(vinyl, catalog)
  const move = direction => rail.current?.scrollBy({ left: direction * rail.current.clientWidth * .8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  if (!items.length && request.status === 'succeeded') return null
  return <section className="discover-section" aria-labelledby="discover-title">
    <header className="experience-heading"><div><p className="eyebrow">次の音 / SELECCIÓN ONGAKU</p><h2 id="discover-title">「DISCOVER」</h2><p>Descubrí tu próximo sonido</p></div><div className="discover-arrows"><button type="button" aria-label="Discos anteriores" onClick={() => move(-1)}>←</button><button type="button" aria-label="Discos siguientes" onClick={() => move(1)}>→</button></div></header>
    {request.status === 'loading' && !items.length && <p role="status">Buscando sonidos en el catálogo…</p>}
    {request.error && <div role="alert"><p>{request.error}</p><button type="button" onClick={() => dispatch(fetchVinyls({ force: true }))}>Reintentar</button></div>}
    <div className="discover-rail" ref={rail} role="list" aria-label="Discos recomendados" tabIndex={0}>
      {items.map(({ vinyl: item, reason }, index) => <article className="discover-card" role="listitem" key={item.id}><button type="button" className="discover-link" onClick={() => onOpen(item.id)}><div className="discover-art"><VinylCover src={item.image} alt={item.name} /><span className="discover-index">{String(index + 1).padStart(2, '0')}</span><span className="discover-reveal">EXPLORAR DISCO ↗</span></div><p className="discover-reason">{reason}</p><h3>{item.name}</h3><p>{item.artistName}</p><VinylPrice vinyl={item} /></button></article>)}
    </div>
  </section>
}
