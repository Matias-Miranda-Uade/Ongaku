import { useEffect, useState } from 'react'
import { deleteAddress, getAddresses, saveAddress } from '../../services/api'

const empty = { recipient: '', street: '', city: '', province: '', zipCode: '', country: 'Argentina', phone: '', instructions: '' }
const fields = [
  ['recipient', 'Nombre de quien recibe', 'name', 120], ['street', 'Calle y número, piso / departamento', 'street-address', 200],
  ['city', 'Localidad', 'address-level2', 100], ['province', 'Provincia', 'address-level1', 100],
  ['zipCode', 'Código postal', 'postal-code', 20], ['country', 'País', 'country-name', 100],
  ['phone', 'Teléfono de contacto', 'tel', 40], ['instructions', 'Indicaciones adicionales (opcional)', 'off', 500],
]

const AddressBook = ({ selectable = false, selectedId, onSelect }) => {
  const [addresses, setAddresses] = useState([])
  const [form, setForm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const refresh = async () => {
    setLoading(true)
    try {
      const data = await getAddresses()
      setAddresses(data)
      if (selectable && !data.some((address) => address.id === selectedId)) onSelect(data[0]?.id ?? null)
    } catch (requestError) { setError(requestError.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { refresh() }, [])

  const submit = async (event) => {
    event.preventDefault()
    if (pending) return
    setPending(true); setError('')
    try {
      const saved = await saveAddress(form, editingId)
      setForm(null)
      if (selectable) onSelect(saved.id)
      const data = await getAddresses()
      setAddresses(data)
    } catch (requestError) { setError(requestError.message) }
    finally { setPending(false) }
  }
  const remove = async (id) => {
    setPending(true); setError('')
    try {
      await deleteAddress(id)
      const remaining = addresses.filter((address) => address.id !== id)
      setAddresses(remaining)
      if (selectable && selectedId === id) onSelect(remaining[0]?.id ?? null)
      if (editingId === id) setForm(null)
    } catch (requestError) { setError(requestError.message) }
    finally { setPending(false) }
  }

  return (
    <section className="address-book">
      <h2>{selectable ? '¿Dónde querés recibir tu compra?' : 'Direcciones de envío'}</h2>
      {error && <div role="alert"><p>{error}</p><button type="button" onClick={refresh} disabled={pending}>Reintentar</button></div>}
      {loading && <p role="status">Cargando direcciones…</p>}
      {!loading && !addresses.length && <p>Agregá una dirección para recibir tus vinilos.</p>}
      {addresses.map(({ id, details }) => (
        <article className="shipment-card" key={id}>
          {selectable && <label><input type="radio" name="shipping-address" checked={selectedId === id} disabled={pending || loading} onChange={() => onSelect(id)} /> Enviar a esta dirección</label>}
          <h3>{details.recipient}</h3><p>{details.street}</p>
          <p>{details.city}, {details.province}, {details.zipCode}, {details.country}</p>
          <p>{details.phone}</p>{details.instructions && <p>{details.instructions}</p>}
          <button className="secondary-button" type="button" disabled={pending} onClick={() => { setEditingId(id); setForm({ ...details }); setError('') }}>Editar</button>
          <button className="secondary-button" type="button" disabled={pending} onClick={() => remove(id)}>Eliminar</button>
        </article>
      ))}
      {!form && <button className="secondary-button" type="button" disabled={pending || loading} onClick={() => { setEditingId(null); setForm({ ...empty }); setError('') }}>Agregar dirección</button>}
      {form && <form className="address-form" onSubmit={submit}>
        {fields.map(([name, label, autocomplete, maxLength]) => <label key={name} htmlFor={`address-${name}`}>
          {label}<input id={`address-${name}`} name={name} type={name === 'phone' ? 'tel' : 'text'} autoComplete={autocomplete} required={name !== 'instructions'} maxLength={maxLength} disabled={pending} value={form[name] ?? ''} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} />
        </label>)}
        <button className="primary-button" type="submit" disabled={pending}>{pending ? 'Guardando…' : 'Guardar dirección'}</button>
        <button className="secondary-button" type="button" disabled={pending} onClick={() => setForm(null)}>Cancelar</button>
      </form>}
    </section>
  )
}

export default AddressBook
