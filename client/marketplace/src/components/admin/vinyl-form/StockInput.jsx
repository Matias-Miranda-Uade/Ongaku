import { FieldError, fieldA11y } from './VinylFormFields'
import { LOW_STOCK_THRESHOLD, STOCK_STATUS_LABELS, getStockStatus } from '../adminUtils'
import { MAX_STOCK } from './vinylFormModel'

const QUICK_ADD = [1, 5, 10]

const StockInput = ({ value, onChange, onBlur, error, initialStock = null }) => {
  const numeric = /^\d+$/.test(String(value)) ? Number(value) : null
  const set = (next) => onChange('stock', String(Math.min(MAX_STOCK, Math.max(0, next))))
  const status = numeric === null ? null : getStockStatus(numeric)
  const diff = numeric !== null && initialStock !== null ? numeric - Number(initialStock) : 0

  return (
    <div className="vf-field vf-stock">
      <label htmlFor="vf-stock">Unidades disponibles <span className="vf-required" aria-hidden="true">*</span></label>
      <div className="vf-stepper">
        <button type="button" onClick={() => set((numeric ?? 0) - 1)} disabled={!numeric} aria-label="Restar una unidad">−</button>
        <input
          {...fieldA11y('stock', error, 'vf-stock-hint')}
          type="number"
          inputMode="numeric"
          min="0"
          max={MAX_STOCK}
          step="1"
          required
          value={value}
          onChange={(event) => onChange('stock', event.target.value)}
          onBlur={() => onBlur('stock')}
        />
        <button type="button" onClick={() => set((numeric ?? 0) + 1)} aria-label="Sumar una unidad">+</button>
      </div>
      <div className="vf-quick" role="group" aria-label="Reposición rápida">
        {QUICK_ADD.map((amount) => (
          <button key={amount} type="button" onClick={() => set((numeric ?? 0) + amount)}>+{amount}</button>
        ))}
      </div>
      <p className="vf-hint" id="vf-stock-hint">
        {status && <span className={`stock-pill stock-${status}`}>{STOCK_STATUS_LABELS[status]}</span>}
        {' '}Se considera stock bajo con {LOW_STOCK_THRESHOLD} unidades o menos.
        {diff !== 0 && <strong className="vf-diff"> {diff > 0 ? `+${diff}` : diff} respecto del stock guardado.</strong>}
      </p>
      <FieldError id="vf-stock-error" message={error} />
    </div>
  )
}

export default StockInput
