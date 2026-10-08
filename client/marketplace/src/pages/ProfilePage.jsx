import { useState } from 'react'
import useCart from '../hooks/useCart'
import useFavorites from '../hooks/useFavorites'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileStats from '../components/profile/ProfileStats'
import ProfileTabs from '../components/profile/ProfileTabs'
import AuthenticationCard from '../components/profile/AuthenticationCard'

const tabs = [
  { id: 'account', label: 'Mi cuenta' },
  { id: 'shipments', label: 'Direcciones' },
  { id: 'authentication', label: 'Seguridad' },
]

const ProfilePage = ({ user, onNavigate }) => {
  const { totalProducts } = useCart()
  const { favorites } = useFavorites()
  const [activeTab, setActiveTab] = useState('account')
  const orders = user?.orders ?? []
  const addresses = user?.addresses ?? []

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
        {activeTab === 'account' && (
          <section className="account-details" aria-labelledby="account-heading">
            <div>
              <p className="eyebrow">DATOS PERSONALES</p>
              <h2 id="account-heading">Tu cuenta</h2>
            </div>
            <dl>
              <div><dt>Nombre</dt><dd>{user.name}</dd></div>
              <div><dt>Correo electrónico</dt><dd>{user.email || 'No asociado a esta cuenta de prueba'}</dd></div>
              <div>
                <dt>Miembro desde</dt>
                <dd>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-AR') : 'Hoy'}</dd>
              </div>
            </dl>
          </section>
        )}

        {activeTab === 'shipments' && (
          <section aria-labelledby="addresses-heading">
            <p className="eyebrow">ENTREGAS</p>
            <h2 id="addresses-heading">Direcciones de envío</h2>
            {addresses.length === 0
              ? <div className="profile-tab-empty">
                  <p>Todavía no agregaste una dirección.</p>
                  <p>El checkout de esta demostración todavía no administra direcciones de envío.</p>
                </div>
              : addresses.map((address) => (
                  <article className="shipment-card" key={address.id}>
                    <h3>{address.street}</h3>
                    <p>{address.city}, {address.province} ({address.zipCode})</p>
                    {address.isDefault && <span className="badge">Predeterminada</span>}
                  </article>
                ))
            }
          </section>
        )}

        {activeTab === 'authentication' && <AuthenticationCard email={user.email} />}
      </div>
    </section>
  )
}

export default ProfilePage
