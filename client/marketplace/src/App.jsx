import { useEffect, useState } from 'react'
import './App.css'
import './persona2.css'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import PageContainer from './components/layout/PageContainer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import FavoritesPage from './pages/FavoritesPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import CatalogPage from './pages/CatalogPage'
import VinylDetailPage from './pages/VinylDetailPage'
import ReviewsPage from './pages/ReviewsPage'

const USER_STORAGE_KEY = 'ongaku-user-profile'

const readStoredUser = () => {
  try {
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY)
    if (!storedUser) return { user: null, error: '' }

    const user = JSON.parse(storedUser)
    if (!user || typeof user.name !== 'string' || typeof user.email !== 'string') {
      throw new Error('El perfil guardado no tiene un formato válido.')
    }

    return { user, error: '' }
  } catch (error) {
    console.error('No se pudo recuperar el perfil guardado de Ongaku.', error)
    return {
      user: null,
      error: 'No pudimos recuperar tu perfil guardado. Podés volver a registrarte.',
    }
  }
}

const createUserProfile = ({ name, email }) => {
  const normalizedName = name.trim()
  const [firstName = '', ...lastNames] = normalizedName.split(/\s+/)

  return {
    id: `${Date.now()}`,
    name: normalizedName,
    firstName,
    lastName: lastNames.join(' '),
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  }
}

const App = () => {
  const [page, setPage] = useState('home')
  const [storedSession] = useState(readStoredUser)
  const [user, setUser] = useState(storedSession.user)
  const [storageError, setStorageError] = useState(storedSession.error)
  const [selectedVinylId, setSelectedVinylId] = useState(null)

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      } else {
        window.localStorage.removeItem(USER_STORAGE_KEY)
      }
    } catch (error) {
      console.error('No se pudo guardar el perfil de Ongaku en este navegador.', error)
      setStorageError('No pudimos guardar tu perfil en este navegador. Seguirá disponible hasta cerrar la página.')
    }
  }, [user])

  const openPage = (nextPage) => {
    setSelectedVinylId(null)
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openVinyl = (vinylId) => {
    setSelectedVinylId(vinylId)
    setPage('vinyl-detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = (newUser) => {
    setStorageError('')
    setUser(createUserProfile(newUser))
    openPage('home')
  }

  const handleRegister = (newUser) => {
    setStorageError('')
    setUser(createUserProfile(newUser))
    openPage('profile')
  }

  const handleLogout = () => {
    setUser(null)
    openPage('home')
  }

  const handleCheckout = ({ items, total }) => {
    if (!user) {
      openPage('login')
      return false
    }

    const order = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'PENDIENTE',
      items: items.map((item) => ({
        vinylId: item.id,
        name: item.name,
        artistName: item.artistName || item.artist,
        unitPrice: item.price,
        quantity: item.quantity,
        review: null,
      })),
      total,
      shippingAddress: null,
      payment: null,
      trackingCode: null,
    }

    setUser((currentUser) => ({
      ...currentUser,
      orders: [order, ...(currentUser.orders ?? [])],
    }))
    openPage('orders')
    return true
  }

  const handleOrdersChange = (orders) => {
    setUser((currentUser) => currentUser ? { ...currentUser, orders } : currentUser)
  }

  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="app-shell">
          <Header page={page} onNavigate={openPage} user={user} onLogout={handleLogout} />
          {storageError && <p className="storage-notice" role="status">{storageError}</p>}
          <PageContainer>
            {page === 'home' && <HomePage user={user} onNavigate={openPage} />}
            {page === 'login' && <LoginPage onNavigate={openPage} onLogin={handleLogin} />}
            {page === 'register' && <RegisterPage onNavigate={openPage} onRegister={handleRegister} />}
            {page === 'catalog' && <CatalogPage onOpenVinyl={openVinyl} />}
            {page === 'vinyl-detail' && selectedVinylId && (
              <VinylDetailPage
                vinylId={selectedVinylId}
                onBack={() => openPage('catalog')}
                onReviews={() => openPage('reviews')}
              />
            )}
            {page === 'reviews' && <ReviewsPage />}
            {page === 'favorites' && <div className="legacy-page"><FavoritesPage onNavigate={openPage} /></div>}
            {page === 'cart' && <div className="legacy-page"><CartPage onCheckout={handleCheckout} onNavigate={openPage} /></div>}
            {page === 'orders' && (
              <div className="legacy-page">
                <OrdersPage
                  orders={user?.orders ?? []}
                  onNavigate={openPage}
                  onOrdersChange={handleOrdersChange}
                />
              </div>
            )}
            {page === 'profile' && <div className="legacy-page"><ProfilePage user={user} onNavigate={openPage} /></div>}
          </PageContainer>
          <Footer onNavigate={openPage} />
        </div>
      </FavoritesProvider>
    </CartProvider>
  )
}

export default App
