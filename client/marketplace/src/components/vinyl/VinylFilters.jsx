const VinylFilters = ({ filters, onChange, onClear }) => (
  <section className="filters" aria-label="Filtros de catálogo">
    <label className="search-field">
      <span>BUSCAR</span>
      <input
        value={filters.search}
        onChange={(event) => onChange('search', event.target.value)}
        placeholder="Título o artista"
      />
    </label>

    <label>
      <span>DISPONIBILIDAD</span>
      <select value={filters.stock} onChange={(event) => onChange('stock', event.target.value)}>
        <option value="all">Todos</option>
        <option value="available">En stock</option>
        <option value="unavailable">Sin stock</option>
      </select>
    </label>

    <label>
      <span>ORDEN</span>
      <select value={filters.sort} onChange={(event) => onChange('sort', event.target.value)}>
        <option value="featured">Selección</option>
        <option value="price-asc">Precio: menor a mayor</option>
        <option value="price-desc">Precio: mayor a menor</option>
        <option value="year-desc">Más nuevos</option>
      </select>
    </label>

    <button type="button" className="clear-button" onClick={onClear}>LIMPIAR</button>
  </section>
)
export default VinylFilters
