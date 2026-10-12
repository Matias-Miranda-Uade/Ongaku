import { createContext, useEffect, useRef, useState } from 'react'
import {
    addCartItem,
    clearServerCart,
    getCart,
    removeCartItem,
    updateCartItem,
} from '../services/api'

export const CartContext = createContext(null)

export const CartProvider = ({ children, user }) => {
    const [items, setItems] = useState([]) //{id, name, artist, price, stock, quantity}
    const [error, setError] = useState('')
    const previousUserId = useRef(null)

    useEffect(() => {
        if (!user) {
            if (previousUserId.current !== null) setItems([])
            previousUserId.current = null
            return
        }

        let active = true
        const guestItems = previousUserId.current === null ? items : []
        previousUserId.current = user.id
        setError('')

        const load = async () => {
            try {
                let cart = await getCart()
                for (const item of guestItems) {
                    cart = await addCartItem(item.id, item.quantity)
                }
                if (active) setItems(cart.items)
            } catch (loadError) {
                if (active) setError(loadError.message)
            }
        }

        load()
        return () => {
            active = false
        }
    }, [user?.id])

    const showError = (requestError) => {
        setError(requestError.message)
    }

    const refreshCart = async () => {
        if (!user) return
        try {
            const cart = await getCart()
            setItems(cart.items)
            setError('')
        } catch (requestError) {
            showError(requestError)
        }
    }

    const addItem = (product, quantity = 1) => {
        if (product.stock <= 0) return
        setError('')
        if (user) {
            addCartItem(product.id, quantity)
                .then((cart) => setItems(cart.items))
                .catch(showError)
            return
        }
        setItems((current) => {
            const existing = current.find((item) => item.id === product.id)
            if (existing) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
                        : item
                )
            }
            return [...current, { ...product, quantity: Math.min(quantity, product.stock) }]
        })
    }

    // La cantidad siempre queda entre 1 y el stock del vinilo
    const updateQuantity = (id, quantity) => {
        setError('')
        if (user) {
            updateCartItem(id, quantity)
                .then((cart) => setItems(cart.items))
                .catch(showError)
            return
        }
        setItems((current) =>
            current.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
                    : item
            )
        )
    }

    const removeItem = (id) => {
        setError('')
        if (user) {
            removeCartItem(id)
                .then((cart) => setItems(cart.items))
                .catch(showError)
            return
        }
        setItems((current) => current.filter((item) => item.id !== id))
    }

    const clearCart = () => {
        setError('')
        if (user) {
            clearServerCart()
                .then((cart) => setItems(cart.items))
                .catch(showError)
            return
        }
        setItems([])
    }

    const isInCart = (id) => items.some((item) => item.id === id)

    const totalProducts = items.length
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)
    const total = items.reduce((sum, item) => sum + (item.subtotal ?? item.price * item.quantity), 0)

    return (
        <CartContext.Provider
            value={{
                items,
                error,
                totalProducts,
                totalUnits,
                total,
                addItem,
                updateQuantity,
                removeItem,
                clearCart,
                isInCart,
                refreshCart,
            }}
        >
            {error && <p className="storage-notice" role="alert">{error}</p>}
            {children}
        </CartContext.Provider>
    )
}
