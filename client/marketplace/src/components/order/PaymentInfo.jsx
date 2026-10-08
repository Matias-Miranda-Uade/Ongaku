const PaymentInfo = ({ payment }) => {
    return (
        <>
        <h2>Pago</h2>
        {payment
            ? <>
                <p>Medio: {payment.method}</p>
                <p>Importe: ${payment.amount.toLocaleString('es-AR')}</p>
                <p>Estado: {payment.status}</p>
              </>
            : <p>Pendiente de pago</p>
        }
        </>
    )
}

export default PaymentInfo
