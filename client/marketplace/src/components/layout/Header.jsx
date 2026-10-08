import Button from '../ui/Button'
import useCart from '../../hooks/useCart'
import useFavorites from '../../hooks/useFavorites'

const navigation = [
  { id: 'catalog', label: 'Catálogo' },
  { id: 'reviews', label: 'Reseñas' },
  { id: 'home', label: 'Curaduría' },
  { id: 'orders', label: 'Órdenes' },
]

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="10.8" cy="10.8" r="6.8" />
    <path d="m16 16 5 5" />
  </svg>
)

const BagIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 8h14l1 13H4L5 8Z" />
    <path d="M9 9V6a3 3 0 0 1 6 0v3" />
  </svg>
)

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.4 8.6c0 4.4-8.4 10-8.4 10s-8.4-5.6-8.4-10A4.5 4.5 0 0 1 12 6.3a4.5 4.5 0 0 1 8.4 2.3Z" />
  </svg>
)

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </svg>
)

const Header = ({ page, onNavigate, user, onLogout }) => {
  const { totalUnits } = useCart()
  const { favorites } = useFavorites()
  const activePage = page === 'vinyl-detail' ? 'catalog' : page

  return (
    <header className="site-header">
      <Button className="brand brand-button" onClick={() => onNavigate('home')}>
        <span className="brand-name"><span className="brand-mark">音</span> ONGAKU</span>
        <span className="brand-caption">音楽 · EDICIONES DE ARCHIVO</span>
      </Button>

      <nav className="main-nav" aria-label="Navegación principal">
        {navigation.map((item) => (
          <Button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={item.id === activePage ? 'nav-active' : ''}
            aria-current={item.id === activePage ? 'page' : undefined}
          >
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="header-actions">
        <Button className="header-action" aria-label="Buscar discos" onClick={() => onNavigate('catalog')}>
          <SearchIcon />
          <span>Buscar</span>
        </Button>
        <Button
          className="header-action header-action-icon"
          aria-label={`Favoritos${favorites.length ? `, ${favorites.length} guardados` : ''}`}
          onClick={() => onNavigate('favorites')}
        >
          <HeartIcon />
          {favorites.length > 0 && <span className="header-count">{favorites.length}</span>}
        </Button>
        <Button
          className="header-action header-action-icon"
          aria-label={`Bolsa${totalUnits ? `, ${totalUnits} productos` : ''}`}
          onClick={() => onNavigate('cart')}
        >
          <BagIcon />
          {totalUnits > 0 && <span className="header-count">{totalUnits}</span>}
        </Button>
        <Button
          className="header-action account-action"
          aria-label={user ? 'Mi gabinete' : 'Mi cuenta'}
          onClick={() => onNavigate('profile')}
        >
          <ProfileIcon />
          <span>{user ? 'Mi gabinete' : 'Mi cuenta'}</span>
        </Button>
        {user && <Button className="logout-action" onClick={onLogout}>Salir</Button>}
      </div>
    </header>
  )
}

export default Header
