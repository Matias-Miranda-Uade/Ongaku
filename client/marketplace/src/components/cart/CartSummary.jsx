const CartSummary = ({ totalProducts, totalUnits, total, onCheckout, disabled = false, pending = false }) => {
    return (
        <section className="cart-summary">
            <p className="eyebrow">ORDEN DE ARCHIVO</p>
            <h2>Resumen de colección</h2>
            <div><span>Piezas seleccionadas ({totalProducts})</span><strong>{totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'}</strong></div>
            <div><span>Tratamiento de embalaje</span><strong>Incluido</strong></div>
            <div><span>Envío</span><strong>A coordinar</strong></div>
            <div className="cart-summary-total"><span>Total de selección</span><strong>${total.toLocaleString('es-AR')}</strong></div>
            <button className="primary-button" disabled={disabled} onClick={onCheckout}>{pending ? 'Creando orden…' : 'Proceder al checkout'} <span aria-hidden="true">→</span></button>
            <p className="cart-summary-note">En el checkout vas a elegir la dirección de envío y la tarjeta para completar el pago simulado.</p>
        </section>
    )
}

export default CartSummary
