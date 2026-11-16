const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

const Price = ({ value, originalValue }) => (
  <div className="price-block">
    <strong>{money.format(value ?? 0)}</strong>
    {originalValue && originalValue > value && <del>{money.format(originalValue)}</del>}
  </div>
)
export default Price
