const guarantees = [
    'Las órdenes de prueba quedan asociadas a tu perfil',
    'No se procesa ningún pago en esta demostración',
    'Podés revisar tus órdenes desde tu cuenta',
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
