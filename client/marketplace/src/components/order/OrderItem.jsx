const OrderItem = ({ item }) => {
    return (
        <div>
            <h3>{item.name}</h3>
            <p>{item.artistName}</p>
            <p>${item.unitPrice.toLocaleString('es-AR')} x {item.quantity}</p>
            <p>Subtotal: ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}</p>
        </div>
    )
}

export default OrderItem
