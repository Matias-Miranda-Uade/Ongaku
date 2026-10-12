import InventoryRow from './InventoryRow'

const COLUMNS = [
  { key: 'name', label: 'Vinilo' },
  { key: 'genreName', label: 'Género' },
  { key: 'finalPrice', label: 'Precio', numeric: true },
  { key: 'stock', label: 'Stock' },
  { key: null, label: 'Estado' },
  { key: null, label: 'Acciones', align: 'end' },
]

const InventoryTable = ({ rows = [], sort, onSort, busyIds = new Set(), loading = false, onEdit, onDelete, onAdjustStock }) => {
  if (loading && rows.length === 0) return <div className="skeleton skeleton-table" />

  if (rows.length === 0) {
    return <p className="admin-empty">No hay vinilos que coincidan con los filtros.</p>
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table inventory-table">
        <thead>
          <tr>
            {COLUMNS.map((column) => {
              const active = column.key && sort.key === column.key
              return (
                <th
                  key={column.label}
                  className={[column.numeric ? 'num' : '', column.align === 'end' ? 'end' : ''].join(' ').trim() || undefined}
                  aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {column.key ? (
                    <button type="button" className="sort-button" onClick={() => onSort(column.key)}>
                      {column.label}
                      <span aria-hidden="true">{active ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</span>
                    </button>
                  ) : column.label}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((vinyl) => (
            <InventoryRow
              key={vinyl.id}
              vinyl={vinyl}
              busy={busyIds.has(vinyl.id)}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdjustStock={onAdjustStock}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InventoryTable
