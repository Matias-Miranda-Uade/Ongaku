import OrderStatus from "./OrderStatus"

const OrderCard = ({ order, onSelect }) => {
    return (
        <article className="order-card">
            <div className="order-card-heading">
                <div>
                    <span className="order-reference">ONGAKU / #{order.id}</span>
                    <h2>Selección de archivo</h2>
                    <p>{new Date(order.createdAt).toLocaleDateString('es-AR')}</p>
                </div>
                <OrderStatus status={order.status} />
            </div>
            <div className="order-card-items">
                {order.items.slice(0, 3).map((item) => (
                    <div key={item.vinylId}>
                        <span>{item.name}</span>
                        <span>× {item.quantity}</span>
                    </div>
                ))}
                {order.items.length > 3 && <span>+{order.items.length - 3} ediciones</span>}
            </div>
            <div className="order-card-footer">
                <span>{order.items.length} {order.items.length === 1 ? 'título' : 'títulos'}</span>
                <strong>${order.total.toLocaleString('es-AR')}</strong>
                <button className="secondary-button" onClick={() => onSelect(order.id)}>Ver detalle <span aria-hidden="true">→</span></button>
            </div>
        </article>
    )
}

export default OrderCard
