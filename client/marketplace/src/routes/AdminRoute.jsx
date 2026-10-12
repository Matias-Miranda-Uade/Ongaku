import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth()

  return (
    <ProtectedRoute>
      {isAdmin ? (children ?? <Outlet />) : (
        <section className="page access-denied" aria-labelledby="access-denied-title">
          <p className="eyebrow">ACCESO RESTRINGIDO · 403</p>
          <h1 id="access-denied-title">Esta sección es sólo para administradores.</h1>
          <p>Tu cuenta no tiene permisos de administración.</p>
          <Link className="secondary-button" to="/">Volver a la tienda</Link>
        </section>
      )}
    </ProtectedRoute>
  )
}

export default AdminRoute
