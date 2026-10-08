import useCart from "../hooks/useCart"
import { products } from "../data/mockData"
import CartItemsList from "../components/cart/CartItemsList"
import CartSummary from "../components/cart/CartSummary"
import CartGuarantees from "../components/cart/CartGuarantees"
import SuggestedProducts from "../components/cart/SuggestedProducts"

const CartPage = ({ onCheckout, onNavigate }) => {

    const { items, updateQuantity, removeItem, clearCart, addItem, isInCart, totalProducts, totalUnits, total } = useCart()

    const handleCheckout = () => {
        const created = onCheckout?.({ items, total })
        if (!created) return
        clearCart()
    }

    const suggested = products.filter((p) => !isInCart(p.id)).slice(0, 3)

    return (
        <section className="cart-page">
        <div className="legacy-heading">
            <p className="eyebrow">BÓVEDA DE COLECCIÓN</p>
            <h1>Bolsa de selección</h1>
            <p className="legacy-description">{totalUnits} {totalUnits === 1 ? 'pieza' : 'piezas'} en tu bolsa.</p>
        </div>
        {items.length === 0
            ? <div className="empty-state-card">
                <h2>Tu bolsa está esperando una primera pieza.</h2>
                <p>Recorré el catálogo y sumá las ediciones que quieras escuchar en casa.</p>
                <button className="primary-button" onClick={() => onNavigate?.('catalog')}>Volver al catálogo</button>
              </div>
            : <div className="cart-layout">
                <div className="cart-items-column">
                    <CartItemsList items={items} onQuantityChange={updateQuantity} onRemove={removeItem} />
                    <button className="text-link-button" onClick={clearCart}>Vaciar la bolsa</button>
                </div>
                <aside className="cart-summary-panel">
                    <CartSummary
                        totalProducts={totalProducts}
                        totalUnits={totalUnits}
                        total={total}
                        onCheckout={handleCheckout}
                    />
                    <CartGuarantees />
                </aside>
              </div>
        }
        <div className="cart-suggestions">
            <SuggestedProducts products={suggested} onAdd={addItem} />
        </div>
        </section>
    )
}

export default CartPage
