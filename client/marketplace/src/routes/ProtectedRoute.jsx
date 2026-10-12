import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const RouteLoader = ({ label = 'Verificando tu sesión…' }) => (
  <div className="route-loader" role="status" aria-live="polite">
    <span className="route-loader-disc" aria-hidden="true" />
    <p>{label}</p>
  </div>
)

const ProtectedRoute = ({ children, redirectTo = '/app/login' }) => {
  const { isAuthenticated, isRestoringSession } = useAuth()
  const location = useLocation()

  if (isRestoringSession) return <RouteLoader />
  if (!isAuthenticated) return <Navigate to={redirectTo} replace state={{ from: location }} />

  return children ?? <Outlet />
}

export default ProtectedRoute
