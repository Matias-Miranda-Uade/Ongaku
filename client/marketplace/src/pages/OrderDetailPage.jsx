import OrderStatus from '../components/order/OrderStatus'
import OrderProgress from '../components/order/OrderProgress'
import OrderItem from '../components/order/OrderItem'
import OrderRating from '../components/order/OrderRating'
import ShippingAddress from '../components/order/ShippingAddress'
import PaymentInfo from '../components/order/PaymentInfo'
import DemoPaymentForm from '../components/order/DemoPaymentForm'
import OrderTotals from '../components/order/OrderTotals'
import TrackingButton from '../components/order/TrackingButton'

const OrderDetailPage = ({ order, onBack, onCancel, onRate, onPay, isAdmin = false, paying = false, cancelling = false, submittingReview = false }) => (
  <article className="order-detail">
    <button className="back-link-button" type="button" onClick={onBack}>← Volver a mis órdenes</button>
    <header className="order-detail-heading">
      <div>
        <p className="eyebrow">DETALLE DE COMPRA · {new Date(order.createdAt).toLocaleDateString('es-AR')}</p>
        <h1>Orden <span>#{order.id}</span></h1>
      </div>
      <OrderStatus status={order.status} />
    </header>

    <section className="order-progress-panel" aria-label="Progreso de la orden">
      <OrderProgress status={order.status} />
    </section>

    <div className="order-detail-grid">
      <section className="order-detail-products">
        <div className="order-section-heading">
          <p className="eyebrow">LA SELECCIÓN</p>
          <h2>Ediciones de tu orden</h2>
        </div>
        {order.items.map((item, index) => (
          <article className="order-detail-item" key={item.vinylId ?? `historical-${index}`}>
            <OrderItem item={item} />
            {item.vinylId != null && order.status === 'ENTREGADA' && (
              <OrderRating item={item} onRate={onRate} submitting={submittingReview} />
            )}
          </article>
        ))}
      </section>

      <aside className="order-detail-aside">
        <section className="order-info-card">
          <p className="eyebrow">RESUMEN</p>
          <OrderTotals order={order} />
        </section>
        <section className="order-info-card">
          <ShippingAddress address={order.shippingAddress} />
        </section>
        <section className="order-info-card">
          <PaymentInfo payment={order.payment} />
          {order.status === 'PENDIENTE' && !isAdmin && (
            <div className="order-payment-actions">
              <h3>Completar pago de prueba</h3>
              <DemoPaymentForm order={order} onPay={onPay} paying={paying} disabled={cancelling} />
            </div>
          )}
        </section>
        {order.status === 'ENVIADA' && order.trackingCode && (
          <section className="order-info-card">
            <p className="eyebrow">SEGUIMIENTO</p>
            <TrackingButton trackingCode={order.trackingCode} />
          </section>
        )}
        {order.status === 'PENDIENTE' && (
          <button
            className="order-cancel-button"
            type="button"
            disabled={cancelling || paying}
            onClick={() => onCancel(order.id)}
          >
            {cancelling ? 'Cancelando…' : 'Cancelar orden'}
          </button>
        )}
      </aside>
    </div>
  </article>
)

export default OrderDetailPage
