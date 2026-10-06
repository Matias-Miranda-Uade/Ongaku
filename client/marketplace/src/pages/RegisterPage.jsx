import AuthLayout from '../components/auth/AuthLayout'
import RegisterForm from '../components/auth/RegisterForm'
import SocialLoginButtons from '../components/auth/SocialLoginButtons'
import Divider from '../components/ui/Divider'

const RegisterPage = ({ onNavigate, onRegister }) => (
  <AuthLayout activeTab="register" onNavigate={onNavigate}>
    <p>Registro de prueba, sin guardar datos.</p>
    <RegisterForm onRegister={onRegister} />
    <Divider />
    <SocialLoginButtons onLogin={provider => onRegister({ name: `Usuario de ${provider}` })} />
  </AuthLayout>
)
export default RegisterPage
