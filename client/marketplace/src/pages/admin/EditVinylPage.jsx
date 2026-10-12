import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import VinylForm from '../../components/admin/vinyl-form/VinylForm'
import { getAdminVinylById } from '../../services/adminService'
import { RouteLoader } from '../../routes/ProtectedRoute'

const EditVinylPage = () => {
  const { vinylId } = useParams()
  const navigate = useNavigate()
  const [vinyl, setVinyl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setVinyl(await getAdminVinylById(vinylId))
    } catch (loadError) {
      setError(loadError)
    } finally {
      setLoading(false)
    }
  }, [vinylId])

  useEffect(() => { load() }, [load])

  return (
    <section className="admin-page" aria-labelledby="edit-vinyl-title">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">編集 · EDICIÓN {vinyl ? `· #${vinyl.id}` : ''}</p>
          <h1 id="edit-vinyl-title">{vinyl ? vinyl.name : 'Editar vinilo'}</h1>
        </div>
        <Link className="link-button" to="/app/admin/inventory">← Volver al inventario</Link>
      </header>

      {loading && <RouteLoader label="Cargando vinilo…" />}

      {!loading && error && (
        <div className="admin-alert" role="alert">
          <p>{error.isNotFound ? `No existe un vinilo con el id ${vinylId}.` : error.message}</p>
          {!error.isNotFound && <button type="button" className="link-button" onClick={load}>Reintentar</button>}
        </div>
      )}

      {!loading && vinyl && (
        <VinylForm
          mode="edit"
          initialData={vinyl}
          onCancel={() => navigate('/app/admin/inventory')}
          onSuccess={(saved) => navigate('/app/admin/inventory', {
            state: { flash: `Los cambios en "${saved.name}" se guardaron.` },
          })}
        />
      )}
    </section>
  )
}

export default EditVinylPage
