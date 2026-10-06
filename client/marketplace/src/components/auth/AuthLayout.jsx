import AuthVisualPanel from './AuthVisualPanel'
import AuthTabs from './AuthTabs'

const AuthLayout = ({ children, activeTab, onNavigate }) => (
  <section>
    <AuthVisualPanel />
    <AuthTabs activeTab={activeTab} onNavigate={onNavigate} />
    {children}
  </section>
)
export default AuthLayout
