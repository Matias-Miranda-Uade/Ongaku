import AuthLayout from '../components/auth/AuthLayout'
import LoginForm from '../components/auth/LoginForm'
import SocialLoginButtons from '../components/auth/SocialLoginButtons'
import Divider from '../components/ui/Divider'

const LoginPage = ({ onNavigate, onLogin }) => (
  <div className="page auth-page">
    <AuthLayout activeTab="login" onNavigate={onNavigate}>
      <p className="auth-note">Ingresá para continuar. El acceso es de demostración y no valida credenciales contra un servidor.</p>
      <LoginForm onLogin={onLogin} />
      <Divider />
      <SocialLoginButtons onLogin={provider => onLogin({ name: `Usuario de ${provider}`, email: '' })} />
    </AuthLayout>
  </div>
)
export default LoginPage
