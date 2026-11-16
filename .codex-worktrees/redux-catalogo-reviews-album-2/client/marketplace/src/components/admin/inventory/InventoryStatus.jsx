import { STOCK_STATUS_LABELS, getStockStatus } from '../adminUtils'

const ICONS = { ok: '●', low: '▲', out: '■' }

const InventoryStatus = ({ stock, enabled, showVisibility = true }) => {
  const status = getStockStatus(stock)
  return (
    <div className="inventory-status">
      <span className={`stock-pill stock-${status}`}>
        <span aria-hidden="true">{ICONS[status]}</span> {STOCK_STATUS_LABELS[status]}
      </span>
      {showVisibility && (
        <span className={`visibility-pill ${enabled ? 'is-visible' : 'is-hidden'}`}>
          {enabled ? 'Publicado' : 'Oculto'}
        </span>
      )}
    </div>
  )
}

export default InventoryStatus
