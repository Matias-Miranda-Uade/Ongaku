import VinylCover from '../vinyl/VinylCover';
import './OrderItem.css';

const OrderItem = ({ item }) => {
    const price = item.unitPrice == null ? NaN : Number(item.unitPrice);
    const quantity = item.quantity == null ? NaN : Number(item.quantity);
    const subtotal = item.subtotal ?? (Number.isFinite(price) && Number.isFinite(quantity) ? price * quantity : null);
    const money = value => value == null || !Number.isFinite(Number(value))
        ? 'No disponible' : `$${Number(value).toLocaleString('es-AR')}`;
    return (
        <div className="order-product">
            <VinylCover className="order-product-cover" src={item.image} alt={item.name || 'Vinilo comprado'} />
            <div className="order-product-info">
                <h3>{item.name}</h3>
                {item.artistName && <p className="order-product-artist">{item.artistName}</p>}
                <dl className="order-product-values">
                    <div><dt>Cantidad</dt><dd>{item.quantity ?? 'No disponible'}</dd></div>
                    <div><dt>Precio unitario</dt><dd>{money(item.unitPrice)}</dd></div>
                    <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
                </dl>
            </div>
        </div>
    )
}

export default OrderItem
