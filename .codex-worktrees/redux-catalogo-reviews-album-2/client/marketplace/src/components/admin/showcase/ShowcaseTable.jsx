import { useEffect, useRef } from 'react'
import ShowcaseRow from './ShowcaseRow'

const ShowcaseTable = ({
  rows = [],
  loading = false,
  selection,
  onSelect,
  onSelectAll,
  onClearSelection,
  onToggle,
  onBulk,
  isEnabled,
  isPending,
  savingIds,
  busy = false,
}) => {
  const selectAllRef = useRef(null)
  const selectedVisible = rows.filter((row) => selection.has(row.id)).length
  const allSelected = rows.length > 0 && selectedVisible === rows.length

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = selectedVisible > 0 && !allSelected
  }, [selectedVisible, allSelected])

  if (loading && rows.length === 0) return <div className="skeleton skeleton-table" />
  if (rows.length === 0) return <p className="admin-empty">No hay vinilos que coincidan con los filtros.</p>

  return (
    <>
      {selection.size > 0 && (
        <div className="bulk-bar" role="toolbar" aria-label="Acciones sobre la selección">
          <p><strong>{selection.size}</strong> seleccionado{selection.size === 1 ? '' : 's'}</p>
          <div>
            <button type="button" className="secondary-button small" onClick={() => onBulk(true)} disabled={busy}>Publicar</button>
            <button type="button" className="secondary-button small" onClick={() => onBulk(false)} disabled={busy}>Ocultar</button>
            <button type="button" className="link-button" onClick={onClearSelection}>Quitar selección</button>
          </div>
        </div>
      )}
      <div className="admin-table-wrap">
        <table className="admin-table showcase-table">
          <thead>
            <tr>
              <th className="select-cell">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => onSelectAll(rows.map((row) => row.id), event.target.checked)}
                  aria-label="Seleccionar todos los resultados"
                />
              </th>
              <th>Vinilo</th>
              <th className="num">Precio</th>
              <th>Stock</th>
              <th>Vitrina</th>
              <th className="end"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((vinyl) => (
              <ShowcaseRow
                key={vinyl.id}
                vinyl={vinyl}
                enabled={isEnabled(vinyl)}
                pending={isPending(vinyl.id)}
                saving={savingIds.has(vinyl.id)}
                selected={selection.has(vinyl.id)}
                onSelect={onSelect}
                onToggle={onToggle}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ShowcaseTable
