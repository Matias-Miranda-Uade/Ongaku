import CartItemQuantity from "./CartItemQuantity"
import RemoveCartItemButton from "./RemoveCartItemButton"

const CartItem = ({ item, disabled = false }) => {
    return (
        <article className="cart-item-card">
            <img src={item.image} alt={`Portada de ${item.name}`} />
            <div className="cart-item-details">
                <p className="eyebrow">{item.artistName || item.artist}</p>
                <h2>{item.name}</h2>
                <p className="cart-item-edition">Prensado de archivo · {item.year}</p>
                <RemoveCartItemButton id={item.id} disabled={disabled} />
            </div>
            <div className="cart-item-purchase">
                <strong>${(item.price * item.quantity).toLocaleString('es-AR')}</strong>
                <CartItemQuantity
                    id={item.id}
                    quantity={item.quantity}
                    max={item.stock}
                    disabled={disabled}
                />
            </div>
        </article>
    )
}

export default CartItem
