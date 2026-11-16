import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAdminCategory } from '../../../Redux/slices/adminCatalogSlice';
import { normalizeText } from '../adminUtils';
const CategoryCreator = ({
  categories,
  onSelect
}) => {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Escribí el nombre de la categoría.');
      return Promise.resolve();
    }
    const existing = categories.find(category => normalizeText(category.description) === normalizeText(trimmed));
    if (existing) {
      onSelect(String(existing.id));
      setAdding(false);
      setName('');
      setError('');
      return Promise.resolve();
    }
    setBusy(true);
    setError('');
    return dispatch(createAdminCategory(trimmed)).unwrap().then(category => {
      onSelect(String(category.id));
      setAdding(false);
      setName('');
    }).catch(failure => {
      setError(failure.message || 'No se pudo crear la categoría.');
    }).finally(() => {
      setBusy(false);
    });
  };
  if (!adding) return <button type="button" className="link-button" onClick={() => setAdding(true)}>+ Nueva categoría</button>;
  return <div className="genre-create">
      <label htmlFor="vf-new-category">Nombre de la nueva categoría</label>
      <input id="vf-new-category" value={name} maxLength={255} autoFocus disabled={busy} aria-invalid={Boolean(error)} aria-describedby={error ? 'vf-new-category-error' : undefined} onChange={event => setName(event.target.value)} onKeyDown={event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (!busy) save();
      }
    }} />
      <button type="button" className="secondary-button small" disabled={busy} onClick={save}>{busy ? 'Creando…' : 'Crear categoría'}</button>
      <button type="button" className="link-button" disabled={busy} onClick={() => {
      setAdding(false);
      setError('');
    }}>Cancelar</button>
      {error && <p id="vf-new-category-error" className="field-error" role="alert">{error}</p>}
    </div>;
};
export default CategoryCreator;
