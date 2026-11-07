import { useState } from 'react';
import OrderStatus from '../components/order/OrderStatus';
import OrderProgress from '../components/order/OrderProgress';
import OrderItem from '../components/order/OrderItem';
import OrderRating from '../components/order/OrderRating';
import ShippingAddress from '../components/order/ShippingAddress';
import PaymentInfo from '../components/order/PaymentInfo';
import DemoPaymentForm from '../components/order/DemoPaymentForm';
import OrderTotals from '../components/order/OrderTotals';
import TrackingButton from '../components/order/TrackingButton';
import CancelOrderButton from '../components/order/CancelOrderButton';
import AddressBook from '../components/profile/AddressBook';

const OrderDetailPage = ({
  order,
  onBack,
  isAdmin = false,
  ordersLoading = false,
  submittingVinylId = null,
  focusReview = false
}) => {
  const [addressId, setAddressId] = useState(null);
  const pendingCheckout = order.status === 'PENDIENTE' && !isAdmin;

  return (
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
                <OrderRating
                  item={item}
                  submitting={String(submittingVinylId) === String(item.vinylId)}
                  autoFocus={focusReview && !order.items.slice(0, index).some(previous => !previous.review && previous.vinylId != null)}
                />
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
            {pendingCheckout
              ? <AddressBook key={order.id} selectable selectedId={addressId} onSelect={setAddressId} disabled={ordersLoading} />
              : <ShippingAddress address={order.shippingAddress} />}
          </section>
          <section className="order-info-card">
            <PaymentInfo payment={order.payment} />
            {pendingCheckout && (
              <div className="order-payment-actions">
                <h3>Completar pago</h3>
                {!addressId && <p>Podés cargar la tarjeta ahora. Elegí una dirección de envío antes de confirmar el pago.</p>}
              </div>
            )}
            <DemoPaymentForm key={order.id} order={order} addressId={addressId} disabled={ordersLoading} />
          </section>
          {order.status === 'ENVIADA' && order.trackingCode && (
            <section className="order-info-card">
              <p className="eyebrow">SEGUIMIENTO</p>
              <TrackingButton trackingCode={order.trackingCode} />
            </section>
          )}
          {order.status === 'PENDIENTE' && (
            <CancelOrderButton orderId={order.id} disabled={ordersLoading} />
          )}
        </aside>
      </div>
    </article>
  );
};

export default OrderDetailPage;
