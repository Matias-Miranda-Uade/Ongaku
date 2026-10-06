import Button from '../ui/Button'

const Header = ({ page, onNavigate, user, onLogout }) => (
  <header>
    <p>Ongaku</p>
    <nav aria-label="Principal">
      <Button onClick={() => onNavigate('home')} aria-current={page === 'home' ? 'page' : undefined}>Inicio</Button>
      {user ? <Button onClick={onLogout}>Cerrar sesión</Button> : <>
        <Button onClick={() => onNavigate('login')} aria-current={page === 'login' ? 'page' : undefined}>Ingresar</Button>
        <Button onClick={() => onNavigate('register')} aria-current={page === 'register' ? 'page' : undefined}>Registrarse</Button>
      </>}
    </nav>
  </header>
)
export default Header
