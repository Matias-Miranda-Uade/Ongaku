import { useState } from 'react'
import { REVENUE_STATUSES, formatCompactMoney, formatDay, formatMoney, orderStatusName } from '../adminUtils'

const RANGES = [
  { days: 7, label: '7 días' },
  { days: 14, label: '14 días' },
  { days: 30, label: '30 días' },
]

const WIDTH = 720
const HEIGHT = 240
const PAD = { top: 16, right: 12, bottom: 28, left: 56 }

const startOfDay = (date) => {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

const dayKey = (date) => startOfDay(date).toISOString().slice(0, 10)

const buildSeries = (orders, days) => {
  const today = startOfDay(new Date())
  const buckets = Array.from({ length: days }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (days - 1 - index))
    return { key: dayKey(date), date, revenue: 0, orders: 0 }
  })
  const byKey = Object.fromEntries(buckets.map((bucket) => [bucket.key, bucket]))

  orders.forEach((order) => {
    if (!REVENUE_STATUSES.includes(orderStatusName(order)) || !order.createdAt) return
    const bucket = byKey[dayKey(new Date(order.createdAt))]
    if (!bucket) return
    bucket.revenue += Number(order.total) || 0
    bucket.orders += 1
  })
  return buckets
}

const niceMax = (value) => {
  if (value <= 0) return 1
  const exponent = 10 ** Math.floor(Math.log10(value))
  const fraction = value / exponent
  const nice = [1, 2, 2.5, 5, 10].find((step) => fraction <= step) ?? 10
  return nice * exponent
}

const RevenueChart = ({ orders = [], loading = false }) => {
  const [days, setDays] = useState(14)
  const [hovered, setHovered] = useState(null)
  const [showTable, setShowTable] = useState(false)

  const series = buildSeries(orders, days)
  const total = series.reduce((sum, bucket) => sum + bucket.revenue, 0)
  const max = niceMax(Math.max(...series.map((bucket) => bucket.revenue)))
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ratio * max)

  const plotWidth = WIDTH - PAD.left - PAD.right
  const plotHeight = HEIGHT - PAD.top - PAD.bottom
  const slot = plotWidth / series.length
  const barWidth = Math.max(4, Math.min(28, slot - 2))
  const y = (value) => PAD.top + plotHeight - (value / max) * plotHeight
  const labelEvery = days > 14 ? 5 : days > 7 ? 2 : 1
  const hoveredBucket = hovered !== null ? series[hovered] : null

  return (
    <section className="admin-panel revenue-chart" aria-labelledby="revenue-title">
      <header className="admin-panel-header">
        <div>
          <p className="eyebrow">売上 · FACTURACIÓN</p>
          <h2 id="revenue-title">Ingresos por día</h2>
          <p className="admin-panel-sub">
            {formatMoney(total)} en los últimos {days} días · órdenes pagadas, enviadas o entregadas
          </p>
        </div>
        <div className="segmented" role="group" aria-label="Rango de fechas">
          {RANGES.map((range) => (
            <button
              key={range.days}
              type="button"
              className={range.days === days ? 'is-active' : ''}
              aria-pressed={range.days === days}
              onClick={() => { setDays(range.days); setHovered(null) }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="skeleton skeleton-chart" />
      ) : (
        <div className="chart-frame">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Ingresos diarios de los últimos ${days} días, total ${formatMoney(total)}`} onMouseLeave={() => setHovered(null)}>
            {ticks.map((tick) => (
              <g key={tick} className="chart-grid">
                <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(tick)} y2={y(tick)} />
                <text x={PAD.left - 10} y={y(tick)} dy="0.32em" textAnchor="end">{formatCompactMoney(tick)}</text>
              </g>
            ))}

            {series.map((bucket, index) => {
              const x = PAD.left + slot * index + (slot - barWidth) / 2
              const barHeight = Math.max(0, (bucket.revenue / max) * plotHeight)
              const top = PAD.top + plotHeight - barHeight
              const radius = Math.min(4, barWidth / 2, barHeight)
              const path = barHeight > 0
                ? `M${x},${PAD.top + plotHeight} V${top + radius} Q${x},${top} ${x + radius},${top} H${x + barWidth - radius} Q${x + barWidth},${top} ${x + barWidth},${top + radius} V${PAD.top + plotHeight} Z`
                : null
              return (
                <g key={bucket.key}>
                  {path && <path d={path} className={`chart-bar${hovered === index ? ' is-hovered' : ''}`} />}
                  {index % labelEvery === 0 && (
                    <text className="chart-axis-label" x={PAD.left + slot * index + slot / 2} y={HEIGHT - 8} textAnchor="middle">
                      {formatDay(bucket.date)}
                    </text>
                  )}
                  <rect
                    x={PAD.left + slot * index}
                    y={PAD.top}
                    width={slot}
                    height={plotHeight}
                    fill="transparent"
                    onMouseEnter={() => setHovered(index)}
                    onFocus={() => setHovered(index)}
                    tabIndex={0}
                    aria-label={`${formatDay(bucket.date)}: ${formatMoney(bucket.revenue)}, ${bucket.orders} órdenes`}
                  />
                </g>
              )
            })}
            <line className="chart-baseline" x1={PAD.left} x2={WIDTH - PAD.right} y1={PAD.top + plotHeight} y2={PAD.top + plotHeight} />
          </svg>

          {hoveredBucket && (
            <div
              className="chart-tooltip"
              style={{ left: `${((PAD.left + slot * hovered + slot / 2) / WIDTH) * 100}%` }}
              role="status"
            >
              <strong>{formatDay(hoveredBucket.date)}</strong>
              <span>{formatMoney(hoveredBucket.revenue)}</span>
              <span>{hoveredBucket.orders} {hoveredBucket.orders === 1 ? 'orden' : 'órdenes'}</span>
            </div>
          )}
        </div>
      )}

      <button type="button" className="link-button chart-table-toggle" onClick={() => setShowTable((value) => !value)} aria-expanded={showTable}>
        {showTable ? 'Ocultar tabla' : 'Ver como tabla'}
      </button>
      {showTable && (
        <div className="admin-table-wrap">
          <table className="admin-table compact">
            <thead><tr><th>Día</th><th className="num">Órdenes</th><th className="num">Ingresos</th></tr></thead>
            <tbody>
              {series.map((bucket) => (
                <tr key={bucket.key}>
                  <td>{formatDay(bucket.date)}</td>
                  <td className="num">{bucket.orders}</td>
                  <td className="num">{formatMoney(bucket.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default RevenueChart
