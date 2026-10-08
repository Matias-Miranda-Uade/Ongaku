import { useState } from "react"
import OrderFilters from "../components/order/OrderFilters"
import OrderCard from "../components/order/OrderCard"
import OrderDetailPage from "./OrderDetailPage"

const OrdersPage = ({ orders: accountOrders = [], onNavigate, onOrdersChange }) => {

    const [orders, setOrders] = useState(accountOrders)
    const [status, setStatus] = useState('TODAS')
    const [selectedId, setSelectedId] = useState(null)

    const updateOrders = (updater) => {
        const nextOrders = updater(orders)
        setOrders(nextOrders)
        onOrdersChange?.(nextOrders)
    }

    // El cliente solo puede cancelar una orden PENDIENTE
    const cancelOrder = (id) => {
        updateOrders((currentOrders) => currentOrders.map((o) =>
            o.id === id && o.status === 'PENDIENTE' ? { ...o, status: 'CANCELADA' } : o
        ))
    }

    // Una reseña por vinilo: se aplica a los ítems con ese vinilo que aún no tengan reseña
    const rateItem = (orderId, vinylId, review) => {
        updateOrders((currentOrders) => currentOrders.map((o) => ({
            ...o,
            items: o.items.map((item) =>
                item.vinylId === vinylId && !item.review ? { ...item, review } : item
            ),
        })))
    }

    const selectedOrder = orders.find((o) => o.id === selectedId)

    if (selectedOrder) {
        return (
            <OrderDetailPage
                order={selectedOrder}
                onBack={() => setSelectedId(null)}
                onCancel={cancelOrder}
                onRate={rateItem}
            />
        )
    }

    const filtered = status === 'TODAS' ? orders : orders.filter((o) => o.status === status)

    return (
        <>
        <div className="orders-heading">
            <p className="eyebrow">TU ACTIVIDAD</p>
            <h1>Mis órdenes</h1>
        </div>
        <OrderFilters status={status} onChange={setStatus} />
        {filtered.length === 0
            ? <div className="empty-state-card">
                <h2>Todavía no hay órdenes</h2>
                <p>Cuando hagas una compra, vas a poder seguirla desde acá.</p>
                <button className="primary-button" onClick={() => onNavigate?.('catalog')}>Explorar catálogo</button>
              </div>
            : <div className="orders-list">{filtered.map((order) => (
                <OrderCard key={order.id} order={order} onSelect={setSelectedId} />
            ))}</div>
        }
        </>
    )
}

export default OrdersPage
