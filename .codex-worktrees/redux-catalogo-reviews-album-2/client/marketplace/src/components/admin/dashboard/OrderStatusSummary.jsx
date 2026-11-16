import { statusLabels } from '../../../data/orderStatuses'
import { formatNumber } from '../adminUtils'

const ROWS = [
  { key: 'pendingOrders', status: 'PENDIENTE' },
  { key: 'paidOrders', status: 'PAGADA' },
  { key: 'shippedOrders', status: 'ENVIADA' },
  { key: 'deliveredOrders', status: 'ENTREGADA' },
  { key: 'cancelledOrders', status: 'CANCELADA' },
]

const OrderStatusSummary = ({ summary, loading = false }) => {
  const total = summary?.totalOrders || ROWS.reduce((sum, row) => sum + (summary?.[row.key] ?? 0), 0)

  return (
    <section className="admin-panel order-status-summary" aria-labelledby="status-summary-title">
      <header className="admin-panel-header">
        <div>
          <p className="eyebrow">注文 · ESTADOS</p>
          <h2 id="status-summary-title">Órdenes por estado</h2>
        </div>
        <p className="admin-panel-total">{formatNumber(total)} <span>en total</span></p>
      </header>

      {loading ? (
        <div className="skeleton skeleton-list" />
      ) : (
        <ul className="status-rows">
          {ROWS.map((row) => {
            const count = summary?.[row.key] ?? 0
            const share = total ? Math.round((count / total) * 100) : 0
            return (
              <li key={row.key} className={`status-row status-${row.status.toLowerCase()}`}>
                <span className="status-row-label">{statusLabels[row.status]}</span>
                <span className="status-row-bar" aria-hidden="true"><span style={{ width: `${share}%` }} /></span>
                <span className="status-row-count">{formatNumber(count)}</span>
                <span className="status-row-share">{share}%</span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default OrderStatusSummary
