import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FavoritesContext } from '../context/FavoritesContext'
import { AuthContext } from '../context/AuthContext'
import { addItem } from '../Redux/actions/cartActions'
import { selectCartItems } from '../Redux/slices/cartSlice'

const FavoritesPage = ({ onNavigate, onOpenVinyl }) => {

    const { favorites, removeFavorite } = useContext(FavoritesContext)
    const items = useSelector(selectCartItems)
    const syncing = useSelector(state => state.cart.status === 'loading')
    const dispatch = useDispatch()
    const { isAdmin } = useContext(AuthContext)
    const [message, setMessage] = useState('')

    if (isAdmin) {
        return (
            <section className="empty-state-card">
                <p className="eyebrow">CUENTA ADMINISTRADORA</p>
                <h2>Los favoritos son para clientes</h2>
                <p>Las cuentas de administración no pueden guardar favoritos ni agregar productos a una compra.</p>
                <button className="secondary-button" type="button" onClick={() => onNavigate?.('admin')}>Volver al panel</button>
            </section>
        )
    }

    const handleAdd = (product) => {
        if (syncing) return
        const inCart = items.find((item) => item.id === product.id)
        if (inCart && inCart.quantity >= product.stock) {
            setMessage(`Ya tenés el máximo disponible de "${product.name}" en el carrito`)
            return
        }
        dispatch(addItem({ product }))
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
                            <button className={`favorite-card-image favorite-card-detail-link ${product.stock <= 0 ? 'is-out-of-stock' : ''}`} type="button" onClick={() => onOpenVinyl?.(product.id)} aria-label={`Ver detalle de ${product.name}`}>
                                <img src={product.image} alt={`Portada de ${product.name}`} />
                                {product.stock <= 0 && <span className="stock-out-overlay">SIN STOCK</span>}
                            </button>
                            <button className="favorite-remove" aria-label={`Quitar ${product.name} de favoritos`} onClick={() => removeFavorite(product.id)}>♥</button>
                            <div className="favorite-card-copy">
                                <p className="eyebrow">{product.artist}</p>
                                <h2><button className="text-link link-button" type="button" onClick={() => onOpenVinyl?.(product.id)}>{product.name}</button></h2>
                                <div className="favorite-card-footer">
                                    <strong>${product.price.toLocaleString('es-AR')}</strong>
                                    {product.stock > 0
                                        ? <button className="primary-button" disabled={syncing} onClick={() => handleAdd(product)}>Agregar a la bolsa</button>
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
