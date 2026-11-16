import { Link } from 'react-router-dom'
import ShowcaseToggle from './ShowcaseToggle'
import InventoryStatus from '../inventory/InventoryStatus'
import { formatMoney } from '../adminUtils'

const ShowcaseRow = ({ vinyl, enabled, pending = false, saving = false, selected = false, onSelect, onToggle }) => (
  <tr className={[pending ? 'is-pending' : '', !enabled ? 'is-muted' : ''].join(' ').trim() || undefined}>
    <td className="select-cell">
      <input
        type="checkbox"
        checked={selected}
        onChange={(event) => onSelect(vinyl.id, event.target.checked)}
        aria-label={`Seleccionar ${vinyl.name}`}
      />
    </td>
    <td>
      <div className="inventory-product">
        {vinyl.image
          ? <img src={vinyl.image} alt="" loading="lazy" />
          : <span className="inventory-thumb-empty" aria-hidden="true">音</span>}
        <div>
          <p className="inventory-name">{vinyl.name}</p>
          <p className="inventory-meta">{vinyl.artistName || 'Sin artista'} · {vinyl.genreName || 'Sin género'}</p>
        </div>
      </div>
    </td>
    <td className="num">{formatMoney(vinyl.finalPrice ?? vinyl.price)}</td>
    <td><InventoryStatus stock={vinyl.stock} showVisibility={false} /> <span className="mono muted">{vinyl.stock} u.</span></td>
    <td>
      <ShowcaseToggle
        checked={enabled}
        pending={pending}
        saving={saving}
        label={`${enabled ? 'Ocultar' : 'Publicar'} ${vinyl.name}`}
        onChange={(next) => onToggle(vinyl, next)}
      />
    </td>
    <td className="end">
      <Link className="link-button" to={`/app/admin/vinyls/${vinyl.id}/edit`}>Editar</Link>
    </td>
  </tr>
)

export default ShowcaseRow
