import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../Redux/slices/cartSlice';

const ClearCartButton = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleClear = () => {
    if (pending || disabled) return;
    setPending(true);
    setError('');
    dispatch(clearCart()).then(result => {
      if (result.error) setError(result.error.message);
      setPending(false);
    });
  };

  return (
    <>
      <button className="text-link-button" type="button" disabled={disabled || pending} onClick={handleClear}>
        Vaciar la bolsa
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
};

export default ClearCartButton;
