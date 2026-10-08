import { createContext, useState } from 'react'
import { products } from '../data/mockData'

export const FavoritesContext = createContext(null)

export const FavoritesProvider = ({ children }) => {

    // Datos de prueba: reemplazar por [] cuando se conecte el back
    const [favorites, setFavorites] = useState([products[2], products[3]]) //{id, name, artist, price, stock}

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
