import { useState } from 'react'

const isValidCardNumber = (value) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let doubleDigit = false
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (doubleDigit) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    doubleDigit = !doubleDigit
  }
  return sum % 10 === 0
}

const validateCard = ({ holder, number, expiry, securityCode }) => {
  const errors = {}
  if (holder.trim().length < 2) errors.holder = 'Ingresá el nombre que figura en la tarjeta.'
  if (!isValidCardNumber(number)) errors.number = 'Ingresá un número de tarjeta de prueba válido.'
  const expiryMatch = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/)
  if (!expiryMatch) {
    errors.expiry = 'Usá el formato MM/AA.'
  } else {
    const month = Number(expiryMatch[1])
    const year = 2000 + Number(expiryMatch[2])
    const now = new Date()
    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
      errors.expiry = 'La tarjeta de prueba no puede estar vencida.'
    }
  }
  if (!/^\d{3,4}$/.test(securityCode)) errors.securityCode = 'Ingresá un código de 3 o 4 dígitos.'
  return errors
}

const initialCard = { holder: '', number: '', expiry: '', securityCode: '' }

const DemoPaymentForm = ({ order, onPay, paying, disabled }) => {
  const [card, setCard] = useState(initialCard)
  const [errors, setErrors] = useState({})

  const updateField = (field, value) => {
    setCard((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateCard(card)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setCard(initialCard)
    await onPay(order)
  }

  return (
    <form className="demo-payment-form" onSubmit={handleSubmit} autoComplete="off">
      <p className="demo-payment-notice">
        Simulación únicamente: usá datos ficticios, no una tarjeta real. Ejemplo de número: 4242 4242 4242 4242. Los datos se validan en este navegador y nunca se envían ni se guardan.
      </p>
      <label>
        Nombre del titular
        <input
          type="text"
          name="demo-card-holder"
          autoComplete="off"
          value={card.holder}
          onChange={(event) => updateField('holder', event.target.value)}
          aria-invalid={Boolean(errors.holder)}
          aria-describedby={errors.holder ? 'demo-card-holder-error' : undefined}
          disabled={paying || disabled}
        />
        {errors.holder && <span className="demo-payment-error" id="demo-card-holder-error">{errors.holder}</span>}
      </label>
      <label>
        Número de tarjeta de prueba
        <input
          type="text"
          name="demo-card-number"
          inputMode="numeric"
          autoComplete="off"
          maxLength={23}
          value={card.number}
          onChange={(event) => updateField('number', event.target.value.replace(/[^\d ]/g, ''))}
          aria-invalid={Boolean(errors.number)}
          aria-describedby={errors.number ? 'demo-card-number-error' : undefined}
          disabled={paying || disabled}
        />
        {errors.number && <span className="demo-payment-error" id="demo-card-number-error">{errors.number}</span>}
      </label>
      <div className="demo-payment-row">
        <label>
          Vencimiento
          <input
            type="text"
            name="demo-card-expiry"
            inputMode="numeric"
            autoComplete="off"
            placeholder="MM/AA"
            maxLength={5}
            value={card.expiry}
            onChange={(event) => updateField('expiry', event.target.value.replace(/[^\d/]/g, ''))}
            aria-invalid={Boolean(errors.expiry)}
            aria-describedby={errors.expiry ? 'demo-card-expiry-error' : undefined}
            disabled={paying || disabled}
          />
          {errors.expiry && <span className="demo-payment-error" id="demo-card-expiry-error">{errors.expiry}</span>}
        </label>
        <label>
          Código de seguridad
          <input
            type="password"
            name="demo-card-security-code"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            value={card.securityCode}
            onChange={(event) => updateField('securityCode', event.target.value.replace(/\D/g, ''))}
            aria-invalid={Boolean(errors.securityCode)}
            aria-describedby={errors.securityCode ? 'demo-card-security-error' : undefined}
            disabled={paying || disabled}
          />
          {errors.securityCode && <span className="demo-payment-error" id="demo-card-security-error">{errors.securityCode}</span>}
        </label>
      </div>
      <button className="primary-button" type="submit" disabled={paying || disabled || order.total <= 0}>
        {paying ? 'Simulando pago…' : 'Simular pago'}
      </button>
    </form>
  )
}

export default DemoPaymentForm
