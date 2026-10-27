import { useEffect, useState } from 'react'
import { collections, matchesCollection } from '../data/collections'
import VinylFilters from '../components/vinyl/VinylFilters'
import VinylGrid from '../components/vinyl/VinylGrid'
import { getVinyls } from '../services/vinylService'
import { getVinylPrice } from '../components/vinyl/vinylUtils'

const emptyFilters = { search: '', stock: 'all', sort: 'featured' }

const CatalogPage = ({ onOpenVinyl, collectionId, onClearCollection, focusSearch = false, searchRequest }) => {
  const collection = collections.find((item) => item.id === collectionId)
  const [vinyls, setVinyls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
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

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getVinyls()
      .then((data) => { if (active) setVinyls(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload])

  let filteredVinyls = vinyls.filter((vinyl) => matchesCollection(vinyl, collection))
  const search = filters.search.trim().toLowerCase()

  if (search) {
    filteredVinyls = filteredVinyls.filter((vinyl) =>
      `${vinyl.name} ${vinyl.artistName || ''}`.toLowerCase().includes(search)
    )
  }
  if (filters.stock === 'available') {
    filteredVinyls = filteredVinyls.filter((vinyl) => vinyl.stock > 0)
  }
  if (filters.stock === 'unavailable') {
    filteredVinyls = filteredVinyls.filter((vinyl) => vinyl.stock <= 0)
  }
  if (filters.sort === 'price-asc') {
    filteredVinyls.sort((a, b) => getVinylPrice(a) - getVinylPrice(b))
  }
  if (filters.sort === 'price-desc') {
    filteredVinyls.sort((a, b) => getVinylPrice(b) - getVinylPrice(a))
  }
  if (filters.sort === 'year-desc') {
    filteredVinyls.sort((a, b) => b.year - a.year)
  }

  return (
    <div className={`page catalog-page ${motionPaused ? 'disc-animation-paused' : ''}`}>
      <section className="page-hero catalog-hero">
        <p className="eyebrow">ARCHIVO / 2026</p>
        <h1>Catálogo analógico</h1>
        <p>Una selección de discos para escuchar, coleccionar y volver a descubrir.</p>
      </section>

      <VinylFilters
        filters={filters}
        onChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))}
        onClear={() => { setFilters(emptyFilters); if (onClearCollection) onClearCollection() }}
      />
      {collection && <p className="collection-notice">Colección: <strong>{collection.name}</strong> <button className="clear-button" type="button" onClick={onClearCollection}>Ver todo el catálogo</button></p>}

      <div className="catalog-count">{loading ? 'CARGANDO…' : `${filteredVinyls.length} VINILOS`}</div>
      {filteredVinyls.some((vinyl) => vinyl.image && vinyl.image.startsWith('/covers/') && vinyl.image.endsWith('.svg')) && <button className="clear-button disc-motion-control" type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused((value) => !value)}>
        {motionPaused ? 'Reanudar giro de discos' : 'Pausar giro de discos'}
      </button>}
      {error && <div role="alert"><p>{error}</p><button type="button" onClick={() => setReload((value) => value + 1)}>Reintentar</button></div>}
      {!loading && !error && <VinylGrid vinyls={filteredVinyls} onOpenVinyl={onOpenVinyl} />}
    </div>
  )
}
export default CatalogPage
