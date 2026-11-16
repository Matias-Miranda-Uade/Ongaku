import { statusLabels } from '../../../data/orderStatuses'
import { ORDER_TRANSITIONS, formatDateTime, formatMoney, orderStatusName } from '../adminUtils'

const RecentOrdersTable = ({ orders = [], limit = 8, loading = false, updatingId = null, onStatusChange }) => {
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)

  return (
    <section className="admin-panel recent-orders" aria-labelledby="recent-orders-title">
      <header className="admin-panel-header">
        <div>
          <p className="eyebrow">最近 · ACTIVIDAD</p>
          <h2 id="recent-orders-title">Órdenes recientes</h2>
        </div>
      </header>

      {loading && <div className="skeleton skeleton-list" />}
      {!loading && recent.length === 0 && <p className="admin-empty">Todavía no se registraron órdenes.</p>}

      {!loading && recent.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th className="num">Unidades</th>
                <th className="num">Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => {
                const status = orderStatusName(order)
                const nextStatuses = ORDER_TRANSITIONS[status] ?? []
                const isUpdating = updatingId === order.id
                return (
                  <tr key={order.id}>
                    <td className="mono">#{String(order.id).padStart(5, '0')}</td>
                    <td>{order.userName || `Usuario ${order.userId ?? ''}`}</td>
                    <td className="mono muted">{formatDateTime(order.createdAt)}</td>
                    <td className="num">{order.totalUnits ?? '—'}</td>
                    <td className="num">{formatMoney(order.total)}</td>
                    <td>
                      {nextStatuses.length === 0 || !onStatusChange ? (
                        <span className={`order-pill order-pill-${status.toLowerCase()}`}>{statusLabels[status] ?? status}</span>
                      ) : (
                        <label className="order-status-select">
                          <span className="sr-only">Cambiar estado de la orden {order.id}</span>
                          <select
                            value={status}
                            disabled={isUpdating}
                            onChange={(event) => onStatusChange(order, event.target.value)}
                          >
                            <option value={status}>{statusLabels[status] ?? status}</option>
                            {nextStatuses.map((next) => (
                              <option key={next} value={next}>→ {statusLabels[next]}</option>
                            ))}
                          </select>
                        </label>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default RecentOrdersTable
