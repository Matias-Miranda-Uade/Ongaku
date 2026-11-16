import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import InventoryStats from '../../components/admin/inventory/InventoryStats';
import InventoryActions from '../../components/admin/inventory/InventoryActions';
import InventoryFilters, { DEFAULT_INVENTORY_FILTERS } from '../../components/admin/inventory/InventoryFilters';
import InventoryTable from '../../components/admin/inventory/InventoryTable';
import { adjustAdminVinylStock, deleteAdminVinyl, fetchAdminLookups, fetchAdminVinyls, selectAdminCategories, selectAdminGenres, selectAdminLookupsRequest, selectAdminVinyls, selectAdminVinylsRequest, selectBusyVinylIds, selectInventoryRows, setAdminVinylEnabled } from '../../Redux/slices/adminCatalogSlice';
const InventoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(DEFAULT_INVENTORY_FILTERS);
  const [sort, setSort] = useState({
    key: 'name',
    direction: 'asc'
  });
  const vinyls = useSelector(selectAdminVinyls);
  const visibleRows = useSelector(state => selectInventoryRows(state, filters, sort));
  const genres = useSelector(selectAdminGenres);
  const categories = useSelector(selectAdminCategories);
  const request = useSelector(selectAdminVinylsRequest);
  const lookupsRequest = useSelector(selectAdminLookupsRequest);
  const busyIds = useSelector(selectBusyVinylIds);
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState(location.state?.flash ?? '');
  const [blockedDelete, setBlockedDelete] = useState(null);
  const loading = request.status === 'idle' || request.status === 'loading';
  const error = actionError
    || (request.status === 'failed' ? request.error : '')
    || (lookupsRequest.status === 'failed' ? lookupsRequest.error : '');
  useEffect(() => {
    if (location.state?.flash) navigate(location.pathname, {
      replace: true,
      state: null
    });
  }, [location, navigate]);
  useEffect(() => {
    dispatch(fetchAdminLookups());
    dispatch(fetchAdminVinyls());
  }, [dispatch]);
  const load = () => {
    setActionError('');
    dispatch(fetchAdminLookups({ force: lookupsRequest.status === 'failed' }));
    return dispatch(fetchAdminVinyls({ force: true }));
  };
  const handleSort = key => {
    setSort(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  const handleAdjustStock = (vinyl, delta) => {
    setActionError('');
    return dispatch(adjustAdminVinylStock({ vinylId: vinyl.id, quantity: delta })).unwrap().catch(stockError => {
      setActionError(stockError.message);
    });
  };
  const handleDelete = vinyl => {
    setActionError('');
    setNotice('');
    setBlockedDelete(null);
    return dispatch(deleteAdminVinyl({ vinylId: vinyl.id })).unwrap().then(() => {
      setNotice(`"${vinyl.name}" se eliminó del inventario.`);
    }).catch(deleteError => {
      if (deleteError.isConflict) setBlockedDelete(vinyl);else setActionError(deleteError.message);
    });
  };
  const handleHideInstead = vinyl => {
    return dispatch(setAdminVinylEnabled({ vinylId: vinyl.id, enabled: false })).unwrap().then(() => {
      setBlockedDelete(null);
      setNotice(`"${vinyl.name}" quedó oculto de la vitrina.`);
    }).catch(hideError => {
      setActionError(hideError.message);
    });
  };
  return <section className="admin-page" aria-labelledby="inventory-title">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">在庫 · INVENTARIO</p>
          <h1 id="inventory-title">Inventario</h1>
        </div>
        <InventoryActions rows={visibleRows} loading={loading} onRefresh={load} />
      </header>

      <InventoryStats vinyls={vinyls} />

      {error && <div className="admin-alert" role="alert">
          <p>{error}</p>
          <button type="button" className="link-button" onClick={load}>Reintentar</button>
        </div>}
      {blockedDelete && <div className="admin-alert admin-alert-warning" role="alert">
          <p>
            <strong>"{blockedDelete.name}"</strong> ya figura en órdenes, así que no se puede eliminar sin perder el historial.
            Podés ocultarlo de la vitrina.
          </p>
          <div>
            {blockedDelete.enabled && <button type="button" className="link-button" onClick={() => handleHideInstead(blockedDelete)}>Ocultar de la vitrina</button>}
            <button type="button" className="link-button" onClick={() => setBlockedDelete(null)}>Cerrar</button>
          </div>
        </div>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <InventoryFilters filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_INVENTORY_FILTERS)} genres={genres} categories={categories} resultCount={visibleRows.length} />

      <InventoryTable rows={visibleRows} sort={sort} onSort={handleSort} busyIds={busyIds} loading={loading} onEdit={vinyl => navigate(`/app/admin/vinyls/${vinyl.id}/edit`)} onDelete={handleDelete} onAdjustStock={handleAdjustStock} />
    </section>;
};
export default InventoryPage;
