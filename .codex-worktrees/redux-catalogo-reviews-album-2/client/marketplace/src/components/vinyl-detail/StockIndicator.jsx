import StatusBadge from '../ui/StatusBadge'

const StockIndicator = ({ stock = 0 }) => (
  <div className="stock-row">
    <StatusBadge available={stock > 0} />
    <span>{stock > 0 ? `${stock} ${Number(stock) === 1 ? 'unidad disponible' : 'unidades disponibles'}` : '0 unidades disponibles'}</span>
  </div>
)
export default StockIndicator
