import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { deleteCard, getSavedCards, saveCard } from '../../services/api'
import { emptySavedCard, toSavedCardPayload, validateSavedCard } from './savedCardModel'

const CardBook = ({ selectable = false, selectedId, preferredId, onSelect, showHeading = true, disabled = false }) => {
  const { user, isAdmin } = useContext(AuthContext)
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [reload, setReload] = useState(0)
  const blocked = disabled || pending

  useEffect(() => {
    let active = true
    setLoading(true); setError(''); setCards([])
    if (!user || isAdmin) { setLoading(false); return }
    getSavedCards().then((data) => {
      if (!active) return
      setCards(data)
      if (selectable) {
        const preferred = data.find((card) => card.id === (selectedId ?? preferredId) && !card.expired)
        onSelect(preferred?.id ?? null)
      }
    }).catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [user?.id, isAdmin, reload])

  const edit = (card) => {
    setEditingId(card?.id ?? null)
    setForm(card ? { holder: card.holder, brand: card.brand, lastFour: card.lastFour, expiry: `${card.expiryYear}-${String(card.expiryMonth).padStart(2, '0')}` } : { ...emptySavedCard })
    setError(''); setFieldErrors({})
  }
  const submit = async (event) => {
    event.preventDefault()
    if (blocked) return
    const errors = validateSavedCard(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length) return
    setPending(true); setError('')
    try {
      const saved = await saveCard(toSavedCardPayload(form), editingId)
      setCards((current) => editingId == null ? [...current, saved] : current.map((card) => card.id === saved.id ? saved : card))
      setForm(null)
      if (selectable) onSelect(saved.id)
    } catch (requestError) { setError(requestError.message) }
    finally { setPending(false) }
  }
  const remove = async (id) => {
    if (blocked) return
    setPending(true); setError('')
    try {
      await deleteCard(id)
      setCards((current) => current.filter((card) => card.id !== id))
      if (selectable && selectedId === id) onSelect(null)
      if (editingId === id) setForm(null)
    } catch (requestError) { setError(requestError.message) }
    finally { setPending(false) }
  }

  if (isAdmin) return <p>Las tarjetas de pago están disponibles para cuentas compradoras.</p>
  if (!user) return <p>Iniciá sesión para guardar tarjetas de prueba.</p>
  return (
    <section className="card-book">
      {showHeading && <h2>{selectable ? 'Elegí una tarjeta guardada' : 'Tarjetas guardadas'}</h2>}
      <p>Pagos de prueba, sin cargos reales. Solo guardamos titular, marca, últimos cuatro dígitos y vencimiento. No ingreses números completos ni códigos de seguridad.</p>
      {error && <div role="alert"><p>{error}</p><button type="button" disabled={blocked} onClick={() => setReload((value) => value + 1)}>Reintentar</button></div>}
      {loading && <p role="status">Cargando tarjetas…</p>}
      {!loading && !cards.length && <p>Todavía no guardaste tarjetas.</p>}
      {selectable && <label className="saved-card-choice"><input type="radio" name="saved-card" disabled={blocked || loading} checked={selectedId == null} onChange={() => onSelect(null)} /> Usar datos de prueba sin tarjeta guardada</label>}
      {cards.map((card) => <article className="shipment-card saved-card" key={card.id}>
        {selectable && <label className="saved-card-choice"><input type="radio" name="saved-card" checked={selectedId === card.id} disabled={blocked || loading || card.expired} onChange={() => onSelect(card.id)} /> Usar esta tarjeta</label>}
        <h3>{card.brand} · •••• {card.lastFour}</h3><p>{card.holder}</p>
        <p>Vence {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}{card.expired ? ' · Vencida' : ''}</p>
        <button className="secondary-button" type="button" disabled={blocked} onClick={() => edit(card)}>Editar</button>
        <button className="secondary-button" type="button" disabled={blocked} onClick={() => remove(card.id)}>Eliminar</button>
      </article>)}
      {!form && <button className="secondary-button" type="button" disabled={blocked || loading} onClick={() => edit(null)}>Agregar tarjeta de prueba</button>}
      {form && <form className="address-form" onSubmit={submit} noValidate>
        <label htmlFor="saved-card-holder">Titular<input id="saved-card-holder" autoComplete="off" maxLength={120} value={form.holder} disabled={blocked} aria-invalid={Boolean(fieldErrors.holder)} onChange={(event) => setForm({ ...form, holder: event.target.value })} />{fieldErrors.holder && <span className="address-field-error">{fieldErrors.holder}</span>}</label>
        <label htmlFor="saved-card-brand">Marca<select id="saved-card-brand" value={form.brand} disabled={blocked} onChange={(event) => setForm({ ...form, brand: event.target.value })}><option value="VISA">Visa</option><option value="MASTERCARD">Mastercard</option><option value="AMEX">American Express</option></select>{fieldErrors.brand && <span className="address-field-error">{fieldErrors.brand}</span>}</label>
        <label htmlFor="saved-card-last-four">Últimos cuatro dígitos<input id="saved-card-last-four" autoComplete="off" inputMode="numeric" maxLength={4} value={form.lastFour} disabled={blocked} aria-invalid={Boolean(fieldErrors.lastFour)} onChange={(event) => setForm({ ...form, lastFour: event.target.value.replace(/\D/g, '') })} />{fieldErrors.lastFour && <span className="address-field-error">{fieldErrors.lastFour}</span>}</label>
        <label htmlFor="saved-card-expiry">Vencimiento<input id="saved-card-expiry" type="month" min={`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}`} max="2099-12" value={form.expiry} disabled={blocked} aria-invalid={Boolean(fieldErrors.expiry)} onChange={(event) => setForm({ ...form, expiry: event.target.value })} />{fieldErrors.expiry && <span className="address-field-error">{fieldErrors.expiry}</span>}</label>
        <button className="primary-button" type="submit" disabled={blocked}>{pending ? 'Guardando…' : 'Guardar tarjeta de prueba'}</button>
        <button className="secondary-button" type="button" disabled={blocked} onClick={() => setForm(null)}>Cancelar</button>
      </form>}
    </section>
  )
}

export default CardBook
