import { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { createOrder } from '../../Redux/slices/ordersSlice';

const CheckoutButton = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = () => {
    if (pending || disabled || isAdmin) return;
    if (!user) {
      navigate('/app/login', { state: { returnTo: '/app/cart' } });
      return;
    }
    setPending(true);
    setError('');
    dispatch(createOrder()).then(result => {
      if (result.error) {
        setError(result.error.message);
        setPending(false);
        return;
      }
      navigate(`/app/orders/${result.payload.id}`);
      setPending(false);
    });
  };

  return (
    <>
      <button className="primary-button" type="button" disabled={disabled || pending} onClick={handleCheckout}>
        {pending ? 'Creando orden…' : 'Crear orden'} <span aria-hidden="true">→</span>
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
};

export default CheckoutButton;
