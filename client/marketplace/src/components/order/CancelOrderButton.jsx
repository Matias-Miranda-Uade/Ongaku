import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { cancelOrder } from '../../Redux/slices/ordersSlice';

const CancelOrderButton = ({ orderId, disabled = false }) => {
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = () => {
    if (pending || disabled) return;
    if (!window.confirm('¿Querés cancelar esta orden? El stock reservado volverá al catálogo.')) return;
    setPending(true);
    setError('');
    dispatch(cancelOrder(orderId)).then(result => {
      if (result.error) setError(result.error.message);
      setPending(false);
    });
  };

  return (
    <>
      <button className="order-cancel-button" type="button" disabled={disabled || pending} onClick={handleCancel}>
        {pending ? 'Cancelando…' : 'Cancelar orden'}
      </button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </>
  );
};

export default CancelOrderButton;
