import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import OrderFilters from '../components/order/OrderFilters';
import OrderCard from '../components/order/OrderCard';
import OrderDetailPage from './OrderDetailPage';
import { AuthContext } from '../context/AuthContext';
import { createReview } from '../Redux/actions/reviewsActions';
import { selectMyReviews, selectReviewsError, selectSubmittingVinylId } from '../Redux/slices/reviewsSlice';

const attachReviews = (order, reviews) => order && ({
  ...order,
  items: order.items.map(item => ({
    ...item,
    review: reviews.find(review => String(review.vinylId) === String(item.vinylId)) ?? item.review ?? null
  }))
});

const OrdersPage = ({ authenticated, selectedOrderId, onNavigate, onSelectOrder, focusReview = false }) => {
  const { isAdmin } = useContext(AuthContext);
  const orders = useSelector(state => state.orders.items);
  const ordersLoading = useSelector(state => state.orders.loading);
  const selectedOrder = useSelector(state => state.orders.items.find(order => String(order.id) === String(selectedOrderId)));
  const reviews = useSelector(selectMyReviews);
  const reviewError = useSelector(selectReviewsError);
  const submittingVinylId = useSelector(selectSubmittingVinylId);
  const [status, setStatus] = useState('TODAS');
  const filtered = status === 'TODAS'
    ? orders
    : orders.filter(order => order.status === status);

  if (!authenticated) {
    return (
      <section className="empty-state-card">
        <p className="eyebrow">TU ACTIVIDAD</p>
        <h2>Ingresá para ver tus órdenes</h2>
        <p>Tu historial de compras está asociado a tu cuenta.</p>
        <button className="primary-button" onClick={() => onNavigate?.('login')}>Ingresar</button>
      </section>
    );
  }

  if (selectedOrderId) {
    const detailOrder = attachReviews(selectedOrder, reviews);

    return (
      <section className="orders-page">
        {reviewError && <p className="form-error" role="alert">{reviewError}</p>}
        {ordersLoading && !detailOrder ? (
          <p className="orders-loading" role="status">Cargando orden…</p>
        ) : detailOrder ? (
          <OrderDetailPage
            key={selectedOrderId}
            order={detailOrder}
            onBack={() => onNavigate?.('orders')}
            isAdmin={isAdmin}
            ordersLoading={ordersLoading}
            submittingVinylId={submittingVinylId}
            focusReview={focusReview}
          />
        ) : (
          <section className="empty-state-card">
            <p className="eyebrow">TU ACTIVIDAD</p>
            <h2>No encontramos esa orden</h2>
            <button className="secondary-button" onClick={() => onNavigate?.('orders')}>Volver a mis órdenes</button>
          </section>
        )}
      </section>
    );
  }

  return (
    <section className="orders-page">
      <div className="orders-heading">
        <p className="eyebrow">TU ACTIVIDAD</p>
        <h1>Mis órdenes</h1>
        <p className="legacy-description">El recorrido de cada edición que elegiste.</p>
      </div>
      {reviewError && <p className="form-error" role="alert">{reviewError}</p>}
      <div className="orders-toolbar">
        <span className="orders-count">{orders.length} {orders.length === 1 ? 'ORDEN' : 'ÓRDENES'}</span>
        <OrderFilters status={status} onChange={setStatus} />
      </div>
      {ordersLoading ? (
        <p className="orders-loading" role="status">Cargando órdenes…</p>
      ) : filtered.length === 0 ? (
        <section className="empty-state-card">
          <p className="eyebrow">TU ACTIVIDAD</p>
          <h2>{orders.length ? 'No hay órdenes con este estado' : 'Todavía no hay órdenes'}</h2>
          <p>{orders.length ? 'Probá con otro filtro.' : 'Cuando hagas una compra, vas a poder seguirla desde acá.'}</p>
          {!orders.length && <button className="primary-button" onClick={() => onNavigate?.('catalog')}>Explorar catálogo</button>}
        </section>
      ) : (
        <div className="orders-list">
          {filtered.map(order => (
            <OrderCard key={order.id} order={attachReviews(order, reviews)} onSelect={onSelectOrder} />
          ))}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
