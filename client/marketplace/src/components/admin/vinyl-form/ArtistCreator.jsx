import { useState } from 'react'
import { createArtist } from '../../../services/adminService'
import { normalizeText } from '../adminUtils'

const ArtistCreator = ({ artists, onCreated, onSelect }) => {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const save = async () => {
    const trimmed = name.trim()
    if (!trimmed) { setError('Escribí el nombre del artista.'); return }
    const existing = artists.find((artist) => normalizeText(artist.name) === normalizeText(trimmed))
    if (existing) { onSelect(String(existing.id)); setAdding(false); setName(''); setError(''); return }
    setBusy(true)
    setError('')
    try {
      const artist = await createArtist(trimmed)
      onCreated(artist)
      onSelect(String(artist.id))
      setAdding(false)
      setName('')
    } catch (failure) { setError(failure.message || 'No se pudo crear el artista.') }
    finally { setBusy(false) }
  }

  if (!adding) return <button type="button" className="link-button" onClick={() => setAdding(true)}>+ Nuevo artista</button>
  return (
    <div className="genre-create">
      <label htmlFor="vf-new-artist">Nombre del nuevo artista</label>
      <input id="vf-new-artist" value={name} maxLength={255} autoFocus disabled={busy}
        aria-invalid={Boolean(error)} aria-describedby={error ? 'vf-new-artist-error' : undefined}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); if (!busy) save() } }} />
      <button type="button" className="secondary-button small" disabled={busy} onClick={save}>{busy ? 'Creando…' : 'Crear artista'}</button>
      <button type="button" className="link-button" disabled={busy} onClick={() => { setAdding(false); setError('') }}>Cancelar</button>
      {error && <p id="vf-new-artist-error" className="field-error" role="alert">{error}</p>}
    </div>
  )
}
export default ArtistCreator
