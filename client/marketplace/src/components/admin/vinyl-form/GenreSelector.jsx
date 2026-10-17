import { useState } from 'react'
import { createGenre } from '../../../services/adminService'
import { FieldError } from './VinylFormFields'
import { normalizeText } from '../adminUtils'

const GenreSelector = ({ value = [], onChange, genres = [], onGenreCreated, error }) => {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)

  const select = (id) => onChange(value.includes(id) ? value : [...value, id])

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name) {
      setCreateError('Escribí el nombre del género.')
      return
    }
    const existing = genres.find((genre) => normalizeText(genre.name) === normalizeText(name))
    if (existing) {
      select(String(existing.id))
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
      select(String(genre.id))
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
      <span className="vf-label" id="vf-genre-label">Géneros (podés elegir varios)</span>
      <div className="genre-chips" role="group" aria-labelledby="vf-genre-label" aria-describedby={error ? 'vf-genreId-error' : undefined}>
        {(
          <button
            type="button"
            role="checkbox"
            aria-checked={value.length === 0}
            className={`genre-chip${value.length === 0 ? ' is-selected' : ''}`}
            onClick={() => onChange([])}
          >
            Sin género
          </button>
        )}
        {genres.map((genre) => {
          const selected = value.includes(String(genre.id))
          return (
            <button
              key={genre.id}
              type="button"
              role="checkbox"
              aria-checked={selected}
              className={`genre-chip${selected ? ' is-selected' : ''}`}
              onClick={() => onChange(selected ? value.filter((id) => id !== String(genre.id)) : [...value, String(genre.id)])}
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
