import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectVinyls } from '../../Redux/slices/catalogSlice'
import { getAudioPreview } from '../../services/api'
import { getAlbumPreview } from './albumPreview'
import MediaPlayer from '../audio/MediaPlayer'
import VinylCover from '../vinyl/VinylCover'

const RandomAlbumSection = () => {
  const vinyls = useSelector(selectVinyls)
  const status = useSelector(state => state.catalog.list.status)
  const [albums, setAlbums] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setFailed(false)
    Promise.all(vinyls.map(async album => {
      let preview = null
      try {
        preview = album.audioPreviewId ? await getAudioPreview(album.audioPreviewId) : null
      } catch {
        if (active) setFailed(true)
      }
      const audio = getAlbumPreview(album, preview)
      return audio ? { ...album, preview: audio } : null
    })).then(results => {
      if (active) {
        const available = results.filter(Boolean)
        setAlbums(available)
        setSelected(current => current ? available.find(album => String(album.id) === String(current.id)) || null : null)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [vinyls, retry])

  const chooseAlbum = () => {
    const candidates = albums.filter(album => String(album.id) !== String(selected?.id))
    if (candidates.length) setSelected(candidates[Math.floor(Math.random() * candidates.length)])
  }
  const busy = loading || status === 'loading' || status === 'idle'
  const canChoose = albums.some(album => String(album.id) !== String(selected?.id))

  return <section className="random-album" aria-labelledby="random-album-heading" aria-busy={busy}>
    <div className="random-album-intro">
      <p className="eyebrow">DESCUBRÍ TU PRÓXIMO DISCO</p>
      <h2 id="random-album-heading">¿No sabés qué escuchar?</h2>
      <p>Dejá que el azar elija. Un álbum de nuestra bóveda, una nueva historia para escuchar.</p>
      <button className="random-album-button" type="button" onClick={chooseAlbum} disabled={busy || !canChoose}>
        {selected ? 'Otro álbum' : 'Sorprendeme'} <span aria-hidden="true">↗</span>
      </button>
      {busy && <p role="status">Buscando discos con preview…</p>}
      {!busy && !albums.length && <p role="status">{status === 'failed' ? 'No se pudo cargar el catálogo.' : 'No hay álbumes con preview de audio disponible por ahora.'}</p>}
      {!busy && failed && <p role="status">Algunas previews no se pudieron cargar. <button className="text-link" type="button" onClick={() => setRetry(value => value + 1)}>Reintentar</button></p>}
      {selected && !busy && !canChoose && <p role="status">Ya estás escuchando el único álbum con preview disponible.</p>}
    </div>
    {selected ? <div className="random-album-result">
      <VinylCover className="random-album-cover" src={selected.image} alt={`Portada de ${selected.name}`} />
      <div className="random-album-details">
        <div aria-live="polite"><p className="eyebrow">TU HALLAZGO</p><h3>{selected.name}</h3><p>{selected.artistName}</p></div>
        <MediaPlayer key={selected.id} id={selected.preview.id} url={selected.preview.url} durationSeconds={selected.preview.durationSeconds} autoPlay />
        <Link className="text-link" to={`/app/catalog/${encodeURIComponent(selected.id)}`}>Ver álbum <span aria-hidden="true">→</span></Link>
      </div>
    </div> : <div className="random-album-placeholder" aria-hidden="true"><div className="random-album-record"><span>ONGAKU<br />33⅓ RPM</span></div><p>DALE PLAY AL AZAR</p></div>}
  </section>
}

export default RandomAlbumSection
