export const DEFAULT_INVENTORY_FILTERS = {
  search: '',
  genreId: '',
  categoryId: '',
  stock: 'all',
  visibility: 'all',
}

const InventoryFilters = ({ filters, onChange, onReset, genres = [], categories = [], resultCount }) => {
  const update = (key) => (event) => onChange({ ...filters, [key]: event.target.value })
  const isDirty = Object.keys(DEFAULT_INVENTORY_FILTERS).some((key) => filters[key] !== DEFAULT_INVENTORY_FILTERS[key])

  return (
    <div className="admin-filters" role="search">
      <label className="admin-filter admin-filter-search">
        <span>Buscar</span>
        <input
          type="search"
          value={filters.search}
          onChange={update('search')}
          placeholder="Título, artista o ID"
        />
      </label>
      <label className="admin-filter">
        <span>Género</span>
        <select value={filters.genreId} onChange={update('genreId')}>
          <option value="">Todos</option>
          {genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
        </select>
      </label>
      <label className="admin-filter">
        <span>Categoría</span>
        <select value={filters.categoryId} onChange={update('categoryId')}>
          <option value="">Todas</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.description}</option>)}
        </select>
      </label>
      <label className="admin-filter">
        <span>Stock</span>
        <select value={filters.stock} onChange={update('stock')}>
          <option value="all">Todos</option>
          <option value="ok">En stock</option>
          <option value="low">Stock bajo</option>
          <option value="out">Sin stock</option>
        </select>
      </label>
      <label className="admin-filter">
        <span>Vitrina</span>
        <select value={filters.visibility} onChange={update('visibility')}>
          <option value="all">Todos</option>
          <option value="visible">Publicados</option>
          <option value="hidden">Ocultos</option>
        </select>
      </label>
      <div className="admin-filter-meta">
        {resultCount !== undefined && <span>{resultCount} resultado{resultCount === 1 ? '' : 's'}</span>}
        <button type="button" className="link-button" onClick={onReset} disabled={!isDirty}>Limpiar</button>
      </div>
    </div>
  )
}

export default InventoryFilters
