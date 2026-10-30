import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderFilters from '../components/order/OrderFilters';
import OrderCard from '../components/order/OrderCard';
import OrderDetailPage from './OrderDetailPage';
import { AuthContext } from '../context/AuthContext';
import { cancelOrder, fetchOrderById, payOrder } from '../Redux/actions/ordersActions';
import { createReview } from '../Redux/actions/reviewsActions';
import {
  resetCheckoutForm,
  selectFilteredOrders,
  selectOrderById,
  selectOrders,
  selectOrdersActionError,
  selectOrdersStatus,
  selectOrdersNotice,
  selectPendingAction,
  selectStatusFilter,
  setStatusFilter
} from '../Redux/slices/ordersSlice';
import { selectMyReviews, selectReviewsError, selectSubmittingVinylId } from '../Redux/slices/reviewsSlice';

const sameId = (left, right) => String(left) === String(right);
const attachReviews = (order, reviews) => order && ({
  ...order,
  items: order.items.map(item => ({
    ...item,
    review: reviews.find(review => sameId(review.vinylId, item.vinylId)) ?? item.review ?? null
  }))
});

const OrdersPage = ({
  authenticated,
  selectedOrderId,
  onNavigate,
  onSelectOrder,
  focusReview = false
}) => {
  const { isAdmin } = useContext(AuthContext);
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const reviews = useSelector(selectMyReviews);
  const selectedOrder = useSelector(selectOrderById(selectedOrderId));
  const ordersStatus = useSelector(selectOrdersStatus);
  const detailStatus = useSelector(state => state.orders.detailStatus);
  const detailId = useSelector(state => state.orders.detailId);
  const detailError = useSelector(state => state.orders.detailError);
  const actionError = useSelector(selectOrdersActionError);
  const reviewError = useSelector(selectReviewsError);
  const notice = useSelector(selectOrdersNotice);
  const pendingAction = useSelector(selectPendingAction);
  const status = useSelector(selectStatusFilter);
  const filtered = useSelector(selectFilteredOrders);
  const submittingVinylId = useSelector(selectSubmittingVinylId);

  useEffect(() => {
    if (!selectedOrderId || !authenticated || ordersStatus !== 'succeeded' || selectedOrder) return;
    dispatch(fetchOrderById(selectedOrderId));
  }, [dispatch, selectedOrderId, authenticated, ordersStatus, selectedOrder]);

  useEffect(() => {
    if (selectedOrderId) dispatch(resetCheckoutForm());
  }, [dispatch, selectedOrderId]);

  const handleCancelOrder = id => {
    if (pendingAction) return Promise.resolve();
    return dispatch(cancelOrder(id)).unwrap().catch(() => undefined);
  };
  const handlePayOrder = (order, { savedCardId, addressId } = {}) => {
    if (isAdmin || pendingAction || order.status !== 'PENDIENTE') return Promise.resolve();
    return dispatch(payOrder({ order, savedCardId, addressId, isAdmin })).unwrap().catch(() => undefined);
  };
  const rateItem = (vinylId, review) => dispatch(createReview({
    ...review,
    vinylId
  })).unwrap().catch(() => undefined);

  if (!authenticated) {
    return <section className="empty-state-card">
        <p className="eyebrow">TU ACTIVIDAD</p>
        <h2>Ingresá para ver tus órdenes</h2>
        <p>Tu historial de compras está asociado a tu cuenta.</p>
        <button className="primary-button" onClick={() => onNavigate?.('login')}>Ingresar</button>
      </section>;
  }
  if (selectedOrderId) {
    const detailOrder = attachReviews(selectedOrder, reviews);
    const loadingDetail = ordersStatus === 'succeeded' && detailStatus === 'loading' && String(detailId) === String(selectedOrderId);
    const visibleError = actionError || reviewError || (detailError ? `No se pudo cargar la orden: ${detailError}` : '');
    return <section className="orders-page">
        {visibleError && <p className="form-error" role="alert">{visibleError}</p>}
        {notice && <p className="storage-notice" role="status">{notice}</p>}
        {loadingDetail && !detailOrder ? <p className="orders-loading" role="status">Cargando orden…</p> : detailOrder ? <OrderDetailPage order={detailOrder} onBack={() => onNavigate?.('orders')} onCancel={handleCancelOrder} onRate={rateItem} onPay={handlePayOrder} isAdmin={isAdmin} paying={pendingAction === 'paying'} cancelling={pendingAction === 'cancelling'} submittingReview={submittingVinylId != null} submittingVinylId={submittingVinylId} focusReview={focusReview} /> : <section className="empty-state-card">
                <p className="eyebrow">TU ACTIVIDAD</p>
                <h2>No encontramos esa orden</h2>
                <button className="secondary-button" onClick={() => onNavigate?.('orders')}>Volver a mis órdenes</button>
              </section>}
      </section>;
  }
  return <section className="orders-page">
      <div className="orders-heading">
        <p className="eyebrow">TU ACTIVIDAD</p>
        <h1>Mis órdenes</h1>
        <p className="legacy-description">El recorrido de cada edición que elegiste.</p>
      </div>
      {(actionError || reviewError) && <p className="form-error" role="alert">{actionError || reviewError}</p>}
      <div className="orders-toolbar">
        <span className="orders-count">{orders.length} {orders.length === 1 ? 'ORDEN' : 'ÓRDENES'}</span>
        <OrderFilters status={status} onChange={value => dispatch(setStatusFilter(value))} />
      </div>
      {filtered.length === 0 ? <section className="empty-state-card">
            <p className="eyebrow">TU ACTIVIDAD</p>
            <h2>{orders.length ? 'No hay órdenes con este estado' : 'Todavía no hay órdenes'}</h2>
            <p>{orders.length ? 'Probá con otro filtro.' : 'Cuando hagas una compra, vas a poder seguirla desde acá.'}</p>
            {!orders.length && <button className="primary-button" onClick={() => onNavigate?.('catalog')}>Explorar catálogo</button>}
          </section> : <div className="orders-list">{filtered.map(order => <OrderCard key={order.id} order={attachReviews(order, reviews)} onSelect={onSelectOrder} />)}</div>}
    </section>;
};
export default OrdersPage;
