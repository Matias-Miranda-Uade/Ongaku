import CartItem from "./CartItem"

const CartItemsList = ({ items, disabled = false }) => {
    return (
        <ul className="cart-item-list">
            {
                items.map((item) => (
                    <li key={item.id}>
                        <CartItem
                            item={item}
                            disabled={disabled}
                        />
                    </li>
                ))
            }
        </ul>
    )
}

export default CartItemsList
