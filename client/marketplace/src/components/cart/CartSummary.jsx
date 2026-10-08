const CartSummary = ({ totalProducts, totalUnits, total, onCheckout }) => {
    return (
        <>
        <h2>Resumen</h2>
        <p>Productos: {totalProducts}</p>
        <p>Unidades: {totalUnits}</p>
        <p>Total: ${total.toLocaleString('es-AR')}</p>
        <button onClick={onCheckout}>Finalizar compra</button>
        </>
    )
}

export default CartSummary
