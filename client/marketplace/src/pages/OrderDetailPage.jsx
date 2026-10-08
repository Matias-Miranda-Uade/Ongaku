import OrderStatus from "../components/order/OrderStatus"
import OrderProgress from "../components/order/OrderProgress"
import OrderItem from "../components/order/OrderItem"
import OrderRating from "../components/order/OrderRating"
import ShippingAddress from "../components/order/ShippingAddress"
import PaymentInfo from "../components/order/PaymentInfo"
import OrderTotals from "../components/order/OrderTotals"
import TrackingButton from "../components/order/TrackingButton"

const OrderDetailPage = ({ order, onBack, onCancel, onRate }) => {
    return (
        <>
        <button onClick={onBack}>Volver</button>
        <h1>Orden #{order.id}</h1>
        <p>{new Date(order.createdAt).toLocaleDateString('es-AR')}</p>
        <p>Estado: <OrderStatus status={order.status} /></p>
        <OrderProgress status={order.status} />
        <h2>Productos</h2>
        {
            order.items.map((item) => (
                <div key={item.vinylId}>
                    <OrderItem item={item} />
                    {order.status === 'ENTREGADA' && (
                        <OrderRating item={item} onRate={(vinylId, review) => onRate(order.id, vinylId, review)} />
                    )}
                </div>
            ))
        }
        <ShippingAddress address={order.shippingAddress} />
        <PaymentInfo payment={order.payment} />
        <OrderTotals order={order} />
        {order.status === 'ENVIADA' && <TrackingButton trackingCode={order.trackingCode} />}
        {order.status === 'PENDIENTE' && <button onClick={() => onCancel(order.id)}>Cancelar orden</button>}
        </>
    )
}

export default OrderDetailPage
