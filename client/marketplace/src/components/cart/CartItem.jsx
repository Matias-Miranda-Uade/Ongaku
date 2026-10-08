import CartItemQuantity from "./CartItemQuantity"

const CartItem = ({ item, onQuantityChange, onRemove }) => {
    return (
        <>
        <h3>{item.name}</h3>
        <p>{item.artist}</p>
        <p>Precio: ${item.price.toLocaleString('es-AR')}</p>
        <CartItemQuantity
            quantity={item.quantity}
            max={item.stock}
            onChange={(quantity) => onQuantityChange(item.id, quantity)}
        />
        <p>Subtotal: ${(item.price * item.quantity).toLocaleString('es-AR')}</p>
        <button onClick={() => onRemove(item.id)}>Eliminar</button>
        </>
    )
}

export default CartItem
