import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardMetricCard from '../../components/admin/dashboard/DashboardMetricCard'
import RevenueChart from '../../components/admin/dashboard/RevenueChart'
import TopVinyls from '../../components/admin/dashboard/TopVinyls'
import OrderStatusSummary from '../../components/admin/dashboard/OrderStatusSummary'
import RecentOrdersTable from '../../components/admin/dashboard/RecentOrdersTable'
import { formatMoney, formatNumber, getStockStatus } from '../../components/admin/adminUtils'
import { getAdminVinyls, getAllOrders, getDashboardSummary, updateOrderStatus } from '../../services/adminService'
import { statusLabels } from '../../data/orderStatuses'

const DashboardPage = () => {
  const [summary, setSummary] = useState(null)
  const [orders, setOrders] = useState([])
  const [vinyls, setVinyls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const [summaryResult, ordersResult, vinylsResult] = await Promise.allSettled([
      getDashboardSummary(),
      getAllOrders(),
      getAdminVinyls(),
    ])
    if (summaryResult.status === 'fulfilled') setSummary(summaryResult.value)
    if (ordersResult.status === 'fulfilled') setOrders(ordersResult.value)
    if (vinylsResult.status === 'fulfilled') setVinyls(vinylsResult.value)
    const failed = [summaryResult, ordersResult, vinylsResult].find((result) => result.status === 'rejected')
    if (failed) setError(failed.reason?.message || 'No pudimos cargar todos los datos del panel.')
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const inventory = useMemo(() => vinyls.reduce((acc, vinyl) => {
    const status = getStockStatus(vinyl.stock)
    acc.units += Number(vinyl.stock) || 0
    if (status === 'out') acc.out += 1
    if (status === 'low') acc.low += 1
    if (vinyl.enabled) acc.published += 1
    return acc
  }, { units: 0, out: 0, low: 0, published: 0 }), [vinyls])

  const handleStatusChange = async (order, nextStatus) => {
    setUpdatingId(order.id)
    setNotice('')
    try {
      const updated = await updateOrderStatus(order.id, nextStatus)
      setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, ...updated } : item)))
      setSummary(await getDashboardSummary())
      setNotice(`La orden #${order.id} ahora está ${statusLabels[nextStatus]?.toLowerCase() ?? nextStatus}.`)
    } catch (statusError) {
      setError(statusError.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <section className="admin-page" aria-labelledby="dashboard-title">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">概要 · RESUMEN DEL NEGOCIO</p>
          <h1 id="dashboard-title">Dashboard</h1>
        </div>
        <div className="admin-page-actions">
          <Link className="primary-button" to="/app/admin/vinyls/new">Nuevo vinilo</Link>
        </div>
      </header>

      {error && (
        <div className="admin-alert" role="alert">
          <p>{error}</p>
          <button type="button" className="link-button" onClick={load}>Reintentar</button>
        </div>
      )}
      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <div className="metric-grid">
        <DashboardMetricCard
          label="Ingresos totales"
          kana="売上"
          tone="accent"
          loading={loading && !summary}
          value={formatMoney(summary?.totalRevenue)}
          hint={`${formatNumber(summary?.totalPayments)} pagos registrados`}
        />
        <DashboardMetricCard
          label="Ticket promedio"
          kana="平均"
          loading={loading && !summary}
          value={formatMoney(summary?.averageOrderValue)}
          hint="Promedio por orden pagada"
        />
        <DashboardMetricCard
          label="Órdenes"
          kana="注文"
          loading={loading && !summary}
          value={formatNumber(summary?.totalOrders)}
          hint={`${formatNumber(summary?.pendingOrders)} pendientes de pago`}
        />
        <DashboardMetricCard
          label="Inventario"
          kana="在庫"
          tone={inventory.out > 0 ? 'warning' : 'default'}
          loading={loading && vinyls.length === 0}
          value={`${formatNumber(inventory.units)} u.`}
          hint={`${vinyls.length} títulos · ${inventory.out} sin stock · ${inventory.low} con stock bajo`}
        />
      </div>

      <div className="dashboard-grid">
        <RevenueChart orders={orders} loading={loading && orders.length === 0} />
        <OrderStatusSummary summary={summary} loading={loading && !summary} />
      </div>

      <div className="dashboard-grid dashboard-grid-bottom">
        <RecentOrdersTable
          orders={orders}
          loading={loading && orders.length === 0}
          updatingId={updatingId}
          onStatusChange={handleStatusChange}
        />
        <TopVinyls orders={orders} loading={loading && orders.length === 0} />
      </div>
    </section>
  )
}

export default DashboardPage
