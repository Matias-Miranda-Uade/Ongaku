import { matchesMood, moods } from '../experiences/musicDiscovery'
import './moodFilter.css'

const VinylFilters = ({ filters, onChange, onClear, vinyls = [] }) => (
  <section className="filters has-mood-filter" aria-label="Filtros de catálogo">
    <label className="search-field">
      <span>BUSCAR</span>
      <input
        id="catalog-search"
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
      <span>ÁNIMO</span>
      <select value={filters.mood || ''} onChange={(event) => onChange('mood', event.target.value)}>
        <option value="">Todos los ánimos</option>
        {moods.map(mood => <option key={mood.id} value={mood.id}>{mood.name} ({vinyls.filter(vinyl => matchesMood(vinyl, mood.id)).length})</option>)}
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
