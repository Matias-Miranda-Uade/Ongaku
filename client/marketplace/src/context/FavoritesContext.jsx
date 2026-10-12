import { createContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { createFavorite, deleteFavorite, getFavorites } from '../services/api'

export const FavoritesContext = createContext(null)

export const FavoritesProvider = ({ children }) => {
    const { user, isAdmin } = useAuth()
    const [error, setError] = useState('')
    const busy = useRef(new Set())
    const currentUserId = useRef(user?.id)
    currentUserId.current = user?.id

    const [favorites, setFavorites] = useState([]) //{id, name, artist, price, stock}
    useEffect(() => {
        let active = true
        setFavorites([])
        setError('')
        if (user && !isAdmin) getFavorites().then((data) => { if (active) setFavorites(data) }).catch((requestError) => { if (active) setError(requestError.message) })
        return () => { active = false }
    }, [user?.id, isAdmin])

    const isFavorite = (id) => favorites.some((product) => product.id === id)

    const removeFavorite = async (id) => {
        const requestUserId = user?.id
        if (busy.current.has(id)) return
        busy.current.add(id)
        setError('')
        try {
            const favorite = favorites.find((product) => product.id === id)
            if (user && favorite) await deleteFavorite(favorite.favoriteId)
            if (currentUserId.current !== requestUserId) return
        setFavorites((current) => current.filter((product) => product.id !== id))
        } catch (requestError) { setError(requestError.message) }
        finally { busy.current.delete(id) }
    }

    // Si ya era favorito lo quita, si no lo agrega
    const toggleFavorite = async (product) => {
        if (isAdmin) { setError('Los favoritos están disponibles para compradores.'); return }
        if (isFavorite(product.id)) {
            await removeFavorite(product.id)
        } else {
            if (busy.current.has(product.id)) return
            busy.current.add(product.id)
            setError('')
            try {
                const requestUserId = user?.id
                const saved = user ? await createFavorite(product.id) : null
                if (currentUserId.current !== requestUserId) return
                setFavorites((current) => [...current, { ...product, favoriteId: saved?.id }])
            } catch (requestError) { setError(requestError.message) }
            finally { busy.current.delete(product.id) }
        }
    }

    return (
        <FavoritesContext.Provider
            value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}
        >
            {error && <p className="storage-notice" role="alert">{error}</p>}
            {children}
        </FavoritesContext.Provider>
    )
}
