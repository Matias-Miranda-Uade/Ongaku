import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { payOrder } from '../../Redux/slices/ordersSlice';
import CardBook from '../profile/CardBook';

const isValidCardNumber = value => {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
};

const validateCard = ({ holder, number, expiry, securityCode }) => {
  const errors = {};
  if (holder.trim().length < 2) errors.holder = 'Ingresá el nombre que figura en la tarjeta.';
  if (!isValidCardNumber(number)) errors.number = 'Ingresá un número de tarjeta válido.';
  const expiryMatch = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!expiryMatch) {
    errors.expiry = 'Usá el formato MM/AA.';
  } else {
    const month = Number(expiryMatch[1]);
    const year = 2000 + Number(expiryMatch[2]);
    const now = new Date();
    if (year < now.getFullYear() || year === now.getFullYear() && month < now.getMonth() + 1) {
      errors.expiry = 'La tarjeta no puede estar vencida.';
    }
  }
  if (!/^\d{3,4}$/.test(securityCode)) errors.securityCode = 'Ingresá un código de 3 o 4 dígitos.';
  return errors;
};

const initialCard = { holder: '', number: '', expiry: '', securityCode: '' };

const DemoPaymentForm = ({ order, addressId, disabled = false }) => {
  const dispatch = useDispatch();
  const ordersLoading = useSelector(state => state.orders.loading);
  const [selectedCardId, setSelectedCardId] = useState(order.savedCardId ?? null);
  const [card, setCard] = useState(initialCard);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const blocked = disabled || ordersLoading || pending;

  const handlePay = savedCardId => {
    if (blocked || order.total <= 0) return;
    if (!addressId) {
      setError('Elegí una dirección de envío antes de pagar.');
      return;
    }
    setPending(true);
    setError('');
    setNotice('');
    dispatch(payOrder({ order, savedCardId, addressId })).then(result => {
      if (result.error) {
        setError(`No se pudo pagar la orden: ${result.error.message}`);
      } else {
        setNotice('Pago registrado.');
      }
      setPending(false);
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (blocked || selectedCardId != null || order.total <= 0) return;
    const nextErrors = validateCard(card);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    handlePay(undefined);
  };

  const updateCard = (field, value) => {
    setCard(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  if (order.status !== 'PENDIENTE' && !notice) return null;

  return (
    <section>
      {notice ? <p role="status">{notice}</p> : <>
        <CardBook
          selectable
          selectedId={selectedCardId}
          preferredId={order.savedCardId}
          onSelect={setSelectedCardId}
          disabled={blocked}
        />
        {selectedCardId != null ? (
          <button
            className="primary-button"
            type="button"
            disabled={blocked || order.total <= 0}
            onClick={() => handlePay(selectedCardId)}
          >
            {pending ? 'Procesando…' : 'Confirmar pago'}
          </button>
        ) : (
          <form className="demo-payment-form" onSubmit={handleSubmit} autoComplete="off">
            <label>
              Nombre del titular
              <input type="text" name="demo-card-holder" autoComplete="off" value={card.holder} onChange={event => updateCard('holder', event.target.value)} aria-invalid={Boolean(errors.holder)} aria-describedby={errors.holder ? 'demo-card-holder-error' : undefined} disabled={blocked} />
              {errors.holder && <span className="demo-payment-error" id="demo-card-holder-error">{errors.holder}</span>}
            </label>
            <label>
              Número de tarjeta
              <input type="text" name="demo-card-number" inputMode="numeric" autoComplete="off" maxLength={23} value={card.number} onChange={event => updateCard('number', event.target.value.replace(/[^\d ]/g, ''))} aria-invalid={Boolean(errors.number)} aria-describedby={errors.number ? 'demo-card-number-error' : undefined} disabled={blocked} />
              {errors.number && <span className="demo-payment-error" id="demo-card-number-error">{errors.number}</span>}
            </label>
            <div className="demo-payment-row">
              <label>
                Vencimiento
                <input type="text" name="demo-card-expiry" inputMode="numeric" autoComplete="off" placeholder="MM/AA" maxLength={5} value={card.expiry} onChange={event => updateCard('expiry', event.target.value.replace(/[^\d/]/g, ''))} aria-invalid={Boolean(errors.expiry)} aria-describedby={errors.expiry ? 'demo-card-expiry-error' : undefined} disabled={blocked} />
                {errors.expiry && <span className="demo-payment-error" id="demo-card-expiry-error">{errors.expiry}</span>}
              </label>
              <label>
                Código de seguridad
                <input type="password" name="demo-card-security-code" inputMode="numeric" autoComplete="off" maxLength={4} value={card.securityCode} onChange={event => updateCard('securityCode', event.target.value.replace(/\D/g, ''))} aria-invalid={Boolean(errors.securityCode)} aria-describedby={errors.securityCode ? 'demo-card-security-error' : undefined} disabled={blocked} />
                {errors.securityCode && <span className="demo-payment-error" id="demo-card-security-error">{errors.securityCode}</span>}
              </label>
            </div>
            <button className="primary-button" type="submit" disabled={blocked || order.total <= 0}>
              {pending ? 'Procesando…' : 'Confirmar pago'}
            </button>
          </form>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <p className="payment-caption">Entorno de prueba: no se realizan cargos reales.</p>
      </>}
    </section>
  );
};

export default DemoPaymentForm;
