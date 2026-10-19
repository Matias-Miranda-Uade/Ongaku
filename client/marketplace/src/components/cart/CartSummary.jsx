const CartSummary = ({ totalProducts, totalUnits, total, onCheckout, disabled = false, pending = false }) => {
    return (
        <section className="cart-summary">
            <p className="eyebrow">ORDEN DE ARCHIVO</p>
            <h2>Resumen de colección</h2>
            <div><span>Piezas seleccionadas ({totalProducts})</span><strong>{totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'}</strong></div>
            <div><span>Tratamiento de embalaje</span><strong>Incluido</strong></div>
            <div><span>Envío</span><strong>A coordinar</strong></div>
            <div className="cart-summary-total"><span>Total de selección</span><strong>${total.toLocaleString('es-AR')}</strong></div>
            <button className="primary-button" disabled={disabled} onClick={onCheckout}>{pending ? 'Creando orden…' : 'Crear orden'} <span aria-hidden="true">→</span></button>
            <p className="cart-summary-note">La orden quedará pendiente y el carrito se vaciará. Después podrás elegir dirección y tarjeta en el detalle. El stock se reserva hasta que pagues o canceles la orden.</p>
        </section>
    )
}

export default CartSummary
