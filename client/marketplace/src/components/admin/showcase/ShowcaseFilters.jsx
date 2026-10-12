export const DEFAULT_SHOWCASE_FILTERS = { search: '', visibility: 'all', stock: 'all', genreId: '' }

const ShowcaseFilters = ({ filters, onChange, genres = [], resultCount }) => {
  const update = (key) => (event) => onChange({ ...filters, [key]: event.target.value })
  const isDirty = Object.keys(DEFAULT_SHOWCASE_FILTERS).some((key) => filters[key] !== DEFAULT_SHOWCASE_FILTERS[key])

  return (
    <div className="admin-filters" role="search">
      <label className="admin-filter admin-filter-search">
        <span>Buscar</span>
        <input type="search" value={filters.search} onChange={update('search')} placeholder="Título o artista" />
      </label>
      <div className="admin-filter">
        <span id="showcase-visibility-label">Visibilidad</span>
        <div className="segmented" role="radiogroup" aria-labelledby="showcase-visibility-label">
          {[['all', 'Todos'], ['visible', 'Visibles'], ['hidden', 'Ocultos']].map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={filters.visibility === value}
              className={filters.visibility === value ? 'is-active' : ''}
              onClick={() => onChange({ ...filters, visibility: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <label className="admin-filter">
        <span>Stock</span>
        <select value={filters.stock} onChange={update('stock')}>
          <option value="all">Todos</option>
          <option value="in">Con stock</option>
          <option value="out">Sin stock</option>
        </select>
      </label>
      <label className="admin-filter">
        <span>Género</span>
        <select value={filters.genreId} onChange={update('genreId')}>
          <option value="">Todos</option>
          {genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
        </select>
      </label>
      <div className="admin-filter-meta">
        {resultCount !== undefined && <span>{resultCount} resultado{resultCount === 1 ? '' : 's'}</span>}
        <button type="button" className="link-button" onClick={() => onChange(DEFAULT_SHOWCASE_FILTERS)} disabled={!isDirty}>Limpiar</button>
      </div>
    </div>
  )
}

export default ShowcaseFilters
