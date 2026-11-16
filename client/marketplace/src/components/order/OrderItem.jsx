import VinylCover from '../vinyl/VinylCover'
import './OrderItem.css'

const OrderItem = ({ item }) => {
    return (
        <div className="order-product-card">
            <div className="order-product-cover">
                <VinylCover src={item.image} alt={`Portada de ${item.name}`} className="order-product-image" />
            </div>
            <div className="order-product-info">
                <h3>{item.name}</h3>
                {item.artistName && <p className="order-product-artist">{item.artistName}</p>}
            </div>
            <dl className="order-product-prices">
                <div>
                    <dt>Cantidad</dt>
                    <dd>{item.quantity}</dd>
                </div>
                <div>
                    <dt>Precio unitario</dt>
                    <dd>${item.unitPrice.toLocaleString('es-AR')}</dd>
                </div>
                <div className="order-product-subtotal">
                    <dt>Subtotal</dt>
                    <dd>${(item.unitPrice * item.quantity).toLocaleString('es-AR')}</dd>
                </div>
            </dl>
        </div>
    )
}

export default OrderItem
