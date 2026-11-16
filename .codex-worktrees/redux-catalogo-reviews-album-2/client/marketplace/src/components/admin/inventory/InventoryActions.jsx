import { Link } from 'react-router-dom'

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`

const exportCsv = (rows) => {
  const header = ['ID', 'Nombre', 'Artista', 'Género', 'Año', 'Precio', 'Descuento %', 'Precio final', 'Stock', 'Publicado']
  const lines = rows.map((row) => [
    row.id, row.name, row.artistName, row.genreName, row.year, row.price,
    row.discountPercentage, row.finalPrice, row.stock, row.enabled ? 'Sí' : 'No',
  ].map(csvCell).join(';'))
  const blob = new Blob([`﻿${[header.map(csvCell).join(';'), ...lines].join('\n')}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ongaku-inventario-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const InventoryActions = ({ rows = [], loading = false, onRefresh }) => (
  <div className="admin-page-actions">
    <button type="button" className="secondary-button" onClick={onRefresh} disabled={loading}>
      {loading ? 'Actualizando…' : 'Actualizar'}
    </button>
    <button type="button" className="secondary-button" onClick={() => exportCsv(rows)} disabled={rows.length === 0}>
      Exportar CSV
    </button>
    <Link className="primary-button" to="/app/admin/vinyls/new">Nuevo vinilo</Link>
  </div>
)

export default InventoryActions
