import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import InventoryStats from '../../components/admin/inventory/InventoryStats'
import InventoryActions from '../../components/admin/inventory/InventoryActions'
import InventoryFilters, { DEFAULT_INVENTORY_FILTERS } from '../../components/admin/inventory/InventoryFilters'
import InventoryTable from '../../components/admin/inventory/InventoryTable'
import { getStockStatus, indexById, normalizeText } from '../../components/admin/adminUtils'
import { adjustVinylStock, deleteVinyl, getAdminVinyls, getCatalogLookups, setVinylEnabled } from '../../services/adminService'

const compare = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a ?? '').localeCompare(String(b ?? ''), 'es', { sensitivity: 'base' })
}

const InventoryPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [lookups, setLookups] = useState({ artists: [], genres: [], categories: [] })
  const { genres, categories } = lookups
  const artistsById = useMemo(() => indexById(lookups.artists), [lookups.artists])
  const genresById = useMemo(() => indexById(lookups.genres), [lookups.genres])
  useEffect(() => {
    let active = true
    getCatalogLookups().then((data) => { if (active) setLookups(data) }).catch((error) => { if (active) setError(error.message) })
    return () => { active = false }
  }, [])

  const [vinyls, setVinyls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(location.state?.flash ?? '')
  const [blockedDelete, setBlockedDelete] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_INVENTORY_FILTERS)
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' })
  const [busyIds, setBusyIds] = useState(() => new Set())

  useEffect(() => {
    if (location.state?.flash) navigate(location.pathname, { replace: true, state: null })
  }, [location, navigate])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setVinyls(await getAdminVinyls())
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const rows = useMemo(() => vinyls.map((vinyl) => ({
    ...vinyl,
    artistName: artistsById[String(vinyl.artistId)]?.name ?? '',
    genreName: (vinyl.genreIds?.length ? vinyl.genreIds : [vinyl.genreId]).map((id) => genresById[String(id)]?.name).filter(Boolean).join(' / '),
    finalPrice: vinyl.finalPrice ?? vinyl.price,
  })), [vinyls, artistsById, genresById])

  const visibleRows = useMemo(() => {
    const term = normalizeText(filters.search)
    const filtered = rows.filter((row) => {
      if (term && ![row.name, row.artistName, String(row.id)].some((value) => normalizeText(value).includes(term))) return false
      if (filters.genreId && !(row.genreIds?.length ? row.genreIds : [row.genreId]).map(String).includes(filters.genreId)) return false
      if (filters.categoryId && String(row.categoryId) !== filters.categoryId) return false
      if (filters.stock !== 'all' && getStockStatus(row.stock) !== filters.stock) return false
      if (filters.visibility === 'visible' && !row.enabled) return false
      if (filters.visibility === 'hidden' && row.enabled) return false
      return true
    })
    const direction = sort.direction === 'asc' ? 1 : -1
    return filtered.sort((a, b) => compare(a[sort.key], b[sort.key]) * direction)
  }, [rows, filters, sort])

  const handleSort = (key) => {
    setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }))
  }

  const withBusy = async (id, task) => {
    setBusyIds((current) => new Set(current).add(id))
    try {
      return await task()
    } finally {
      setBusyIds((current) => {
        const next = new Set(current)
        next.delete(id)
        return next
      })
    }
  }

  const replaceVinyl = (updated) => {
    setVinyls((current) => current.map((vinyl) => (vinyl.id === updated.id ? { ...vinyl, ...updated } : vinyl)))
  }

  const handleAdjustStock = (vinyl, delta) => withBusy(vinyl.id, async () => {
    setError('')
    try {
      replaceVinyl(await adjustVinylStock(vinyl.id, delta))
    } catch (stockError) {
      setError(stockError.message)
    }
  })

  const handleDelete = (vinyl) => withBusy(vinyl.id, async () => {
    setError('')
    setNotice('')
    setBlockedDelete(null)
    try {
      await deleteVinyl(vinyl.id)
      setVinyls((current) => current.filter((item) => item.id !== vinyl.id))
      setNotice(`"${vinyl.name}" se eliminó del inventario.`)
    } catch (deleteError) {
      if (deleteError.isConflict) setBlockedDelete(vinyl)
      else setError(deleteError.message)
    }
  })

  const handleHideInstead = (vinyl) => withBusy(vinyl.id, async () => {
    try {
      replaceVinyl(await setVinylEnabled(vinyl.id, false))
      setBlockedDelete(null)
      setNotice(`"${vinyl.name}" quedó oculto de la vitrina.`)
    } catch (hideError) {
      setError(hideError.message)
    }
  })

  return (
    <section className="admin-page" aria-labelledby="inventory-title">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">在庫 · INVENTARIO</p>
          <h1 id="inventory-title">Inventario</h1>
        </div>
        <InventoryActions rows={visibleRows} loading={loading} onRefresh={load} />
      </header>

      <InventoryStats vinyls={vinyls} />

      {error && (
        <div className="admin-alert" role="alert">
          <p>{error}</p>
          <button type="button" className="link-button" onClick={load}>Reintentar</button>
        </div>
      )}
      {blockedDelete && (
        <div className="admin-alert admin-alert-warning" role="alert">
          <p>
            <strong>"{blockedDelete.name}"</strong> ya figura en órdenes, así que no se puede eliminar sin perder el historial.
            Podés ocultarlo de la vitrina.
          </p>
          <div>
            {blockedDelete.enabled && (
              <button type="button" className="link-button" onClick={() => handleHideInstead(blockedDelete)}>Ocultar de la vitrina</button>
            )}
            <button type="button" className="link-button" onClick={() => setBlockedDelete(null)}>Cerrar</button>
          </div>
        </div>
      )}
      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <InventoryFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_INVENTORY_FILTERS)}
        genres={genres}
        categories={categories}
        resultCount={visibleRows.length}
      />

      <InventoryTable
        rows={visibleRows}
        sort={sort}
        onSort={handleSort}
        busyIds={busyIds}
        loading={loading}
        onEdit={(vinyl) => navigate(`/app/admin/vinyls/${vinyl.id}/edit`)}
        onDelete={handleDelete}
        onAdjustStock={handleAdjustStock}
      />
    </section>
  )
}

export default InventoryPage
