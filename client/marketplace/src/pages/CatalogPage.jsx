import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { collections, matchesCollection } from '../data/collections'
import VinylFilters from '../components/vinyl/VinylFilters'
import VinylGrid from '../components/vinyl/VinylGrid'
import { getVinyls } from '../services/vinylService'

const emptyFilters = { search: '', stock: 'all', sort: 'featured' }

const CatalogPage = ({ onOpenVinyl }) => {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const collection = collections.find((item) => item.id === searchParams.get('collection'))
  const [vinyls, setVinyls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [motionPaused, setMotionPaused] = useState(false)
  const [filters, setFilters] = useState(emptyFilters)
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (location.state?.focusCatalogSearch) searchInputRef.current?.focus()
  }, [location.key, location.state])

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

  const filteredVinyls = useMemo(() => {
    let result = vinyls.filter((vinyl) => matchesCollection(vinyl, collection))
    const search = filters.search.trim().toLowerCase()
    if (search) {
      result = result.filter((vinyl) =>
        `${vinyl.name} ${vinyl.artistName || ''}`.toLowerCase().includes(search)
      )
    }
    if (filters.stock === 'available') result = result.filter((vinyl) => vinyl.stock > 0)
    if (filters.stock === 'unavailable') result = result.filter((vinyl) => vinyl.stock <= 0)
    if (filters.sort === 'price-asc') result.sort((a, b) => (a.finalPrice ?? a.price) - (b.finalPrice ?? b.price))
    if (filters.sort === 'price-desc') result.sort((a, b) => (b.finalPrice ?? b.price) - (a.finalPrice ?? a.price))
    if (filters.sort === 'year-desc') result.sort((a, b) => b.year - a.year)
    return result
  }, [vinyls, filters, collection])

  return (
    <div className={`page catalog-page ${motionPaused ? 'disc-animation-paused' : ''}`}>
      <section className="page-hero catalog-hero">
        <p className="eyebrow">ARCHIVO / 2026</p>
        <h1>Catálogo<br />Analógico</h1>
        <p>Una selección de discos para escuchar, coleccionar y volver a descubrir.</p>
      </section>

      <VinylFilters
        searchInputRef={searchInputRef}
        filters={filters}
        onChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))}
        onClear={() => { setFilters(emptyFilters); setSearchParams({}) }}
      />
      {collection && <p className="collection-notice">Colección: <strong>{collection.name}</strong> <button className="clear-button" type="button" onClick={() => setSearchParams({})}>Ver todo el catálogo</button></p>}

      <div className="catalog-count">{loading ? 'CARGANDO…' : `${filteredVinyls.length} VINILOS`}</div>
      <button className="clear-button disc-motion-control" type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused((value) => !value)}>
        {motionPaused ? 'Reanudar giro de discos' : 'Pausar giro de discos'}
      </button>
      {error && <div role="alert"><p>{error}</p><button type="button" onClick={() => setReload((value) => value + 1)}>Reintentar</button></div>}
      {!loading && !error && <VinylGrid vinyls={filteredVinyls} onOpenVinyl={onOpenVinyl} />}
    </div>
  )
}
export default CatalogPage
