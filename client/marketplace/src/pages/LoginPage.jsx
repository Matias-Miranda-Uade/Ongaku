import AuthLayout from '../components/auth/AuthLayout'
import LoginForm from '../components/auth/LoginForm'

const LoginPage = ({ onNavigate, onLogin }) => (
  <div className="page auth-page">
    <AuthLayout activeTab="login" onNavigate={onNavigate}>
      <p className="auth-note">Ingresá con tu cuenta para ver tus órdenes y guardar tu carrito.</p>
      <LoginForm onLogin={onLogin} />
    </AuthLayout>
  </div>
)
export default LoginPage
