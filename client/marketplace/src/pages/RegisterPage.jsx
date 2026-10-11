import AuthLayout from '../components/auth/AuthLayout'
import RegisterForm from '../components/auth/RegisterForm'

const RegisterPage = ({ onNavigate, onRegister }) => (
  <div className="page auth-page">
    <AuthLayout activeTab="register" onNavigate={onNavigate}>
      <p className="auth-note">Creá una cuenta para guardar tu perfil, carrito y órdenes en Ongaku.</p>
      <RegisterForm onRegister={onRegister} />
    </AuthLayout>
  </div>
)
export default RegisterPage
