import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAdminGenre, deleteAdminGenre } from '../../../Redux/slices/adminCatalogSlice';
import { FieldError } from './VinylFormFields';
import { normalizeText } from '../adminUtils';
const GenreSelector = ({
  value = [],
  onChange,
  genres = [],
  error
}) => {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeId, setRemoveId] = useState('');
  const [removeError, setRemoveError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const removeTarget = genres.find(genre => String(genre.id) === removeId);
  const closeRemove = () => {
    setRemoving(false);
    setRemoveId('');
    setRemoveError('');
  };
  const handleDelete = () => {
    if (!removeTarget || deleting) return Promise.resolve();
    const id = String(removeTarget.id);
    setDeleting(true);
    setRemoveError('');
    return dispatch(deleteAdminGenre({ genreId: removeTarget.id })).unwrap().then(() => {
      if (value.includes(id)) onChange(value.filter(item => item !== id));
      closeRemove();
    }).catch(failure => {
      setRemoveError(failure.message || 'No se pudo eliminar el género.');
    }).finally(() => {
      setDeleting(false);
    });
  };
  const select = id => onChange(value.includes(id) ? value : [...value, id]);
  const handleCreate = () => {
    const name = newName.trim();
    if (!name) {
      setCreateError('Escribí el nombre del género.');
      return Promise.resolve();
    }
    const existing = genres.find(genre => normalizeText(genre.name) === normalizeText(name));
    if (existing) {
      select(String(existing.id));
      setAdding(false);
      setNewName('');
      setCreateError('');
      return Promise.resolve();
    }
    setCreating(true);
    setCreateError('');
    return dispatch(createAdminGenre(name)).unwrap().then(genre => {
      select(String(genre.id));
      setAdding(false);
      setNewName('');
    }).catch(genreError => {
      setCreateError(genreError.message);
    }).finally(() => {
      setCreating(false);
    });
  };
  return <div className="vf-field vf-span-2 genre-selector">
      <span className="vf-label" id="vf-genre-label">Géneros (podés elegir varios)</span>
      <div className="genre-chips" role="group" aria-labelledby="vf-genre-label" aria-describedby={error ? 'vf-genreId-error' : undefined}>
        {<button type="button" role="checkbox" aria-checked={value.length === 0} className={`genre-chip${value.length === 0 ? ' is-selected' : ''}`} onClick={() => onChange([])}>
            Sin género
          </button>}
        {genres.map(genre => {
        const selected = value.includes(String(genre.id));
        return <button key={genre.id} type="button" role="checkbox" aria-checked={selected} className={`genre-chip${selected ? ' is-selected' : ''}`} onClick={() => onChange(selected ? value.filter(id => id !== String(genre.id)) : [...value, String(genre.id)])}>
              {genre.name}
            </button>;
      })}
        {!adding && <button type="button" className="genre-chip genre-chip-add" onClick={() => {
          setAdding(true);
          closeRemove();
        }}>
            + Nuevo género
          </button>}
      </div>

      {!adding && !removing && genres.length > 0 && <div className="artist-actions">
          <button type="button" className="link-button" onClick={() => setRemoving(true)}>Eliminar un género</button>
        </div>}
      {removing && <div className="artist-delete-confirm" role="group" aria-label="Eliminar género">
          <label htmlFor="vf-remove-genre">Género a eliminar</label>
          <select id="vf-remove-genre" value={removeId} disabled={deleting} onChange={event => {
          setRemoveId(event.target.value);
          setRemoveError('');
        }}>
            <option value="">Elegí un género</option>
            {genres.map(genre => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
          </select>
          {removeTarget && <p>¿Eliminar el género <strong>{removeTarget.name}</strong>? Sus vinilos se conservarán sin ese género.</p>}
          <button type="button" className="secondary-button small" disabled={!removeTarget || deleting} onClick={handleDelete}>
            {deleting ? 'Eliminando…' : 'Confirmar eliminación'}
          </button>
          <button type="button" className="link-button" disabled={deleting} onClick={closeRemove}>Cancelar</button>
          <FieldError id="vf-remove-genre-error" message={removeError} />
        </div>}

      {adding && <div className="genre-create">
          <label className="sr-only" htmlFor="vf-new-genre">Nombre del nuevo género</label>
          <input id="vf-new-genre" type="text" value={newName} maxLength={80} autoFocus placeholder="Ej.: City Pop" onChange={event => setNewName(event.target.value)} onKeyDown={event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleCreate();
        }
        if (event.key === 'Escape') {
          setAdding(false);
          setCreateError('');
        }
      }} />
          <button type="button" className="secondary-button small" onClick={handleCreate} disabled={creating}>
            {creating ? 'Creando…' : 'Crear'}
          </button>
          <button type="button" className="link-button" onClick={() => {
        setAdding(false);
        setCreateError('');
      }}>Cancelar</button>
          <FieldError id="vf-new-genre-error" message={createError} />
        </div>}
      <FieldError id="vf-genreId-error" message={error} />
    </div>;
};
export default GenreSelector;
