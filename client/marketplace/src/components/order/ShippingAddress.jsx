const ShippingAddress = ({ address }) => {
    return (
        <>
        <h2>Dirección de envío</h2>
        {address
            ? <>
                <p>{address.street}</p>
                <p>{address.city}, {address.province} ({address.zipCode})</p>
              </>
            : <p>Se coordinará antes de confirmar el envío.</p>
        }
        </>
    )
}

export default ShippingAddress
