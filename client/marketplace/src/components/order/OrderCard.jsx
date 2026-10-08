import OrderStatus from "./OrderStatus"

const OrderCard = ({ order, onSelect }) => {
    return (
        <>
        <h3>Orden #{order.id}</h3>
        <p>{new Date(order.createdAt).toLocaleDateString('es-AR')}</p>
        <p>Estado: <OrderStatus status={order.status} /></p>
        <p>Productos: {order.items.length}</p>
        <p>Total: ${order.total.toLocaleString('es-AR')}</p>
        <button onClick={() => onSelect(order.id)}>Ver detalle</button>
        </>
    )
}

export default OrderCard
