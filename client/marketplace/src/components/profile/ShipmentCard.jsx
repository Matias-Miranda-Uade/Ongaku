const ShipmentCard = ({ address, onSetDefault, onRemove }) => {
    return (
        <>
        <h3>{address.street}</h3>
        <p>{address.city}, {address.province} ({address.zipCode})</p>
        {address.isDefault
            ? <p><strong>Dirección predeterminada</strong></p>
            : <button onClick={() => onSetDefault(address.id)}>Usar como predeterminada</button>
        }
        <button onClick={() => onRemove(address.id)}>Eliminar</button>
        </>
    )
}

export default ShipmentCard
