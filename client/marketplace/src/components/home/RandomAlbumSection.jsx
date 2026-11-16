import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectVinyls } from '../../Redux/slices/catalogSlice'
import { getCachedAudioPreview } from '../../services/audioPreviewCache'
import { chooseRandomAlbum, getAlbumPreview } from './albumPreview'
import MediaPlayer from '../audio/MediaPlayer'
import VinylCover from '../vinyl/VinylCover'

const RandomAlbumSection = () => {
  const catalog = useSelector(state => state.catalog)
  const vinyls = selectVinyls({ catalog })
  const status = catalog.list.status
  const [selectedId, setSelectedId] = useState(null)
  const [loadedPreview, setLoadedPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unavailableIds, setUnavailableIds] = useState([])
  const selected = vinyls.find(album => String(album.id) === String(selectedId))
  const preview = loadedPreview?.albumId === selectedId ? loadedPreview.audio : null
  const albums = vinyls.filter(album =>
    !unavailableIds.includes(String(album.id)) && (album.audioPreviewId || getAlbumPreview(album, null)))

  useEffect(() => {
    let active = true
    if (!selected) {
      setLoadedPreview(null)
      setLoading(false)
      return
    }
    const loadPreview = async () => {
      setLoading(true)
      setError('')
      let audio = null
      let requestError = ''
      try {
        // Solo se consulta la preview del disco elegido, nunca todo el catálogo.
        audio = selected.audioPreviewId ? await getCachedAudioPreview(selected.audioPreviewId) : null
      } catch (failure) {
        requestError = failure.message
      }
      if (!active) return
      const available = getAlbumPreview(selected, audio)
      setLoadedPreview({ albumId: selected.id, audio: available })
      if (!available) {
        setError(requestError || 'Este álbum no tiene una preview reproducible. Probá con otro disco.')
        setUnavailableIds(ids => ids.includes(String(selected.id)) ? ids : [...ids, String(selected.id)])
      }
      setLoading(false)
    }
    loadPreview()
    return () => { active = false }
  }, [selectedId, selected?.audioPreviewId, selected?.albumUrl])

  const chooseAlbum = () => {
    const album = chooseRandomAlbum(albums, selectedId)
    if (album) {
      setError('')
      setSelectedId(album.id)
    }
  }
  const busy = loading || status === 'loading' || status === 'idle'
  const canChoose = albums.some(album => String(album.id) !== String(selectedId))

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
      {!busy && error && <p role="alert">{error} <button className="text-link" type="button" onClick={() => {
        setUnavailableIds([])
        setSelectedId(null)
        setError('')
      }}>Reintentar</button></p>}
      {selected && preview && !busy && !canChoose && <p role="status">Ya estás escuchando el único álbum con preview disponible.</p>}
    </div>
    {selected ? <div className="random-album-result">
      <VinylCover className="random-album-cover" src={selected.image} alt={`Portada de ${selected.name}`} />
      <div className="random-album-details">
        <div aria-live="polite"><p className="eyebrow">TU HALLAZGO</p><h3>{selected.name}</h3><p>{selected.artistName}</p></div>
        {preview && <MediaPlayer key={selected.id} id={preview.id} url={preview.url} durationSeconds={preview.durationSeconds} autoPlay />}
        <Link className="text-link" to={`/app/catalog/${encodeURIComponent(selected.id)}`}>Ver álbum <span aria-hidden="true">→</span></Link>
      </div>
    </div> : <div className="random-album-placeholder" aria-hidden="true"><div className="random-album-record"><span>ONGAKU<br />33⅓ RPM</span></div><p>DALE PLAY AL AZAR</p></div>}
  </section>
}

export default RandomAlbumSection
