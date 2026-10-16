import AuthVisualPanel from './AuthVisualPanel'
import AuthTabs from './AuthTabs'

const AuthLayout = ({ children, activeTab, onNavigate }) => (
  <section className="auth-layout">
    <AuthVisualPanel activeTab={activeTab} />
    <div className="auth-content">
      <AuthTabs activeTab={activeTab} onNavigate={onNavigate} />
      <div className="auth-form-content">{children}</div>
    </div>
  </section>
)
export default AuthLayout
