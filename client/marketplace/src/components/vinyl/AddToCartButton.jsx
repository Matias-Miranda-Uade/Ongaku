import { useState } from 'react'
import useCart from '../../hooks/useCart'

const AddToCartButton = ({ vinyl, compact = false }) => {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const disabled = !vinyl || vinyl.stock <= 0

  const handleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (disabled) return

    const product = {
      ...vinyl,
      artist: vinyl.artist || vinyl.artistName || `Artista #${vinyl.artistId ?? '—'}`,
      price: vinyl.finalPrice || vinyl.price,
    }

    addItem(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <button
      className={`cart-button ${compact ? 'compact' : ''}`}
      type="button"
      disabled={disabled}
      onClick={handleClick}
    >
      {disabled ? 'SIN STOCK' : added ? 'AGREGADO ✓' : 'AGREGAR AL CARRITO'}
    </button>
  )
}
export default AddToCartButton
