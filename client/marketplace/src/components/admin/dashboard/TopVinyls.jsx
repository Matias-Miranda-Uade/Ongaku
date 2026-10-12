import { useMemo } from 'react'
import { REVENUE_STATUSES, formatMoney, orderStatusName } from '../adminUtils'

const rankVinyls = (orders, limit) => {
  const totals = new Map()
  orders
    .filter((order) => REVENUE_STATUSES.includes(orderStatusName(order)))
    .forEach((order) => {
      (order.items ?? []).forEach((item) => {
        const key = String(item.vinylId ?? item.name)
        const current = totals.get(key) ?? {
          id: key,
          name: item.name,
          artistName: item.artistName,
          image: item.image,
          units: 0,
          revenue: 0,
        }
        const quantity = Number(item.quantity) || 0
        current.units += quantity
        current.revenue += Number(item.subtotal) || (Number(item.finalPrice ?? item.unitPrice) || 0) * quantity
        totals.set(key, current)
      })
    })
  return [...totals.values()].sort((a, b) => b.units - a.units || b.revenue - a.revenue).slice(0, limit)
}

const TopVinyls = ({ orders = [], limit = 5, loading = false }) => {
  const ranking = useMemo(() => rankVinyls(orders, limit), [orders, limit])
  const maxUnits = ranking[0]?.units || 1

  return (
    <section className="admin-panel top-vinyls" aria-labelledby="top-vinyls-title">
      <header className="admin-panel-header">
        <div>
          <p className="eyebrow">人気 · MÁS VENDIDOS</p>
          <h2 id="top-vinyls-title">Top {limit} vinilos</h2>
        </div>
      </header>

      {loading && <div className="skeleton skeleton-list" />}
      {!loading && ranking.length === 0 && <p className="admin-empty">Todavía no hay ventas concretadas.</p>}

      {!loading && ranking.length > 0 && (
        <ol className="top-vinyls-list">
          {ranking.map((vinyl, index) => (
            <li key={vinyl.id}>
              <span className="top-rank">{String(index + 1).padStart(2, '0')}</span>
              <div className="top-info">
                <p className="top-name">{vinyl.name}</p>
                <p className="top-artist">{vinyl.artistName || '—'}</p>
                <div className="top-bar" aria-hidden="true">
                  <span style={{ width: `${(vinyl.units / maxUnits) * 100}%` }} />
                </div>
              </div>
              <div className="top-numbers">
                <strong>{vinyl.units} u.</strong>
                <span>{formatMoney(vinyl.revenue)}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default TopVinyls
