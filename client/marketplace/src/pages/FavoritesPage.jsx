import { useState } from "react"
import useFavorites from "../hooks/useFavorites"
import useCart from "../hooks/useCart"

const FavoritesPage = () => {

    const { favorites, removeFavorite } = useFavorites()
    const { items, addItem } = useCart()
    const [message, setMessage] = useState('')

    const handleAdd = (product) => {
        const inCart = items.find((item) => item.id === product.id)
        if (inCart && inCart.quantity >= product.stock) {
            setMessage(`Ya tenés el máximo disponible de "${product.name}" en el carrito`)
            return
        }
        addItem(product)
        setMessage(`"${product.name}" agregado al carrito`)
    }

    return (
        <>
        <h1>Favoritos</h1>
        {message && <p role="status">{message}</p>}
        {favorites.length === 0
            ? <p>Todavía no tenés favoritos</p>
            : <ul>
                {
                    favorites.map((product) => (
                        <li key={product.id}>
                            <h3>{product.name}</h3>
                            <p>{product.artist}</p>
                            <p>${product.price.toLocaleString('es-AR')}</p>
                            {product.stock > 0
                                ? <button onClick={() => handleAdd(product)}>Agregar al carrito</button>
                                : <button disabled>Sin stock</button>
                            }
                            <button onClick={() => removeFavorite(product.id)}>Quitar de favoritos</button>
                        </li>
                    ))
                }
              </ul>
        }
        </>
    )
}

export default FavoritesPage
