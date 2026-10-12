import { FieldError, fieldA11y } from './VinylFormFields'
import { computeFinalPrice, formatMoney } from '../adminUtils'

const QUICK_DISCOUNTS = [0, 10, 15, 25]

const PriceInput = ({ price, discountPercentage, onChange, onBlur, errors = {} }) => {
  const validPrice = /^\d+$/.test(String(price)) && Number(price) > 0
  const discount = Number(discountPercentage) || 0
  const finalPrice = validPrice ? computeFinalPrice(price, discount) : null

  return (
    <div className="vf-price">
      <div className="vf-field">
        <label htmlFor="vf-price">Precio de lista <span className="vf-required" aria-hidden="true">*</span></label>
        <div className="vf-input-affix">
          <span aria-hidden="true">$</span>
          <input
            {...fieldA11y('price', errors.price, 'vf-price-hint')}
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            required
            value={price}
            placeholder="42000"
            onChange={(event) => onChange('price', event.target.value)}
            onBlur={() => onBlur('price')}
          />
        </div>
        <p className="vf-hint" id="vf-price-hint">Pesos argentinos, sin centavos.</p>
        <FieldError id="vf-price-error" message={errors.price} />
      </div>

      <div className="vf-field">
        <label htmlFor="vf-discountPercentage">Descuento</label>
        <div className="vf-input-affix vf-input-affix-end">
          <input
            {...fieldA11y('discountPercentage', errors.discountPercentage)}
            type="number"
            inputMode="numeric"
            min="0"
            max="100"
            step="1"
            value={discountPercentage}
            onChange={(event) => onChange('discountPercentage', event.target.value)}
            onBlur={() => onBlur('discountPercentage')}
          />
          <span aria-hidden="true">%</span>
        </div>
        <div className="vf-quick" role="group" aria-label="Descuentos rápidos">
          {QUICK_DISCOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              className={discount === value ? 'is-active' : ''}
              onClick={() => onChange('discountPercentage', String(value))}
            >
              {value}%
            </button>
          ))}
        </div>
        <FieldError id="vf-discountPercentage-error" message={errors.discountPercentage} />
      </div>

      <div className="vf-price-preview" aria-live="polite">
        <span className="vf-label">Precio en vitrina</span>
        {finalPrice === null ? (
          <strong className="muted">—</strong>
        ) : (
          <>
            <strong>{formatMoney(finalPrice)}</strong>
            {discount > 0 && discount <= 100 && (
              <span>
                <del>{formatMoney(price)}</del> · ahorro {formatMoney(Number(price) - finalPrice)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PriceInput
