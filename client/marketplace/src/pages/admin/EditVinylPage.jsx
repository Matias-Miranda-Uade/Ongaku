import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import VinylForm from '../../components/admin/vinyl-form/VinylForm';
import { fetchAdminVinylById, selectAdminVinylDetail } from '../../Redux/slices/adminCatalogSlice';
import { RouteLoader } from '../../routes/ProtectedRoute';
const EditVinylPage = () => {
  const {
    vinylId
  } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const detail = useSelector(state => selectAdminVinylDetail(state, vinylId));
  // Se pide siempre el detalle actualizado antes de editar; el listado puede tener hasta 30 s.
  const load = () => dispatch(fetchAdminVinylById({ vinylId, force: true }));
  useEffect(() => {
    load();
  }, [dispatch, vinylId]);
  const loading = detail.status === 'idle' || detail.status === 'loading';
  const vinyl = detail.status === 'succeeded' ? detail.vinyl : null;
  const error = detail.status === 'failed' ? { message: detail.error, isNotFound: detail.notFound } : null;
  return <section className="admin-page" aria-labelledby="edit-vinyl-title">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">編集 · EDICIÓN {vinyl ? `· #${vinyl.id}` : ''}</p>
          <h1 id="edit-vinyl-title">{vinyl ? vinyl.name : 'Editar vinilo'}</h1>
        </div>
        <Link className="link-button" to="/app/admin/inventory">← Volver al inventario</Link>
      </header>

      {loading && <RouteLoader label="Cargando vinilo…" />}

      {!loading && error && <div className="admin-alert" role="alert">
          <p>{error.isNotFound ? `No existe un vinilo con el id ${vinylId}.` : error.message}</p>
          {!error.isNotFound && <button type="button" className="link-button" onClick={load}>Reintentar</button>}
        </div>}

      {!loading && vinyl && <VinylForm mode="edit" initialData={vinyl} onCancel={() => navigate('/app/admin/inventory')} onSuccess={saved => navigate('/app/admin/inventory', {
      state: {
        flash: `Los cambios en "${saved.name}" se guardaron.`
      }
    })} />}
    </section>;
};
export default EditVinylPage;
