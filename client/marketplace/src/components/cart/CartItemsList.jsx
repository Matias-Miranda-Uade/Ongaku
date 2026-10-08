import CartItem from "./CartItem"

const CartItemsList = ({ items, onQuantityChange, onRemove }) => {
    return (
        <ul className="cart-item-list">
            {
                items.map((item) => (
                    <li key={item.id}>
                        <CartItem
                            item={item}
                            onQuantityChange={onQuantityChange}
                            onRemove={onRemove}
                        />
                    </li>
                ))
            }
        </ul>
    )
}

export default CartItemsList
