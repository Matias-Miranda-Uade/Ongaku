import CartItem from "./CartItem"

const CartItemsList = ({ items, onQuantityChange, onRemove }) => {
    return (
        <ul>
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
