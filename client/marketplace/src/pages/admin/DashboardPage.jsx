import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardMetricCard from '../../components/admin/dashboard/DashboardMetricCard';
import RevenueChart from '../../components/admin/dashboard/RevenueChart';
import TopVinyls from '../../components/admin/dashboard/TopVinyls';
import OrderStatusSummary from '../../components/admin/dashboard/OrderStatusSummary';
import RecentOrdersTable from '../../components/admin/dashboard/RecentOrdersTable';
import { formatMoney, formatNumber } from '../../components/admin/adminUtils';
import { fetchAdminOrders, fetchDashboardSummary, selectAdminOrders, selectAdminOrdersRequest, selectDashboardSummary, selectUpdatingOrderIds, updateAdminOrderStatus } from '../../Redux/slices/adminOrdersSlice';
import { fetchAdminVinyls, selectAdminVinylsRequest, selectInventoryTotals } from '../../Redux/slices/adminCatalogSlice';
import { statusLabels } from '../../data/orderStatuses';
const isLoading = request => request.status === 'idle' || request.status === 'loading';
const DashboardPage = () => {
  const dispatch = useDispatch();
  const summaryRequest = useSelector(selectDashboardSummary);
  const ordersRequest = useSelector(selectAdminOrdersRequest);
  const vinylsRequest = useSelector(selectAdminVinylsRequest);
  const orders = useSelector(selectAdminOrders);
  const inventory = useSelector(selectInventoryTotals);
  const updatingIds = useSelector(selectUpdatingOrderIds);
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const summary = summaryRequest.data;
  const loading = [summaryRequest, ordersRequest, vinylsRequest].some(isLoading);
  const failed = [summaryRequest, ordersRequest, vinylsRequest].find(request => request.status === 'failed');
  const error = actionError || (failed ? failed.error || 'No pudimos cargar todos los datos del panel.' : '');
  const load = (force = false) => {
    setActionError('');
    dispatch(fetchDashboardSummary({ force }));
    dispatch(fetchAdminOrders({ force }));
    dispatch(fetchAdminVinyls({ force }));
  };
  useEffect(() => {
    load();
  }, [dispatch]);
  const handleStatusChange = (order, nextStatus) => {
    setNotice('');
    return dispatch(updateAdminOrderStatus({ orderId: order.id, status: nextStatus })).unwrap().then(() => {
      setNotice(`La orden #${order.id} ahora está ${statusLabels[nextStatus]?.toLowerCase() ?? nextStatus}.`);
    }).catch(statusError => {
      setActionError(statusError.message);
    });
  };
  return <section className="admin-page" aria-labelledby="dashboard-title">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">概要 · RESUMEN DEL NEGOCIO</p>
          <h1 id="dashboard-title">Dashboard</h1>
        </div>
        <div className="admin-page-actions">
          <Link className="primary-button" to="/app/admin/vinyls/new">Nuevo vinilo</Link>
        </div>
      </header>

      {error && <div className="admin-alert" role="alert">
          <p>{error}</p>
          <button type="button" className="link-button" onClick={() => load(true)}>Reintentar</button>
        </div>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <div className="metric-grid">
        <DashboardMetricCard label="Ingresos totales" kana="売上" tone="accent" loading={loading && !summary} value={formatMoney(summary?.totalRevenue)} hint={`${formatNumber(summary?.totalPayments)} pagos registrados`} />
        <DashboardMetricCard label="Ticket promedio" kana="平均" loading={loading && !summary} value={formatMoney(summary?.averageOrderValue)} hint="Promedio por orden pagada" />
        <DashboardMetricCard label="Órdenes" kana="注文" loading={loading && !summary} value={formatNumber(summary?.totalOrders)} hint={`${formatNumber(summary?.pendingOrders)} pendientes de pago`} />
        <DashboardMetricCard label="Inventario" kana="在庫" tone={inventory.out > 0 ? 'warning' : 'default'} loading={loading && inventory.titles === 0} value={`${formatNumber(inventory.units)} u.`} hint={`${inventory.titles} títulos · ${inventory.out} sin stock · ${inventory.low} con stock bajo`} />
      </div>

      <div className="dashboard-grid">
        <RevenueChart orders={orders} loading={loading && orders.length === 0} />
        <OrderStatusSummary summary={summary} loading={loading && !summary} />
      </div>

      <div className="dashboard-grid dashboard-grid-bottom">
        <RecentOrdersTable orders={orders} loading={loading && orders.length === 0} updatingIds={updatingIds} onStatusChange={handleStatusChange} />
        <TopVinyls orders={orders} loading={loading && orders.length === 0} />
      </div>
    </section>;
};
export default DashboardPage;
