import { useState } from 'react'
import InventoryStatus from './InventoryStatus'
import { formatMoney } from '../adminUtils'

const InventoryRow = ({ vinyl, busy = false, onEdit, onDelete, onAdjustStock }) => {
  const [confirming, setConfirming] = useState(false)
  const hasDiscount = Number(vinyl.discountPercentage) > 0

  return (
    <tr className={busy ? 'is-busy' : undefined}>
      <td>
        <div className="inventory-product">
          {vinyl.image
            ? <img src={vinyl.image} alt="" loading="lazy" />
            : <span className="inventory-thumb-empty" aria-hidden="true">音</span>}
          <div>
            <p className="inventory-name">{vinyl.name}</p>
            <p className="inventory-meta">
              <span className="mono">#{vinyl.id}</span> · {vinyl.artistName || 'Sin artista'} · {vinyl.year || '—'}
            </p>
          </div>
        </div>
      </td>
      <td>{vinyl.genreName || '—'}</td>
      <td className="num">
        <span className="inventory-price">{formatMoney(vinyl.finalPrice ?? vinyl.price)}</span>
        {hasDiscount && <span className="inventory-discount">−{vinyl.discountPercentage}% · <del>{formatMoney(vinyl.price)}</del></span>}
      </td>
      <td>
        <div className="stock-stepper" role="group" aria-label={`Stock de ${vinyl.name}`}>
          <button
            type="button"
            onClick={() => onAdjustStock(vinyl, -1)}
            disabled={busy || Number(vinyl.stock) <= 0}
            aria-label="Restar una unidad"
          >−</button>
          <output>{vinyl.stock}</output>
          <button type="button" onClick={() => onAdjustStock(vinyl, 1)} disabled={busy} aria-label="Sumar una unidad">+</button>
        </div>
      </td>
      <td><InventoryStatus stock={vinyl.stock} enabled={vinyl.enabled} /></td>
      <td className="row-actions">
        {confirming ? (
          <div className="confirm-inline" role="group" aria-label="Confirmar eliminación">
            <span>¿Eliminar?</span>
            <button type="button" className="danger-link" disabled={busy} onClick={() => { setConfirming(false); onDelete(vinyl) }}>Sí, eliminar</button>
            <button type="button" className="link-button" onClick={() => setConfirming(false)}>No</button>
          </div>
        ) : (
          <>
            <button type="button" className="link-button" onClick={() => onEdit(vinyl)} disabled={busy}>Editar</button>
            <button type="button" className="danger-link" onClick={() => setConfirming(true)} disabled={busy}>Eliminar</button>
          </>
        )}
      </td>
    </tr>
  )
}

export default InventoryRow
