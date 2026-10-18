import { useCallback, useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus } from '../../services/adminService'
import { ORDER_TRANSITIONS, formatDateTime, formatMoney, orderStatusName } from '../../components/admin/adminUtils'
import { statusLabels } from '../../data/orderStatuses'

const OrdersAdminPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setOrders(await getAllOrders())
    } catch (requestError) {
      setError(requestError.message || 'No se pudieron cargar las órdenes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const changeStatus = async (order, status) => {
    setUpdatingId(order.id)
    setError('')
    setNotice('')
    try {
      const updated = await updateOrderStatus(order.id, status)
      setOrders((current) => current.map((item) => item.id === order.id
        ? { ...item, ...updated, orderStatus: updated.orderStatus ?? { ...item.orderStatus, name: status } }
        : item))
      setNotice(`La orden #${order.id} ahora está ${statusLabels[status]?.toLowerCase() ?? status}.`)
    } catch (requestError) {
      setError(requestError.message || 'No se pudo actualizar el estado de la orden.')
    } finally {
      setUpdatingId(null)
    }
  }

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <section className="admin-page" aria-labelledby="admin-orders-title">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">OPERACIONES · SEGUIMIENTO</p>
          <h1 id="admin-orders-title">Órdenes</h1>
        </div>
        <button className="secondary-button" type="button" onClick={load} disabled={loading}>Actualizar</button>
      </header>
      {error && <div className="admin-alert" role="alert"><p>{error}</p><button type="button" className="link-button" onClick={load}>Reintentar</button></div>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      <section className="admin-panel" aria-label="Todas las órdenes">
        {loading && <div className="skeleton skeleton-list" />}
        {!loading && sortedOrders.length === 0 && <p className="admin-empty">Todavía no se registraron órdenes.</p>}
        {!loading && sortedOrders.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Orden</th><th>Cliente</th><th>Fecha</th><th className="num">Unidades</th><th className="num">Total</th><th>Estado</th><th>Detalle</th></tr></thead>
              <tbody>{sortedOrders.map((order) => {
                const status = orderStatusName(order)
                const nextStatuses = ORDER_TRANSITIONS[status] ?? []
                return (
                  <tr key={order.id}>
                    <td className="mono">#{String(order.id).padStart(5, '0')}</td>
                    <td>{order.userName || `Usuario ${order.userId ?? ''}`}</td>
                    <td className="mono muted">{formatDateTime(order.createdAt)}</td>
                    <td className="num">{order.totalUnits ?? order.items?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) ?? '—'}</td>
                    <td className="num">{formatMoney(order.total)}</td>
                    <td>{nextStatuses.length === 0 ? <span className={`order-pill order-pill-${status.toLowerCase()}`}>{statusLabels[status] ?? status}</span> : (
                      <label className="order-status-select"><span className="sr-only">Cambiar estado de la orden {order.id}</span><select value={status} disabled={updatingId === order.id} onChange={(event) => changeStatus(order, event.target.value)}><option value={status}>{statusLabels[status] ?? status}</option>{nextStatuses.map((next) => <option key={next} value={next}>{statusLabels[next]}</option>)}</select></label>
                    )}</td>
                    <td><details className="admin-order-detail"><summary>Ver detalle</summary><ul>{(order.items ?? []).map((item, index) => <li key={item.vinylId ?? index}>{item.name} × {item.quantity}</li>)}</ul></details></td>
                  </tr>
                )
              })}</tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}

export default OrdersAdminPage
