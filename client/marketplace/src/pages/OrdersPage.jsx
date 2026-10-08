import { useState } from "react"
import { orders as initialOrders } from "../data/mockData"
import OrderFilters from "../components/order/OrderFilters"
import OrderCard from "../components/order/OrderCard"
import OrderDetailPage from "./OrderDetailPage"

const OrdersPage = () => {

    const [orders, setOrders] = useState(initialOrders)
    const [status, setStatus] = useState('TODAS')
    const [selectedId, setSelectedId] = useState(null)

    // El cliente solo puede cancelar una orden PENDIENTE
    const cancelOrder = (id) => {
        setOrders(orders.map((o) =>
            o.id === id && o.status === 'PENDIENTE' ? { ...o, status: 'CANCELADA' } : o
        ))
    }

    // Una reseña por vinilo: se aplica a los ítems con ese vinilo que aún no tengan reseña
    const rateItem = (orderId, vinylId, review) => {
        setOrders(orders.map((o) => ({
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
        <h1>Mis órdenes</h1>
        <OrderFilters status={status} onChange={setStatus} />
        {filtered.length === 0
            ? <p>No hay órdenes para mostrar</p>
            : filtered.map((order) => (
                <OrderCard key={order.id} order={order} onSelect={setSelectedId} />
            ))
        }
        </>
    )
}

export default OrdersPage
