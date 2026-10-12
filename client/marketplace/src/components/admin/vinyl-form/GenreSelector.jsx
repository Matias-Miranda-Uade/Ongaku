import { useState } from 'react'
import { createGenre } from '../../../services/adminService'
import { FieldError } from './VinylFormFields'
import { normalizeText } from '../adminUtils'

const GenreSelector = ({ value, onChange, genres = [], onGenreCreated, error, locked = false }) => {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name) {
      setCreateError('Escribí el nombre del género.')
      return
    }
    const existing = genres.find((genre) => normalizeText(genre.name) === normalizeText(name))
    if (existing) {
      onChange(String(existing.id))
      setAdding(false)
      setNewName('')
      setCreateError('')
      return
    }
    setCreating(true)
    setCreateError('')
    try {
      const genre = await createGenre(name)
      onGenreCreated?.(genre)
      onChange(String(genre.id))
      setAdding(false)
      setNewName('')
    } catch (genreError) {
      setCreateError(genreError.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="vf-field vf-span-2 genre-selector">
      <span className="vf-label" id="vf-genre-label">Género</span>
      <div className="genre-chips" role="radiogroup" aria-labelledby="vf-genre-label" aria-describedby={error ? 'vf-genreId-error' : undefined}>
        {!locked && (
          <button
            type="button"
            role="radio"
            aria-checked={value === ''}
            className={`genre-chip${value === '' ? ' is-selected' : ''}`}
            onClick={() => onChange('')}
          >
            Sin género
          </button>
        )}
        {genres.map((genre) => {
          const selected = String(genre.id) === value
          return (
            <button
              key={genre.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`genre-chip${selected ? ' is-selected' : ''}`}
              onClick={() => onChange(String(genre.id))}
            >
              {genre.name}
            </button>
          )
        })}
        {!adding && (
          <button type="button" className="genre-chip genre-chip-add" onClick={() => setAdding(true)}>
            + Nuevo género
          </button>
        )}
      </div>

      {adding && (
        <div className="genre-create">
          <label className="sr-only" htmlFor="vf-new-genre">Nombre del nuevo género</label>
          <input
            id="vf-new-genre"
            type="text"
            value={newName}
            maxLength={80}
            autoFocus
            placeholder="Ej.: City Pop"
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') { event.preventDefault(); handleCreate() }
              if (event.key === 'Escape') { setAdding(false); setCreateError('') }
            }}
          />
          <button type="button" className="secondary-button small" onClick={handleCreate} disabled={creating}>
            {creating ? 'Creando…' : 'Crear'}
          </button>
          <button type="button" className="link-button" onClick={() => { setAdding(false); setCreateError('') }}>Cancelar</button>
          <FieldError id="vf-new-genre-error" message={createError} />
        </div>
      )}
      <FieldError id="vf-genreId-error" message={error} />
    </div>
  )
}

export default GenreSelector
