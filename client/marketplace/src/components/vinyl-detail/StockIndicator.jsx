import StatusBadge from '../ui/StatusBadge'

const StockIndicator = ({ stock = 0 }) => (
  <div className="stock-row">
    <StatusBadge available={stock > 0} />
    <span>{stock > 0 ? `${stock} unidades disponibles` : 'Temporalmente agotado'}</span>
  </div>
)
export default StockIndicator
