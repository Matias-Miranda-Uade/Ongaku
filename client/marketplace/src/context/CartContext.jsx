import { createContext, useState } from 'react'
import { products } from '../data/mockData'

export const CartContext = createContext(null)

export const CartProvider = ({ children }) => {

    // Datos de prueba: reemplazar por [] cuando se conecte el back
    const [items, setItems] = useState([
        { ...products[0], quantity: 1 },
        { ...products[1], quantity: 2 },
    ]) //{id, name, artist, price, stock, quantity}

    const addItem = (product, quantity = 1) => {
        if (product.stock <= 0) return
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
        setItems((current) =>
            current.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
                    : item
            )
        )
    }

    const removeItem = (id) => {
        setItems((current) => current.filter((item) => item.id !== id))
    }

    const clearCart = () => {
        setItems([])
    }

    const isInCart = (id) => items.some((item) => item.id === id)

    const totalProducts = items.length
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                totalProducts,
                totalUnits,
                total,
                addItem,
                updateQuantity,
                removeItem,
                clearCart,
                isInCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
