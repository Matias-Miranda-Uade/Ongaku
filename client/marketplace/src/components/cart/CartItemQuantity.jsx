import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateQuantity } from '../../Redux/slices/cartSlice'

const CartItemQuantity = ({ id, quantity, max, disabled = false }) => {
  const dispatch = useDispatch()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const changeQuantity = nextQuantity => {
    if (pending || disabled) return
    setPending(true)
    setError('')
    dispatch(updateQuantity({ id, quantity: nextQuantity })).then(result => {
      if (result.error) setError(result.error.message)
      setPending(false)
    })
  }

  return (
    <>
      <div className="cart-quantity-control" role="group" aria-label="Cantidad">
        <button type="button" onClick={() => changeQuantity(quantity - 1)} disabled={disabled || pending || quantity <= 1} aria-label="Quitar una unidad">−</button>
        <output aria-live="polite">{quantity}</output>
        <button type="button" onClick={() => changeQuantity(quantity + 1)} disabled={disabled || pending || quantity >= max} aria-label="Agregar una unidad">+</button>
      </div>
      {error && <span role="alert">{error}</span>}
    </>
  )
}

export default CartItemQuantity
