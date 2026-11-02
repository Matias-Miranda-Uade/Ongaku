import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVinylPrice } from './vinylUtils';
import { AuthContext } from '../../context/AuthContext';
import { addItem } from '../../Redux/actions/cartActions';
import { clearLastAdded as clearLastAddedAction } from '../../Redux/slices/cartSlice';
const AddToCartButton = ({
  vinyl,
  compact = false
}) => {
  const {
    isAdmin
  } = useContext(AuthContext);
  const dispatch = useDispatch();
  const pending = useSelector(state => state.cart.pendingIds.some(id => String(id) === String(vinyl?.id)));
  const syncing = useSelector(state => state.cart.status === 'loading');
  const added = useSelector(state => String(state.cart.lastAddedId) === String(vinyl?.id) && state.cart.lastAddedId !== null);
  const outOfStock = !vinyl || vinyl.stock <= 0;
  const disabled = outOfStock || pending || syncing;
  useEffect(() => {
    if (!added) return undefined;
    const timer = window.setTimeout(() => dispatch(clearLastAddedAction()), 1200);
    return () => window.clearTimeout(timer);
  }, [added, dispatch]);
  if (isAdmin) return null;
  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return Promise.resolve();
    const product = {
      ...vinyl,
      artist: vinyl.artist || vinyl.artistName || `Artista #${vinyl.artistId != null ? vinyl.artistId : '—'}`,
      price: getVinylPrice(vinyl)
    };
    return dispatch(addItem({ product })).then(result => addItem.fulfilled.match(result));
  };
  return <button className={`cart-button ${compact ? 'compact' : ''}`} type="button" disabled={disabled} onClick={handleClick}>
      {outOfStock ? 'SIN STOCK' : pending ? 'AGREGANDO…' : added ? 'AGREGADO ✓' : 'AGREGAR AL CARRITO'}
    </button>;
};
export default AddToCartButton;
