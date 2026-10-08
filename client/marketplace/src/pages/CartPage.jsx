import { useState } from "react"
import useCart from "../hooks/useCart"
import { products } from "../data/mockData"
import CartItemsList from "../components/cart/CartItemsList"
import CartSummary from "../components/cart/CartSummary"
import CartGuarantees from "../components/cart/CartGuarantees"
import SuggestedProducts from "../components/cart/SuggestedProducts"

const CartPage = () => {

    const { items, updateQuantity, removeItem, clearCart, addItem, isInCart, totalProducts, totalUnits, total } = useCart()
    const [confirmed, setConfirmed] = useState(false)

    const handleCheckout = () => {
        clearCart()
        setConfirmed(true)
    }

    const suggested = products.filter((p) => !isInCart(p.id)).slice(0, 3)

    return (
        <>
        <h1>Carrito</h1>
        {items.length === 0
            ? <>
                {confirmed && <p>Orden creada correctamente</p>}
                <p>El carrito está vacío</p>
              </>
            : <>
                <CartItemsList items={items} onQuantityChange={updateQuantity} onRemove={removeItem} />
                <button onClick={clearCart}>Vaciar carrito</button>
                <CartSummary
                    totalProducts={totalProducts}
                    totalUnits={totalUnits}
                    total={total}
                    onCheckout={handleCheckout}
                />
                <CartGuarantees />
              </>
        }
        <SuggestedProducts products={suggested} onAdd={addItem} />
        </>
    )
}

export default CartPage
