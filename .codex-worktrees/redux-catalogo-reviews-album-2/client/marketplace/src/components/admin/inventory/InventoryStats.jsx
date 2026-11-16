
import { formatMoney, formatNumber, getStockStatus } from '../adminUtils'

const InventoryStats = ({ vinyls = [] }) => {
  const stats = vinyls.reduce((acc, vinyl) => {
    const stock = Number(vinyl.stock) || 0
    const status = getStockStatus(stock)
    acc.units += stock
    acc.value += stock * (Number(vinyl.finalPrice ?? vinyl.price) || 0)
    if (status === 'out') acc.out += 1
    if (status === 'low') acc.low += 1
    if (!vinyl.enabled) acc.hidden += 1
    return acc
  }, { units: 0, value: 0, out: 0, low: 0, hidden: 0 })

  const items = [
    { label: 'Títulos', value: formatNumber(vinyls.length) },
    { label: 'Unidades', value: formatNumber(stats.units) },
    { label: 'Valor del stock', value: formatMoney(stats.value) },
    { label: 'Stock bajo', value: formatNumber(stats.low), tone: stats.low ? 'warning' : '' },
    { label: 'Sin stock', value: formatNumber(stats.out), tone: stats.out ? 'critical' : '' },
    { label: 'Ocultos', value: formatNumber(stats.hidden) },
  ]

  return (
    <dl className="inventory-stats">
      {items.map((item) => (
        <div key={item.label} className={item.tone ? `is-${item.tone}` : undefined}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default InventoryStats
