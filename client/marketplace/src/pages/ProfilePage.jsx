import { useContext, useEffect, useState } from 'react'
import { CartContext } from '../context/CartContext'
import { FavoritesContext } from '../context/FavoritesContext'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileStats from '../components/profile/ProfileStats'
import ProfileTabs from '../components/profile/ProfileTabs'
import AuthenticationCard from '../components/profile/AuthenticationCard'
import AddressBook from '../components/profile/AddressBook'
import CardBook from '../components/profile/CardBook'
import { updateProfile } from '../services/api'

const tabs = [
  { id: 'account', label: 'Mi cuenta' },
  { id: 'shipments', label: 'Direcciones' },
  { id: 'cards', label: 'Tarjetas' },
  { id: 'authentication', label: 'Seguridad' },
]

const ProfilePage = ({ user, onNavigate, onUserChange }) => {
  const { totalProducts } = useContext(CartContext)
  const { favorites } = useContext(FavoritesContext)
  const [activeTab, setActiveTab] = useState('account')
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFirstName(user?.firstName ?? '')
    setLastName(user?.lastName ?? '')
  }, [user?.id])

  const orders = user?.orders ?? []

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)
    try {
      const updatedUser = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
      onUserChange?.(updatedUser)
      setIsEditing(false)
      setMessage('Tus datos se actualizaron correctamente.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <section className="profile-empty">
        <p className="eyebrow">TU ESPACIO ONGAKU</p>
        <h1>Tu colección empieza acá.</h1>
        <p>Creá una cuenta para tener tu perfil y volver a tu música favorita.</p>
        <div className="profile-empty-actions">
          <button className="primary-button" onClick={() => onNavigate('register')}>Crear cuenta</button>
          <button className="secondary-button" onClick={() => onNavigate('login')}>Ya tengo una cuenta</button>
        </div>
      </section>
    )
  }

  return (
    <section className="profile-page">
      <p className="eyebrow">TU ESPACIO ONGAKU</p>
      <ProfileHeader user={user} />
      <ProfileStats orders={orders.length} favorites={favorites.length} cartProducts={totalProducts} />
      <ProfileTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="profile-panel">
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
        {activeTab === 'account' && (
          <section className="account-details" aria-labelledby="account-heading">
            <div>
              <p className="eyebrow">DATOS PERSONALES</p>
              <h2 id="account-heading">Tu cuenta</h2>
            </div>
            {isEditing ? (
              <form onSubmit={handleProfileSubmit}>
                <label htmlFor="profile-first-name">Nombre</label>
                <input id="profile-first-name" autoComplete="given-name" required value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                <label htmlFor="profile-last-name">Apellido</label>
                <input id="profile-last-name" autoComplete="family-name" required value={lastName} onChange={(event) => setLastName(event.target.value)} />
                <label htmlFor="profile-email">Correo electrónico</label>
                <input id="profile-email" type="email" value={user.email} readOnly />
                <p>Para cambiar el correo se necesita renovar la sesión; el backend actual todavía no devuelve un token nuevo.</p>
                <button className="primary-button" type="submit" disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
                <button className="secondary-button" type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
              </form>
            ) : (
              <>
                <dl>
                  <div><dt>Nombre</dt><dd>{user.name}</dd></div>
                  <div><dt>Correo electrónico</dt><dd>{user.email}</dd></div>
                </dl>
                <button className="secondary-button" type="button" onClick={() => setIsEditing(true)}>Editar perfil</button>
              </>
            )}
          </section>
        )}

        {activeTab === 'shipments' && (
          <section aria-labelledby="addresses-heading">
            <p className="eyebrow">ENTREGAS</p>
            <h2 id="addresses-heading">Direcciones de envío</h2>
            <AddressBook key={user.id} showHeading={false} />
          </section>
        )}

        {activeTab === 'cards' && <CardBook key={user.id} />}
        {activeTab === 'authentication' && <AuthenticationCard email={user.email} />}
      </div>
    </section>
  )
}

export default ProfilePage
