const ProfileStats = ({ orders, favorites, cartProducts }) => {
    return (
        <ul className="profile-stats" aria-label="Resumen de tu cuenta">
            <li><strong>{orders}</strong><span>Órdenes</span></li>
            <li><strong>{favorites}</strong><span>Favoritos</span></li>
            <li><strong>{cartProducts}</strong><span>En el carrito</span></li>
        </ul>
    )
}

export default ProfileStats
