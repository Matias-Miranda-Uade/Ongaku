import { useEffect, useState } from 'react';
import { deleteAddress, getAddresses, saveAddress } from '../../services/api';
import { normalizeAddress, validateAddress } from './addressValidation';
const empty = {
  recipient: '',
  street: '',
  city: '',
  province: '',
  zipCode: '',
  country: 'Argentina',
  phone: '',
  instructions: ''
};
const fields = [['recipient', 'Nombre de quien recibe', 'name', 120], ['street', 'Calle y número, piso / departamento', 'street-address', 200], ['city', 'Localidad', 'address-level2', 100], ['province', 'Provincia', 'address-level1', 100], ['zipCode', 'Código postal', 'postal-code', 20], ['country', 'País', 'country-name', 100], ['phone', 'Teléfono de contacto', 'tel', 40], ['instructions', 'Indicaciones adicionales (opcional)', 'off', 500]];
const AddressBook = ({
  selectable = false,
  selectedId,
  onSelect,
  showHeading = true,
  disabled = false
}) => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const blocked = pending || disabled;
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const beginForm = (details, id = null) => {
    setEditingId(id);
    setForm({
      ...details
    });
    setError('');
    setFieldErrors({});
  };
  const refresh = () => {
    setLoading(true);
    return Promise.resolve(getAddresses()).then(data => {
      setAddresses(data);
      if (selectable && !data.some(address => String(address.id) === String(selectedId))) onSelect(data[0]?.id ?? null);
    }).catch(requestError => {
      setError(requestError.message);
    }).finally(() => {
      setLoading(false);
    });
  };
  useEffect(() => {
    refresh();
  }, []);
  const submit = event => {
    event.preventDefault();
    if (blocked) return Promise.resolve();
    const validation = validateAddress(form);
    setFieldErrors(validation);
    if (Object.keys(validation).length) {
      setError('Revisá los campos marcados antes de guardar.');
      return Promise.resolve();
    }
    const normalized = normalizeAddress(form);
    const recipient = normalized.recipient.replace(/\s+/g, ' ').toLowerCase();
    const phone = normalized.phone.replace(/\D/g, '');
    const duplicate = addresses.some(({
      id,
      details
    }) => String(id) !== String(editingId) && details.recipient.trim().replace(/\s+/g, ' ').toLowerCase() === recipient && details.phone.replace(/\D/g, '') === phone);
    if (duplicate) {
      setFieldErrors({
        recipient: 'Ya existe una dirección con este nombre y teléfono.',
        phone: 'Ya existe una dirección con este nombre y teléfono.'
      });
      setError('No se pueden guardar direcciones repetidas para la misma persona y teléfono.');
      return Promise.resolve();
    }
    setPending(true);
    setError('');
    return Promise.resolve(saveAddress(normalized, editingId)).then(saved => {
      setForm(null);
      if (selectable) onSelect(saved.id);
      return Promise.resolve(getAddresses()).then(data => {
        setAddresses(data);
      });
    }).catch(requestError => {
      setError(requestError.message);
      setFieldErrors(Object.fromEntries(Object.entries(requestError.fieldErrors ?? {}).map(([field, message]) => [field === 'zipCodeValid' ? 'zipCode' : field === 'phoneValid' ? 'phone' : field, message])));
    }).finally(() => {
      setPending(false);
    });
  };
  const remove = id => {
    setPending(true);
    setError('');
    return Promise.resolve(deleteAddress(id)).then(() => {
      const remaining = addresses.filter(address => address.id !== id);
      setAddresses(remaining);
      if (selectable && selectedId === id) onSelect(remaining[0]?.id ?? null);
      if (editingId === id) setForm(null);
    }).catch(requestError => {
      setError(requestError.message);
    }).finally(() => {
      setPending(false);
    });
  };
  return <section className="address-book">
      {showHeading && <h2>{selectable ? '¿Dónde querés recibir tu compra?' : 'Direcciones de envío'}</h2>}
      {error && <div role="alert"><p>{error}</p><button type="button" onClick={refresh} disabled={blocked}>Reintentar</button></div>}
      {loading && <p role="status">Cargando direcciones…</p>}
      {!loading && !addresses.length && <p>Agregá una dirección para recibir tus vinilos.</p>}
      {addresses.map(({
      id,
      details
    }) => <article className={`shipment-card${selectable && String(selectedId) === String(id) ? ' is-selected' : ''}`} key={id}>
          {selectable && <label className="shipment-select">
            <input type="radio" name="shipping-address" checked={String(selectedId) === String(id)} disabled={blocked || loading} onChange={() => onSelect(id)} />
            <span>{String(selectedId) === String(id) ? 'Dirección seleccionada para el envío' : 'Enviar a esta dirección'}</span>
          </label>}
          <h3>{details.recipient}</h3><p>{details.street}</p>
          <p>{details.city}, {details.province}, {details.zipCode}, {details.country}</p>
          <p>{details.phone}</p>{details.instructions && <p>{details.instructions}</p>}
          <button className="secondary-button" type="button" disabled={blocked} onClick={() => beginForm(details, id)}>Editar</button>
          <button className="secondary-button" type="button" disabled={blocked} onClick={() => remove(id)}>Eliminar</button>
        </article>)}
      {!form && <button className="secondary-button" type="button" disabled={blocked || loading} onClick={() => beginForm(empty)}>Agregar dirección</button>}
      {form && <form className="address-form" onSubmit={submit} noValidate>
        {fields.map(([name, label, autocomplete, maxLength]) => <label key={name} htmlFor={`address-${name}`}>
          {label}<input id={`address-${name}`} name={name} type={name === 'phone' ? 'tel' : 'text'} inputMode={name === 'phone' ? 'tel' : 'text'} autoComplete={autocomplete} required={name !== 'instructions'} maxLength={maxLength} disabled={blocked} aria-invalid={Boolean(fieldErrors[name])} aria-describedby={fieldErrors[name] ? `address-${name}-error` : undefined} value={form[name] ?? ''} onChange={event => {
          setForm(current => ({
            ...current,
            [name]: event.target.value
          }));
          setFieldErrors(current => ({
            ...current,
            [name]: undefined
          }));
        }} />
          {fieldErrors[name] && <span className="address-field-error" id={`address-${name}-error`}>{fieldErrors[name]}</span>}
          {name === 'zipCode' && <span className="address-field-hint">Argentina: 1000 o C1000ABC. Se guarda en mayúsculas. <a href="https://www.correoargentino.com.ar/formularios/cpa" target="_blank" rel="noreferrer">Consultar CPA</a></span>}
        </label>)}
        <button className="primary-button" type="submit" disabled={blocked}>{pending ? 'Guardando…' : 'Guardar dirección'}</button>
        <button className="secondary-button" type="button" disabled={blocked} onClick={() => setForm(null)}>Cancelar</button>
      </form>}
    </section>;
};
export default AddressBook;
