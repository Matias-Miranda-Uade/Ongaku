import Button from '../ui/Button'

const pages = [
  { id: 'home', label: 'Inicio' },
  { id: 'catalog', label: 'Catálogo' },
  { id: 'reviews', label: 'Reseñas' },
  { id: 'favorites', label: 'Favoritos' },
  { id: 'cart', label: 'Carrito' },
  { id: 'orders', label: 'Órdenes' },
  { id: 'profile', label: 'Perfil' },
]

const Header = ({ page, onNavigate, user, onLogout }) => {
  const activePage = page === 'vinyl-detail' ? 'catalog' : page

  return (
    <header className="site-header">
      <Button className="brand brand-button" onClick={() => onNavigate('home')}>ONGAKU</Button>
      <nav className="main-nav" aria-label="Navegación principal">
        {pages.map((item) => (
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
        {user
          ? <Button onClick={onLogout}>Cerrar sesión</Button>
          : <>
              <Button onClick={() => onNavigate('login')} aria-current={page === 'login' ? 'page' : undefined}>Ingresar</Button>
              <Button onClick={() => onNavigate('register')} aria-current={page === 'register' ? 'page' : undefined}>Registrarse</Button>
            </>
        }
      </div>
    </header>
  )
}

export default Header
