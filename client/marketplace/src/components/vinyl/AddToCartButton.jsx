import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVinylPrice } from './vinylUtils';
import { selectAuth } from '../../Redux/slices/authSlice';
import { addItem } from '../../Redux/slices/cartSlice';
const AddToCartButton = ({
  vinyl,
  compact = false
}) => {
  const {
    isAdmin
  } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const syncing = useSelector(state => state.cart.loading);
  const [pending, setPending] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const outOfStock = !vinyl || vinyl.stock <= 0;
  const disabled = outOfStock || pending || syncing;
  useEffect(() => {
    if (!added) return undefined;
    const timer = window.setTimeout(() => setAdded(false), 1200);
    return () => window.clearTimeout(timer);
  }, [added]);
  if (isAdmin) return null;
  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    const product = {
      ...vinyl,
      artist: vinyl.artist || vinyl.artistName || `Artista #${vinyl.artistId != null ? vinyl.artistId : '—'}`,
      price: getVinylPrice(vinyl)
    };
    setPending(true);
    setError('');
    dispatch(addItem({ product })).then(result => {
      if (result.error) {
        setError(result.error.message);
      } else {
        setAdded(true);
      }
      setPending(false);
    });
  };
  return <>
    <button className={`cart-button ${compact ? 'compact' : ''}`} type="button" disabled={disabled} onClick={handleClick}>
      {outOfStock ? 'SIN STOCK' : pending ? 'AGREGANDO…' : added ? 'AGREGADO ✓' : 'AGREGAR AL CARRITO'}
    </button>
    {error && <span role="alert">{error}</span>}
  </>;
};
export default AddToCartButton;
