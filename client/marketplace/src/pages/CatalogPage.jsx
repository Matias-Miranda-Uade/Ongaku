import { useEffect, useMemo, useState } from 'react'
import VinylFilters from '../components/vinyl/VinylFilters'
import VinylGrid from '../components/vinyl/VinylGrid'
import { getVinyls } from '../services/api'

const emptyFilters = { search: '', stock: 'all', sort: 'featured' }

const CatalogPage = ({ onOpenVinyl }) => {
  const [vinyls, setVinyls] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(emptyFilters)

  useEffect(() => {
    getVinyls().then((data) => {
      setVinyls(data)
      setLoading(false)
    })
  }, [])

  const filteredVinyls = useMemo(() => {
    let result = [...vinyls]
    const search = filters.search.trim().toLowerCase()
    if (search) {
      result = result.filter((vinyl) =>
        `${vinyl.name} ${vinyl.artistName || ''}`.toLowerCase().includes(search)
      )
    }
    if (filters.stock === 'available') result = result.filter((vinyl) => vinyl.stock > 0)
    if (filters.stock === 'unavailable') result = result.filter((vinyl) => vinyl.stock <= 0)
    if (filters.sort === 'price-asc') result.sort((a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price))
    if (filters.sort === 'price-desc') result.sort((a, b) => (b.finalPrice || b.price) - (a.finalPrice || a.price))
    if (filters.sort === 'year-desc') result.sort((a, b) => b.year - a.year)
    return result
  }, [vinyls, filters])

  return (
    <div className="page catalog-page">
      <section className="page-hero catalog-hero">
        <p className="eyebrow">ARCHIVO / 2026</p>
        <h1>Catálogo<br />Analógico</h1>
        <p>Una selección de discos para escuchar, coleccionar y volver a descubrir.</p>
      </section>

      <VinylFilters
        filters={filters}
        onChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))}
        onClear={() => setFilters(emptyFilters)}
      />

      <div className="catalog-count">{loading ? 'CARGANDO…' : `${filteredVinyls.length} VINILOS`}</div>
      {!loading && <VinylGrid vinyls={filteredVinyls} onOpenVinyl={onOpenVinyl} />}
    </div>
  )
}
export default CatalogPage
