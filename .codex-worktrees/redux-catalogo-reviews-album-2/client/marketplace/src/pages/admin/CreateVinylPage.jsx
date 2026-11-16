import { Link, useNavigate } from 'react-router-dom'
import VinylForm from '../../components/admin/vinyl-form/VinylForm'

const CreateVinylPage = () => {
  const navigate = useNavigate()

  return (
    <section className="admin-page" aria-labelledby="create-vinyl-title">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">追加 · ALTA DE PRODUCTO</p>
          <h1 id="create-vinyl-title">Nuevo vinilo</h1>
        </div>
        <Link className="link-button" to="/app/admin/inventory">← Volver al inventario</Link>
      </header>

      <VinylForm
        mode="create"
        onCancel={() => navigate('/app/admin/inventory')}
        onSuccess={(vinyl) => navigate('/app/admin/inventory', {
          state: { flash: `"${vinyl.name}" se creó correctamente${vinyl.enabled ? ' y ya está en la vitrina' : ' como borrador'}.` },
        })}
      />
    </section>
  )
}

export default CreateVinylPage
