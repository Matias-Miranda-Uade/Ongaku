import { MIN_YEAR, maxYear } from './vinylFormModel'
import ArtistCreator from './ArtistCreator'
import CategoryCreator from './CategoryCreator'

export const FieldError = ({ id, message }) =>
  message ? <p className="field-error" id={id} role="alert">{message}</p> : null

export const fieldA11y = (name, error, hintId) => ({
  id: `vf-${name}`,
  name,
  'aria-invalid': Boolean(error) || undefined,
  'aria-describedby': [error ? `vf-${name}-error` : null, hintId].filter(Boolean).join(' ') || undefined,
})

const VinylFormFields = ({ values, errors, onChange, onBlur, onArtistCreated, onCategoryCreated, artists = [], categories = [], lockedRelations = {} }) => (
  <fieldset className="vf-section">
    <legend><span className="vf-step">01</span> Datos del disco</legend>

    <div className="vf-field vf-span-2">
      <label htmlFor="vf-name">Título <span className="vf-required" aria-hidden="true">*</span></label>
      <input
        {...fieldA11y('name', errors.name)}
        type="text"
        value={values.name}
        maxLength={255}
        autoComplete="off"
        required
        placeholder="Ej.: Kind of Blue (Edición 180 g)"
        onChange={(event) => onChange('name', event.target.value)}
        onBlur={() => onBlur('name')}
      />
      <FieldError id="vf-name-error" message={errors.name} />
    </div>

    <div className="vf-field">
      <label htmlFor="vf-artistId">Artista</label>
      <select
        {...fieldA11y('artistId', errors.artistId)}
        value={values.artistId}
        onChange={(event) => onChange('artistId', event.target.value)}
        onBlur={() => onBlur('artistId')}
      >
        <option value="" disabled={lockedRelations.artistId}>Sin artista</option>
        {artists.map((artist) => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
      </select>
      {artists.length === 0 && <p className="vf-hint">No hay artistas cargados en el catálogo.</p>}
      <FieldError id="vf-artistId-error" message={errors.artistId} />
      <ArtistCreator artists={artists} onCreated={onArtistCreated} onSelect={(id) => onChange('artistId', id)} />
    </div>

    <div className="vf-field">
      <label htmlFor="vf-year">Año de edición <span className="vf-required" aria-hidden="true">*</span></label>
      <input
        {...fieldA11y('year', errors.year)}
        type="number"
        inputMode="numeric"
        min={MIN_YEAR}
        max={maxYear()}
        step="1"
        required
        value={values.year}
        placeholder={String(new Date().getFullYear())}
        onChange={(event) => onChange('year', event.target.value)}
        onBlur={() => onBlur('year')}
      />
      <FieldError id="vf-year-error" message={errors.year} />
    </div>

    <div className="vf-field vf-span-2">
      <label htmlFor="vf-categoryId">Categoría</label>
      <select
        {...fieldA11y('categoryId', errors.categoryId)}
        value={values.categoryId}
        onChange={(event) => onChange('categoryId', event.target.value)}
        onBlur={() => onBlur('categoryId')}
      >
        <option value="">Sin categoría</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.description}</option>)}
      </select>
      <FieldError id="vf-categoryId-error" message={errors.categoryId} />
      {categories.length === 0 && <p className="vf-hint">No hay categorías cargadas. Podés crear una abajo.</p>}
      <CategoryCreator categories={categories} onCreated={onCategoryCreated} onSelect={(id) => onChange('categoryId', id)} />
    </div>
  </fieldset>
)

export default VinylFormFields
