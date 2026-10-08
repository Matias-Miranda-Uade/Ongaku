import { useState } from "react"
import useFavorites from "../hooks/useFavorites"
import useCart from "../hooks/useCart"

const FavoritesPage = ({ onNavigate }) => {

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
        <section className="favorites-page">
        <div className="legacy-heading">
            <p className="eyebrow">BÓVEDA DE COLECCIÓN</p>
            <h1>Vinilos favoritos</h1>
            <p className="legacy-description">{favorites.length} {favorites.length === 1 ? 'pieza guardada' : 'piezas guardadas'} en tu gabinete.</p>
        </div>
        {message && <p className="inline-notice" role="status">{message}</p>}
        {favorites.length === 0
            ? <div className="empty-state-card">
                <h2>Tu bóveda todavía está vacía.</h2>
                <p>Guardá los discos que quieras volver a escuchar y los vas a encontrar acá.</p>
                <button className="primary-button" onClick={() => onNavigate?.('catalog')}>Descubrir el catálogo</button>
              </div>
            : <ul className="favorites-grid">
                {
                    favorites.map((product) => (
                        <li className="favorite-card" key={product.id}>
                            <div className="favorite-card-image">
                                <img src={product.image} alt={`Portada de ${product.name}`} />
                                <button className="favorite-remove" aria-label={`Quitar ${product.name} de favoritos`} onClick={() => removeFavorite(product.id)}>♥</button>
                            </div>
                            <div className="favorite-card-copy">
                                <p className="eyebrow">{product.artist}</p>
                                <h2>{product.name}</h2>
                                <div className="favorite-card-footer">
                                    <strong>${product.price.toLocaleString('es-AR')}</strong>
                                    {product.stock > 0
                                        ? <button className="primary-button" onClick={() => handleAdd(product)}>Agregar a la bolsa</button>
                                        : <button className="secondary-button" disabled>Sin stock</button>
                                    }
                                </div>
                            </div>
                        </li>
                    ))
                }
              </ul>
        }
        </section>
    )
}

export default FavoritesPage
