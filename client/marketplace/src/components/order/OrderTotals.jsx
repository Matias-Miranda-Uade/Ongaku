const OrderTotals = ({ order }) => {
    const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <>
        <p>Productos: {order.items.length}</p>
        <p>Unidades: {totalUnits}</p>
        <p><strong>Total: ${order.total.toLocaleString('es-AR')}</strong></p>
        </>
    )
}

export default OrderTotals
