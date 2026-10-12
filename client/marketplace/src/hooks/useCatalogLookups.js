import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCatalogLookups } from '../services/adminService'
import { indexById } from '../components/admin/adminUtils'

const useCatalogLookups = () => {
  const [lookups, setLookups] = useState({ artists: [], genres: [], categories: [] })
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      setLookups(await getCatalogLookups())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  const addGenre = useCallback((genre) => {
    setLookups((current) => ({ ...current, genres: [...current.genres, genre] }))
  }, [])

  const maps = useMemo(() => ({
    artistsById: indexById(lookups.artists),
    genresById: indexById(lookups.genres),
    categoriesById: indexById(lookups.categories),
  }), [lookups])

  return { ...lookups, ...maps, loading, reload, addGenre }
}

export default useCatalogLookups
