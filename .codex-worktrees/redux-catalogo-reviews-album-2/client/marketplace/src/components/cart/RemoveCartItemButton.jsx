import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeItem } from '../../Redux/slices/cartSlice';

const RemoveCartItemButton = ({ id, disabled = false }) => {
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleRemove = () => {
    if (pending || disabled) return;
    setPending(true);
    setError('');
    dispatch(removeItem(id)).then(result => {
      if (result.error) setError(result.error.message);
      setPending(false);
    });
  };

  return (
    <>
      <button className="text-link-button" type="button" disabled={disabled || pending} onClick={handleRemove}>
        Retirar de la bolsa
      </button>
      {error && <span role="alert">{error}</span>}
    </>
  );
};

export default RemoveCartItemButton;
