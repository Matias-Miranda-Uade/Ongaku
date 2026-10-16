import { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const sections = [
  { to: '/app/admin/dashboard', label: 'Dashboard', kana: '概要' },
  { to: '/app/admin/inventory', label: 'Inventario', kana: '在庫' },
  { to: '/app/admin/vinyls/new', label: 'Nuevo vinilo', kana: '追加' },
  { to: '/app/admin/showcase', label: 'Vitrina', kana: '展示' },
]

const AdminLayout = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <p className="eyebrow">管理 · PANEL DE ADMINISTRACIÓN</p>
        <p className="admin-user">{user?.name} · <span>{user?.email}</span></p>
      </div>
      <nav className="admin-nav" aria-label="Secciones de administración">
        {sections.map((section) => (
          <NavLink
            key={section.to}
            to={section.to}
            className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}
          >
            <span className="admin-nav-kana" aria-hidden="true">{section.kana}</span>
            {section.label}
          </NavLink>
        ))}
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
