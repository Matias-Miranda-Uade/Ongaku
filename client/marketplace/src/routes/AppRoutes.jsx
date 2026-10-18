import { Navigate, Route, Routes } from 'react-router-dom'
import AdminRoute from './AdminRoute'
import AdminLayout from '../components/admin/AdminLayout'
import DashboardPage from '../pages/admin/DashboardPage'
import InventoryPage from '../pages/admin/InventoryPage'
import CreateVinylPage from '../pages/admin/CreateVinylPage'
import EditVinylPage from '../pages/admin/EditVinylPage'
import ShowcasePage from '../pages/admin/ShowcasePage'
import OrdersAdminPage from '../pages/admin/OrdersAdminPage'

export const ADMIN_BASE_PATH = '/app/admin'

export const isAdminPath = (pathname) =>
  pathname === ADMIN_BASE_PATH || pathname.startsWith(`${ADMIN_BASE_PATH}/`)

const AppRoutes = () => (
  <Routes>
    <Route path={ADMIN_BASE_PATH} element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="orders" element={<OrdersAdminPage />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="vinyls/new" element={<CreateVinylPage />} />
      <Route path="vinyls/:vinylId/edit" element={<EditVinylPage />} />
      <Route path="showcase" element={<ShowcasePage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Route>
  </Routes>
)

export default AppRoutes
