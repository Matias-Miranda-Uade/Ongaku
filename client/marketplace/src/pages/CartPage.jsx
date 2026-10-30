import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { addItem, clearCart, fetchSuggestions, removeItem, updateQuantity } from '../Redux/actions/cartActions';
import { selectCartItems, selectCartTotal, selectIsInCart, selectTotalProducts, selectTotalUnits } from '../Redux/slices/cartSlice';
import { clearCheckoutError, selectCheckoutError, selectPendingAction, setCheckoutError } from '../Redux/slices/ordersSlice';
import CartItemsList from "../components/cart/CartItemsList";
import CartSummary from "../components/cart/CartSummary";
import CartGuarantees from "../components/cart/CartGuarantees";
import SuggestedProducts from "../components/cart/SuggestedProducts";
const CartPage = ({
  onCheckout,
  onNavigate
}) => {
  const {
    isAdmin
  } = useContext(AuthContext);
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalProducts = useSelector(selectTotalProducts);
  const totalUnits = useSelector(selectTotalUnits);
  const total = useSelector(selectCartTotal);
  const products = useSelector(state => state.cart.suggestions.items);
  const suggestionError = useSelector(state => state.cart.suggestions.error);
  const syncing = useSelector(state => state.cart.status === 'loading');
  const checkoutError = useSelector(selectCheckoutError);
  const pending = useSelector(selectPendingAction) === 'creating';
  useEffect(() => {
    if (isAdmin) return undefined;
    dispatch(fetchSuggestions());
  }, [dispatch, isAdmin]);
  const handleCheckout = () => {
    if (pending || syncing) return Promise.resolve();
    dispatch(clearCheckoutError());
    return Promise.resolve(onCheckout?.()).then(result => {
      if (result?.error) dispatch(setCheckoutError(result.error));
    });
  };
  const suggested = useSelector(state => products.filter(product => !selectIsInCart(product.id)(state)).slice(0, 3));
  const handleAdd = product => syncing ? undefined : dispatch(addItem({ product }));
  if (isAdmin) {
    return <section className="empty-state-card cart-admin-notice">
                <p className="eyebrow">CUENTA ADMINISTRADORA</p>
                <h2>Las compras son solo para clientes</h2>
                <p>Podés revisar el catálogo y administrar el inventario, pero las cuentas de administración no pueden agregar productos ni crear órdenes.</p>
                <button className="secondary-button" type="button" onClick={() => onNavigate?.('admin')}>Volver al panel</button>
            </section>;
  }
  return <section className="cart-page">
        <div className="legacy-heading">
            <p className="eyebrow">BÓVEDA DE COLECCIÓN</p>
            <h1>Bolsa de selección</h1>
            <p className="legacy-description">{totalUnits} {totalUnits === 1 ? 'pieza' : 'piezas'} en tu bolsa.</p>
        </div>
        {checkoutError && <p role="alert">{checkoutError}</p>}
        {items.length === 0 ? <div className="empty-state-card">
                <h2>Tu bolsa está esperando una primera pieza.</h2>
                <p>Recorré el catálogo y sumá las ediciones que quieras escuchar en casa.</p>
                <button className="primary-button" onClick={() => onNavigate?.('catalog')}>Volver al catálogo</button>
              </div> : <div className="cart-layout">
                <div className="cart-items-column">
                    <CartItemsList items={items} onQuantityChange={(id, quantity) => dispatch(updateQuantity({ id, quantity }))} onRemove={id => dispatch(removeItem(id))} disabled={syncing} />
                    <button className="text-link-button" disabled={syncing} onClick={() => dispatch(clearCart())}>Vaciar la bolsa</button>
                </div>
                <aside className="cart-summary-panel">
                    <CartSummary totalProducts={totalProducts} totalUnits={totalUnits} total={total} onCheckout={handleCheckout} disabled={pending || syncing} pending={pending} />
                    <CartGuarantees />
                </aside>
              </div>}
        <div className="cart-suggestions">
            {suggestionError && <p role="alert">No se pudieron cargar las sugerencias: {suggestionError}</p>}
            <SuggestedProducts products={suggested} onAdd={handleAdd} disabled={syncing} />
        </div>
        </section>;
};
export default CartPage;
