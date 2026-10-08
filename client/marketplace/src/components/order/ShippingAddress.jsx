const ShippingAddress = ({ address }) => {
    return (
        <>
        <h2>Dirección de envío</h2>
        <p>{address.street}</p>
        <p>{address.city}, {address.province} ({address.zipCode})</p>
        </>
    )
}

export default ShippingAddress
