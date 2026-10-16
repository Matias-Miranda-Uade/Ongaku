import { useEffect, useRef, useState } from 'react'
import useCart from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'

const AddToCartButton = ({ vinyl, compact = false }) => {
  const { addItem } = useCart()
  const { isAdmin } = useAuth()
  const [added, setAdded] = useState(false)
  const [pending, setPending] = useState(false)
  const timer = useRef(null)
  const outOfStock = !vinyl || vinyl.stock <= 0
  const disabled = outOfStock || pending

  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (isAdmin) return null

  const handleClick = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (disabled) return

    const product = {
      ...vinyl,
      artist: vinyl.artist || vinyl.artistName || `Artista #${vinyl.artistId ?? '—'}`,
      price: vinyl.finalPrice ?? vinyl.price,
    }

    setPending(true)
    try {
      if (await addItem(product)) {
        setAdded(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setAdded(false), 1200)
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      className={`cart-button ${compact ? 'compact' : ''}`}
      type="button"
      disabled={disabled}
      onClick={handleClick}
    >
      {outOfStock ? 'SIN STOCK' : pending ? 'AGREGANDO…' : added ? 'AGREGADO ✓' : 'AGREGAR AL CARRITO'}
    </button>
  )
}
export default AddToCartButton
