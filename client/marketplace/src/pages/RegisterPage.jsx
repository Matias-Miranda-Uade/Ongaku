import AuthLayout from '../components/auth/AuthLayout'
import RegisterForm from '../components/auth/RegisterForm'
import SocialLoginButtons from '../components/auth/SocialLoginButtons'
import Divider from '../components/ui/Divider'

const RegisterPage = ({ onNavigate, onRegister }) => (
  <div className="page auth-page">
    <AuthLayout activeTab="register" onNavigate={onNavigate}>
      <p className="auth-note">Tu perfil queda guardado en este navegador. Esta versión de prueba no crea cuentas en un servidor ni guarda tu contraseña.</p>
      <RegisterForm onRegister={onRegister} />
      <Divider />
      <SocialLoginButtons onLogin={provider => onRegister({ name: `Usuario de ${provider}`, email: '' })} />
    </AuthLayout>
  </div>
)
export default RegisterPage
