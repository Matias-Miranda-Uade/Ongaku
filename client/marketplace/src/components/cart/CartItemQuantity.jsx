// Selector de cantidad: nunca baja de 1 ni supera el stock disponible
const CartItemQuantity = ({ quantity, max, onChange, disabled = false }) => (
  <div className="cart-quantity-control" role="group" aria-label="Cantidad">
    <button type="button" onClick={() => onChange(quantity - 1)} disabled={disabled || quantity <= 1} aria-label="Quitar una unidad">−</button>
    <output aria-live="polite">{quantity}</output>
    <button type="button" onClick={() => onChange(quantity + 1)} disabled={disabled || quantity >= max} aria-label="Agregar una unidad">+</button>
  </div>
)

export default CartItemQuantity
