const ProfileStats = ({ orders, favorites, cartProducts }) => {
    return (
        <ul>
            <li>Órdenes: {orders}</li>
            <li>Favoritos: {favorites}</li>
            <li>En el carrito: {cartProducts}</li>
        </ul>
    )
}

export default ProfileStats
