// Selector de cantidad: nunca baja de 1 ni supera el stock disponible
const CartItemQuantity = ({ quantity, max, onChange }) => {
    return (
        <>
        <button onClick={() => onChange(quantity - 1)} disabled={quantity <= 1}>-</button>
        <span> {quantity} </span>
        <button onClick={() => onChange(quantity + 1)} disabled={quantity >= max}>+</button>
        </>
    )
}

export default CartItemQuantity
