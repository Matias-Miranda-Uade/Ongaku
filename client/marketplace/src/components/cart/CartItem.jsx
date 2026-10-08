import CartItemQuantity from "./CartItemQuantity"

const CartItem = ({ item, onQuantityChange, onRemove }) => {
    return (
        <article className="cart-item-card">
            <img src={item.image} alt={`Portada de ${item.name}`} />
            <div className="cart-item-details">
                <p className="eyebrow">{item.artistName || item.artist}</p>
                <h2>{item.name}</h2>
                <p className="cart-item-edition">Prensado de archivo · {item.year}</p>
                <button className="text-link-button" onClick={() => onRemove(item.id)}>Retirar de la bolsa</button>
            </div>
            <div className="cart-item-purchase">
                <strong>${(item.price * item.quantity).toLocaleString('es-AR')}</strong>
                <CartItemQuantity
                    quantity={item.quantity}
                    max={item.stock}
                    onChange={(quantity) => onQuantityChange(item.id, quantity)}
                />
            </div>
        </article>
    )
}

export default CartItem
