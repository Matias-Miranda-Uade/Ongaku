import { useContext, useEffect, useState } from 'react';
import { getVinylPrice } from './vinylUtils';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
const AddToCartButton = ({
  vinyl,
  compact = false
}) => {
  const {
    addItem
  } = useContext(CartContext);
  const {
    isAdmin
  } = useContext(AuthContext);
  const [added, setAdded] = useState(0);
  const [pending, setPending] = useState(false);
  const outOfStock = !vinyl || vinyl.stock <= 0;
  const disabled = outOfStock || pending;
  useEffect(() => {
    if (added === 0) return;
    const timer = window.setTimeout(() => setAdded(0), 1200);
    return () => window.clearTimeout(timer);
  }, [added]);
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
    setPending(true);
    return addItem(product).then(_result => {
      if (_result) {
        setAdded(count => count + 1);
      }
    }).finally(() => {
      setPending(false);
    });
  };
  return <button className={`cart-button ${compact ? 'compact' : ''}`} type="button" disabled={disabled} onClick={handleClick}>
      {outOfStock ? 'SIN STOCK' : pending ? 'AGREGANDO…' : added ? 'AGREGADO ✓' : 'AGREGAR AL CARRITO'}
    </button>;
};
export default AddToCartButton;
