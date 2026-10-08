const guarantees = [
    'Stock reservado al finalizar la compra',
    'Cancelación sin cargo mientras la orden esté pendiente',
    'Seguimiento del estado de tu orden',
]

const CartGuarantees = () => {
    return (
        <ul>
            {
                guarantees.map((guarantee) => (
                    <li key={guarantee}>{guarantee}</li>
                ))
            }
        </ul>
    )
}

export default CartGuarantees
