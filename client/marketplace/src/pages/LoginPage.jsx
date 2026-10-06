import AuthLayout from '../components/auth/AuthLayout'
import LoginForm from '../components/auth/LoginForm'
import SocialLoginButtons from '../components/auth/SocialLoginButtons'
import Divider from '../components/ui/Divider'

const LoginPage = ({ onNavigate, onLogin }) => (
  <AuthLayout activeTab="login" onNavigate={onNavigate}>
    <p>Acceso de prueba, sin verificar credenciales.</p>
    <LoginForm onLogin={onLogin} />
    <Divider />
    <SocialLoginButtons onLogin={provider => onLogin({ name: `Usuario de ${provider}` })} />
  </AuthLayout>
)
export default LoginPage
