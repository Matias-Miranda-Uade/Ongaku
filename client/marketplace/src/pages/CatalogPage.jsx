import { useEffect, useState } from 'react'
import { collections } from '../data/collections'
import VinylFilters from '../components/vinyl/VinylFilters'
import VinylGrid from '../components/vinyl/VinylGrid'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVinyls } from '../Redux/actions/catalogActions.js'
import { selectFilteredVinyls } from '../Redux/slices/catalogSlice.js'
import { matchesMood } from '../components/experiences/musicDiscovery'

const emptyFilters = { search: '', stock: 'all', sort: 'featured', mood: '' }

const CatalogPage = ({ onOpenVinyl, collectionId, onClearCollection, focusSearch = false, searchRequest }) => {
  const collection = collections.find((item) => item.id === collectionId)
  const dispatch = useDispatch()
  const { status, error } = useSelector(state => state.catalog.list)
  const loading = status === 'idle' || status === 'loading'
  const [motionPaused, setMotionPaused] = useState(false)
  const [filters, setFilters] = useState(emptyFilters)

  useEffect(() => {
    if (focusSearch) {
      const input = document.getElementById('catalog-search')
      if (input) {
        input.focus({ preventScroll: true })
        input.scrollIntoView({ behavior: 'auto', block: 'center' })
      }
    }
  }, [focusSearch, searchRequest])

  useEffect(() => { dispatch(fetchVinyls()) }, [dispatch])

  const filteredVinyls = useSelector(state => selectFilteredVinyls(state, filters, collectionId))
  const visibleVinyls = filteredVinyls.filter(vinyl => matchesMood(vinyl, filters.mood))

  return (
    <div className={`page catalog-page ${motionPaused ? 'disc-animation-paused' : ''}`}>
      <section className="page-hero catalog-hero">
        <p className="eyebrow">ARCHIVO / 2026</p>
        <h1>Catálogo analógico</h1>
        <p>Una selección de discos para escuchar, coleccionar y volver a descubrir.</p>
      </section>

      <VinylFilters
        filters={filters}
        vinyls={filteredVinyls}
        onChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))}
        onClear={() => { setFilters(emptyFilters); if (onClearCollection) onClearCollection() }}
      />
      {collection && <p className="collection-notice">Colección: <strong>{collection.name}</strong> <button className="clear-button" type="button" onClick={onClearCollection}>Ver todo el catálogo</button></p>}

      <div className="catalog-count">{loading ? 'CARGANDO…' : `${visibleVinyls.length} VINILOS`}</div>
      {filteredVinyls.some((vinyl) => vinyl.image && vinyl.image.startsWith('/covers/') && vinyl.image.endsWith('.svg')) && <button className="clear-button disc-motion-control" type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused((value) => !value)}>
        {motionPaused ? 'Reanudar giro de discos' : 'Pausar giro de discos'}
      </button>}
      {error && <div role="alert"><p>{error}</p><button type="button" onClick={() => dispatch(fetchVinyls({ force: true }))}>Reintentar</button></div>}
      {!loading && !error && <VinylGrid vinyls={visibleVinyls} onOpenVinyl={onOpenVinyl} />}
    </div>
  )
}
export default CatalogPage
