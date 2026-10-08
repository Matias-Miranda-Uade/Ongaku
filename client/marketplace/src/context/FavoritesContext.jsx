import { createContext, useState } from 'react'

export const FavoritesContext = createContext(null)

export const FavoritesProvider = ({ children }) => {

    const [favorites, setFavorites] = useState([]) //{id, name, artist, price, stock}

    const isFavorite = (id) => favorites.some((product) => product.id === id)

    const removeFavorite = (id) => {
        setFavorites((current) => current.filter((product) => product.id !== id))
    }

    // Si ya era favorito lo quita, si no lo agrega
    const toggleFavorite = (product) => {
        if (isFavorite(product.id)) {
            removeFavorite(product.id)
        } else {
            setFavorites((current) => [...current, product])
        }
    }

    return (
        <FavoritesContext.Provider
            value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}
        >
            {children}
        </FavoritesContext.Provider>
    )
}
