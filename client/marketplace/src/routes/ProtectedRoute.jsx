import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { selectAuth } from '../Redux/slices/authSlice'

export const RouteLoader = ({ label = 'Verificando tu sesión…' }) => (
  <div className="route-loader" role="status" aria-live="polite">
    <span className="route-loader-disc" aria-hidden="true" />
    <p>{label}</p>
  </div>
)

const ProtectedRoute = ({ children, redirectTo = '/app/login' }) => {
  const { isAuthenticated, isRestoringSession } = useSelector(selectAuth)
  const location = useLocation()

  if (isRestoringSession) return <RouteLoader />
  if (!isAuthenticated) return <Navigate to={redirectTo} replace state={{ from: location }} />

  return children ?? <Outlet />
}

export default ProtectedRoute
