import { useSelector } from 'react-redux';
import { selectAuth } from '../Redux/slices/authSlice';
import CartItemsList from '../components/cart/CartItemsList';
import CartSummary from '../components/cart/CartSummary';
import CartGuarantees from '../components/cart/CartGuarantees';
import SuggestedProducts from '../components/cart/SuggestedProducts';
import ClearCartButton from '../components/cart/ClearCartButton';

const CartPage = ({ onNavigate }) => {
  const { isAdmin } = useSelector(selectAuth);
  const items = useSelector(state => state.cart.items);
  const syncing = useSelector(state => state.cart.loading);
  const totalProducts = items.length;
  const totalUnits = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.subtotal ?? item.price * item.quantity), 0);

  if (isAdmin) {
    return (
      <section className="empty-state-card cart-admin-notice">
        <p className="eyebrow">CUENTA ADMINISTRADORA</p>
        <h2>Las compras son solo para clientes</h2>
        <p>Podés revisar el catálogo y administrar el inventario, pero las cuentas de administración no pueden agregar productos ni crear órdenes.</p>
        <button className="secondary-button" type="button" onClick={() => onNavigate?.('admin')}>Volver al panel</button>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="legacy-heading">
        <p className="eyebrow">BÓVEDA DE COLECCIÓN</p>
        <h1>Bolsa de selección</h1>
        <p className="legacy-description">{totalUnits} {totalUnits === 1 ? 'pieza' : 'piezas'} en tu bolsa.</p>
      </div>
      {items.length === 0 ? (
        <div className="empty-state-card">
          <h2>Tu bolsa está esperando una primera pieza.</h2>
          <p>Recorré el catálogo y sumá las ediciones que quieras escuchar en casa.</p>
          <button className="primary-button" onClick={() => onNavigate?.('catalog')}>Volver al catálogo</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-column">
            <CartItemsList items={items} disabled={syncing} />
            <ClearCartButton disabled={syncing} />
          </div>
          <aside className="cart-summary-panel">
            <CartSummary totalProducts={totalProducts} totalUnits={totalUnits} total={total} disabled={syncing} />
            <CartGuarantees />
          </aside>
        </div>
      )}
      <div className="cart-suggestions">
        <SuggestedProducts disabled={syncing} />
      </div>
    </section>
  );
};

export default CartPage;
