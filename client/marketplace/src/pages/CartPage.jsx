import { useEffect, useState } from "react"
import useCart from "../hooks/useCart"
import { getVinyls } from '../services/vinylService'
import { useAuth } from '../context/AuthContext'
import AddressBook from '../components/profile/AddressBook'
import CartItemsList from "../components/cart/CartItemsList"
import CartSummary from "../components/cart/CartSummary"
import CartGuarantees from "../components/cart/CartGuarantees"
import SuggestedProducts from "../components/cart/SuggestedProducts"

const CartPage = ({ onCheckout, onNavigate }) => {
    const [checkoutError, setCheckoutError] = useState('')
    const [products, setProducts] = useState([])
    const [suggestionError, setSuggestionError] = useState('')
    const [addressId, setAddressId] = useState(null)
    const [pending, setPending] = useState(false)
    const { user } = useAuth()
    useEffect(() => {
        let active = true
        getVinyls().then((data) => { if (active) setProducts(data.map((product) => ({ ...product, artist: product.artistName, price: product.finalPrice ?? product.price }))) })
            .catch((error) => { if (active) setSuggestionError(error.message) })
        return () => { active = false }
    }, [])
    const { items, updateQuantity, removeItem, clearCart, addItem, isInCart, totalProducts, totalUnits, total } = useCart()

    const handleCheckout = async () => {
        setCheckoutError('')
        if (pending) return
        if (user && !addressId) { setCheckoutError('Agregá y seleccioná una dirección de envío.'); return }
        setPending(true)
        try {
            const result = await onCheckout?.({ addressId })
            if (result?.error) setCheckoutError(result.error)
        } finally { setPending(false) }
    }

    const suggested = products.filter((p) => !isInCart(p.id)).slice(0, 3)

    return (
        <section className="cart-page">
        <div className="legacy-heading">
            <p className="eyebrow">BÓVEDA DE COLECCIÓN</p>
            <h1>Bolsa de selección</h1>
            <p className="legacy-description">{totalUnits} {totalUnits === 1 ? 'pieza' : 'piezas'} en tu bolsa.</p>
        </div>
        {checkoutError && <p role="alert">{checkoutError}</p>}
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
                    {user && <AddressBook key={user.id} selectable selectedId={addressId} onSelect={setAddressId} />}
                    <CartSummary
                        totalProducts={totalProducts}
                        totalUnits={totalUnits}
                        total={total}
                        onCheckout={handleCheckout}
                        disabled={pending || Boolean(user && !addressId)}
                        pending={pending}
                    />
                    <CartGuarantees />
                </aside>
              </div>
        }
        <div className="cart-suggestions">
            {suggestionError && <p role="alert">No se pudieron cargar las sugerencias: {suggestionError}</p>}
            <SuggestedProducts products={suggested} onAdd={addItem} />
        </div>
        </section>
    )
}

export default CartPage
