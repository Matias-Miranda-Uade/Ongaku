import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, payOrder } from '../../Redux/slices/ordersSlice';
import CardBook from '../profile/CardBook';

const DemoPaymentForm = ({ order, addressId, disabled = false }) => {
  const dispatch = useDispatch();
  const ordersLoading = useSelector(state => state.orders.loading);
  const [selectedCardId, setSelectedCardId] = useState(order.savedCardId ?? null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const blocked = disabled || ordersLoading || pending;

  const handlePay = () => {
    if (blocked || order.total <= 0 || selectedCardId == null) return;
    if (!addressId) {
      setError('Elegí una dirección de envío antes de pagar.');
      return;
    }
    setPending(true);
    setError('');
    setNotice('');
    dispatch(payOrder({ order, savedCardId: selectedCardId, addressId })).then(result => {
      if (result.error) {
        setError(`No se pudo pagar la orden: ${result.error.message}`);
        dispatch(fetchOrders());
      } else {
        setNotice('Pago registrado.');
      }
      setPending(false);
    });
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
        <button
          className="primary-button"
          type="button"
          disabled={blocked || order.total <= 0 || selectedCardId == null}
          onClick={handlePay}
        >
          {pending ? 'Procesando…' : 'Confirmar pago'}
        </button>
        {error && <p className="form-error" role="alert">{error}</p>}
        <p className="payment-caption">Entorno de prueba: no se realizan cargos reales.</p>
      </>}
    </section>
  );
};

export default DemoPaymentForm;
