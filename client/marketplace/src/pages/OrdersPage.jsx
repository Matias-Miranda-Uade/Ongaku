import { useContext, useEffect, useMemo, useState } from 'react'
import OrderFilters from '../components/order/OrderFilters'
import OrderCard from '../components/order/OrderCard'
import OrderDetailPage from './OrderDetailPage'
import { AuthContext } from '../context/AuthContext'
import {
  cancelOrder as cancelOrderRequest,
  createReview,
  createPayment,
  getMyReviews,
  getOrder,
} from '../services/api'

const OrdersPage = ({
  orders: accountOrders = [],
  authenticated,
  selectedOrderId,
  onNavigate,
  onSelectOrder,
  onOrdersChange,
}) => {
  const { isAdmin } = useContext(AuthContext)
  const [status, setStatus] = useState('TODAS')
  const [error, setError] = useState('')
  const [myReviews, setMyReviews] = useState([])
  const [detailOrder, setDetailOrder] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [paying, setPaying] = useState(false)
  const [notice, setNotice] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (!authenticated) {
      setMyReviews([])
      return
    }

    let active = true
    getMyReviews()
      .then((reviews) => {
        if (active) setMyReviews(reviews)
      })
      .catch((requestError) => {
        if (active) setError(`No se pudieron cargar tus reseñas: ${requestError.message}`)
      })

    return () => {
      active = false
    }
  }, [authenticated])

  const orders = useMemo(() => accountOrders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      review: myReviews.find((review) => String(review.vinylId) === String(item.vinylId)) ?? item.review ?? null,
    })),
  })), [accountOrders, myReviews])

  useEffect(() => {
    if (!selectedOrderId || !authenticated) {
      setDetailOrder(null)
      return
    }

    const existingOrder = orders.find((order) => String(order.id) === String(selectedOrderId))
    if (existingOrder) {
      setDetailOrder(existingOrder)
      setError('')
      return
    }

    let active = true
    setLoadingDetail(true)
    setError('')
    getOrder(selectedOrderId)
      .then((order) => {
        if (active) setDetailOrder(order)
      })
      .catch((requestError) => {
        if (active) setError(`No se pudo cargar la orden: ${requestError.message}`)
      })
      .finally(() => {
        if (active) setLoadingDetail(false)
      })

    return () => {
      active = false
    }
  }, [selectedOrderId, authenticated, orders])

  const cancelOrder = async (id) => {
    if (paying || cancelling) return
    setError('')
    setCancelling(true)
    try {
      const updatedOrder = await cancelOrderRequest(id)
      onOrdersChange?.(accountOrders.map((order) => order.id === id ? updatedOrder : order))
      setDetailOrder(updatedOrder)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setCancelling(false)
    }
  }

  const payOrder = async (order, { savedCardId } = {}) => {
    if (isAdmin || paying || cancelling || order.status !== 'PENDIENTE') return
    setError('')
    setNotice('')
    setPaying(true)
    try {
      const payment = await createPayment({ orderId: order.id, amount: order.total, savedCardId })
      const updatedOrder = {
        ...order,
        payment,
        status: 'PAGADA',
        orderStatus: { ...order.orderStatus, name: 'PAGADA' },
      }
      onOrdersChange?.(accountOrders.map((item) => item.id === order.id ? updatedOrder : item))
      setDetailOrder(updatedOrder)
      setNotice('Pago de prueba registrado. Vas a poder reseñar los vinilos cuando la orden sea entregada.')
    } catch (requestError) {
      setError(`No se pudo pagar la orden: ${requestError.message}`)
    } finally { setPaying(false) }
  }

  const rateItem = async (vinylId, review) => {
    setError('')
    setSubmittingReview(true)
    try {
      const savedReview = await createReview({ ...review, vinylId })
      setMyReviews((current) => [...current.filter((item) => String(item.vinylId) !== String(vinylId)), savedReview])
    } catch (requestError) {
      setError(`No se pudo guardar la reseña: ${requestError.message}`)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (!authenticated) {
    return (
      <section className="empty-state-card">
        <p className="eyebrow">TU ACTIVIDAD</p>
        <h2>Ingresá para ver tus órdenes</h2>
        <p>Tu historial de compras está asociado a tu cuenta.</p>
        <button className="primary-button" onClick={() => onNavigate?.('login')}>Ingresar</button>
      </section>
    )
  }

  if (selectedOrderId) {
    const selectedOrder = orders.find((order) => String(order.id) === String(selectedOrderId)) ?? (
      detailOrder && {
        ...detailOrder,
        items: detailOrder.items.map((item) => ({
          ...item,
          review: myReviews.find((review) => String(review.vinylId) === String(item.vinylId)) ?? item.review ?? null,
        })),
      }
    )

    return (
      <section className="orders-page">
        {error && <p className="form-error" role="alert">{error}</p>}
        {notice && <p className="storage-notice" role="status">{notice}</p>}
        {loadingDetail && !selectedOrder
          ? <p className="orders-loading" role="status">Cargando orden…</p>
          : selectedOrder
            ? <OrderDetailPage
                order={selectedOrder}
                onBack={() => onNavigate?.('orders')}
                onCancel={cancelOrder}
                onRate={rateItem}
                onPay={payOrder}
                isAdmin={isAdmin}
                paying={paying}
                cancelling={cancelling}
                submittingReview={submittingReview}
              />
            : <section className="empty-state-card">
                <p className="eyebrow">TU ACTIVIDAD</p>
                <h2>No encontramos esa orden</h2>
                <button className="secondary-button" onClick={() => onNavigate?.('orders')}>Volver a mis órdenes</button>
              </section>}
      </section>
    )
  }

  const filtered = status === 'TODAS' ? orders : orders.filter((order) => order.status === status)

  return (
    <section className="orders-page">
      <div className="orders-heading">
        <p className="eyebrow">TU ACTIVIDAD</p>
        <h1>Mis órdenes</h1>
        <p className="legacy-description">El recorrido de cada edición que elegiste.</p>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="orders-toolbar">
        <span className="orders-count">{orders.length} {orders.length === 1 ? 'ORDEN' : 'ÓRDENES'}</span>
        <OrderFilters status={status} onChange={setStatus} />
      </div>
      {filtered.length === 0
        ? <section className="empty-state-card">
            <p className="eyebrow">TU ACTIVIDAD</p>
            <h2>{orders.length ? 'No hay órdenes con este estado' : 'Todavía no hay órdenes'}</h2>
            <p>{orders.length ? 'Probá con otro filtro.' : 'Cuando hagas una compra, vas a poder seguirla desde acá.'}</p>
            {!orders.length && <button className="primary-button" onClick={() => onNavigate?.('catalog')}>Explorar catálogo</button>}
          </section>
        : <div className="orders-list">{filtered.map((order) => (
            <OrderCard key={order.id} order={order} onSelect={onSelectOrder} />
          ))}</div>}
    </section>
  )
}

export default OrdersPage
