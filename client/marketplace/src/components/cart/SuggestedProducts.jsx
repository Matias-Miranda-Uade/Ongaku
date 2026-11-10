import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVinyls } from '../../Redux/slices/catalogSlice';
import { addItem } from '../../Redux/slices/cartSlice';
import { getVinylPrice } from '../vinyl/vinylUtils'

const SuggestedProducts = ({ disabled = false }) => {
    const dispatch = useDispatch()
    const { ids, entities, list } = useSelector(state => state.catalog)
    const items = useSelector(state => state.cart.items)
    const [pendingId, setPendingId] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        dispatch(fetchVinyls())
    }, [dispatch])

    const products = ids
        .map(id => entities[id])
        .filter(product => product && !items.some(item => String(item.id) === String(product.id)))
        .slice(0, 3)

    const handleAdd = product => {
        if (disabled || pendingId != null) return
        setPendingId(product.id)
        setError('')
        const cartProduct = {
            ...product,
            artist: product.artistName,
            price: getVinylPrice(product)
        }
        dispatch(addItem({ product: cartProduct })).then(result => {
            if (result.error) setError(result.error.message)
            setPendingId(null)
        })
    }

    if (products.length === 0) {
        return list.error
            ? <p role="alert">No se pudieron cargar las sugerencias: {list.error}</p>
            : null
    }
    return (
        <>
        <h2>También te puede interesar</h2>
        {list.error && <p role="alert">No se pudieron cargar las sugerencias: {list.error}</p>}
        {error && <p role="alert">{error}</p>}
        <ul className="suggested-products-grid">
            {
                products.map((product) => (
                    <li className="suggested-product-card" key={product.id}>
                        <h3>{product.name}</h3>
                        <p>{product.artistName}</p>
                        <p>${getVinylPrice(product).toLocaleString('es-AR')}</p>
                        <button onClick={() => handleAdd(product)} disabled={disabled || pendingId != null || product.stock <= 0}>
                            {product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
                        </button>
                    </li>
                ))
            }
        </ul>
        </>
    )
}

export default SuggestedProducts
