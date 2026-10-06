import Button from '../ui/Button'

const AuthTabs = ({ activeTab, onNavigate }) => (
  <nav aria-label="Acceso">
    <Button onClick={() => onNavigate('login')} aria-current={activeTab === 'login' ? 'page' : undefined}>Ingresar</Button>
    <Button onClick={() => onNavigate('register')} aria-current={activeTab === 'register' ? 'page' : undefined}>Registrarse</Button>
  </nav>
)
export default AuthTabs
