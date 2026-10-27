import { useState } from 'react';
import { createArtist, deleteArtist } from '../../../services/adminService';
import { normalizeText } from '../adminUtils';
const ArtistCreator = ({
  artists,
  onCreated,
  onSelect,
  selectedId,
  onDeleted
}) => {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [deletingArtist, setDeletingArtist] = useState(null);
  const selectedArtist = artists.find(artist => String(artist.id) === String(selectedId));
  const remove = () => {
    if (!deletingArtist || busy) return;
    const id = deletingArtist.id;
    setBusy(true);
    setError('');
    return deleteArtist(id)
      .then(() => {
        onDeleted(id);
        setDeletingArtist(null);
      })
      .catch(failure => setError(failure.message || 'No se pudo eliminar el artista.'))
      .finally(() => setBusy(false));
  };
  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Escribí el nombre del artista.');
      return Promise.resolve();
    }
    const existing = artists.find(artist => normalizeText(artist.name) === normalizeText(trimmed));
    if (existing) {
      onSelect(String(existing.id));
      setAdding(false);
      setName('');
      setError('');
      return Promise.resolve();
    }
    setBusy(true);
    setError('');
    return Promise.resolve(createArtist(trimmed)).then(artist => {
      onCreated(artist);
      onSelect(String(artist.id));
      setAdding(false);
      setName('');
    }).catch(failure => {
      setError(failure.message || 'No se pudo crear el artista.');
    }).finally(() => {
      setBusy(false);
    });
  };
  if (!adding) return <div className="artist-actions">
    <button type="button" className="link-button" disabled={busy} onClick={() => { setAdding(true); setError(''); setDeletingArtist(null); }}>+ Nuevo artista</button>
    {selectedArtist && !deletingArtist && <button type="button" className="link-button" disabled={busy} onClick={() => { setDeletingArtist(selectedArtist); setError(''); }}>Eliminar artista seleccionado</button>}
    {deletingArtist && <div className="artist-delete-confirm" role="group" aria-label="Confirmar eliminación de artista">
      <p>¿Eliminar a <strong>{deletingArtist.name}</strong>? Sus vinilos se conservarán y quedarán sin artista.</p>
      <button type="button" className="secondary-button small" disabled={busy} onClick={remove}>{busy ? 'Eliminando…' : 'Confirmar eliminación'}</button>
      <button type="button" className="link-button" disabled={busy} onClick={() => { setDeletingArtist(null); setError(''); }}>Cancelar</button>
    </div>}
    {error && <p className="field-error" role="alert">{error}</p>}
  </div>;
  return <div className="genre-create">
      <label htmlFor="vf-new-artist">Nombre del nuevo artista</label>
      <input id="vf-new-artist" value={name} maxLength={255} autoFocus disabled={busy} aria-invalid={Boolean(error)} aria-describedby={error ? 'vf-new-artist-error' : undefined} onChange={event => setName(event.target.value)} onKeyDown={event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (!busy) save();
      }
    }} />
      <button type="button" className="secondary-button small" disabled={busy} onClick={save}>{busy ? 'Creando…' : 'Crear artista'}</button>
      <button type="button" className="link-button" disabled={busy} onClick={() => {
      setAdding(false);
      setError('');
    }}>Cancelar</button>
      {error && <p id="vf-new-artist-error" className="field-error" role="alert">{error}</p>}
    </div>;
};
export default ArtistCreator;
