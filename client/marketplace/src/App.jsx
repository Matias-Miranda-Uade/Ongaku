import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import './persona2.css'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import useCart from './hooks/useCart'
import {
  clearAccessToken,
  createOrder,
  getAccessToken,
  getOrders,
  getProfile,
  login,
  logout,
  register,
} from './services/api'
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

const pagePaths = {
  home: '/',
  login: '/app/login',
  register: '/app/register',
  profile: '/app/profile',
  favorites: '/app/favorites',
  cart: '/app/cart',
  orders: '/app/orders',
  catalog: '/app/catalog',
  reviews: '/app/reviews',
}

const resolveRoute = (pathname) => {
  const vinylMatch = pathname.match(/^\/app\/catalog\/([^/]+)$/)
  if (vinylMatch) {
    return { page: 'vinyl-detail', vinylId: decodeURIComponent(vinylMatch[1]) }
  }

  const orderMatch = pathname.match(/^\/app\/orders\/(\d+)$/)
  if (orderMatch) {
    return { page: 'orders', orderId: orderMatch[1] }
  }

  const page = Object.entries(pagePaths).find(([, path]) => path === pathname)?.[0]
  return { page: page ?? null, vinylId: null, orderId: null }
}

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { page, vinylId: selectedVinylId, orderId: selectedOrderId } = resolveRoute(location.pathname)
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [storageError, setStorageError] = useState('')
  const [isRestoringSession, setIsRestoringSession] = useState(() => Boolean(getAccessToken()))
  const [ordersReload, setOrdersReload] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  useEffect(() => {
    if (!getAccessToken()) return

    let active = true
    getProfile()
      .then((profile) => {
        if (active) setUser(profile)
      })
      .catch((error) => {
        clearAccessToken()
        if (active) setStorageError(`No se pudo recuperar la sesión: ${error.message}`)
      })
      .finally(() => {
        if (active) setIsRestoringSession(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setOrders([])
      return
    }

    let active = true
    getOrders()
      .then((data) => {
        if (active) setOrders(data)
      })
      .catch((error) => {
        if (active) setStorageError(`No se pudieron cargar tus órdenes: ${error.message}`)
      })

    return () => {
      active = false
    }
  }, [user?.id, ordersReload])

  const openPage = (nextPage) => {
    navigate(pagePaths[nextPage] ?? '/')
  }

  const openVinyl = (vinylId) => {
    navigate(`/app/catalog/${encodeURIComponent(vinylId)}`)
  }

  const handleLogin = async (credentials) => {
    const profile = await login(credentials)
    setStorageError('')
    setOrders([])
    setUser(profile)
    openPage('home')
  }

  const handleRegister = async (account) => {
    const profile = await register(account)
    setStorageError('')
    setOrders([])
    setUser(profile)
    openPage('profile')
  }

  const handleLogout = async () => {
    try {
      await logout()
      setStorageError('')
    } catch (error) {
      setStorageError(`No se pudo invalidar la sesión en el servidor: ${error.message}`)
    } finally {
      setUser(null)
      setOrders([])
      openPage('home')
    }
  }

  const handleOrdersChange = (nextOrders) => {
    setOrders(nextOrders)
  }

  if (isRestoringSession) {
    return <main className="app-shell"><p role="status">Recuperando tu sesión…</p></main>
  }

  if (!page) return <Navigate to="/" replace />

  return (
    <CartProvider user={user}>
      <FavoritesProvider>
        <AppContent
          page={page}
          user={user}
          onUserChange={setUser}
          orders={orders}
          storageError={storageError}
          selectedVinylId={selectedVinylId}
          selectedOrderId={selectedOrderId}
          openPage={openPage}
          openVinyl={openVinyl}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          handleLogout={handleLogout}
          handleOrdersChange={handleOrdersChange}
          reloadOrders={() => setOrdersReload((value) => value + 1)}
        />
      </FavoritesProvider>
    </CartProvider>
  )
}

const AppContent = ({
  page,
  user,
  onUserChange,
  orders,
  storageError,
  selectedVinylId,
  selectedOrderId,
  openPage,
  openVinyl,
  handleLogin,
  handleRegister,
  handleLogout,
  handleOrdersChange,
  reloadOrders,
}) => {
  const navigate = useNavigate()
  const { refreshCart } = useCart()

  const handleCheckout = async () => {
    if (!user) {
      openPage('login')
      return false
    }

    try {
      const order = await createOrder()
      handleOrdersChange([order, ...orders])
      await refreshCart()
      reloadOrders()
      openPage('orders')
      return true
    } catch (error) {
      return { error: error.message }
    }
  }

  return (
    <div className="app-shell">
      <Header page={page} onNavigate={openPage} user={user} onLogout={handleLogout} />
      {storageError && <p className="storage-notice" role="alert">{storageError}</p>}
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
        {page === 'cart' && (
          <div className="legacy-page">
            <CartPage onCheckout={handleCheckout} onNavigate={openPage} />
          </div>
        )}
        {page === 'orders' && (
          <div className="legacy-page">
            <OrdersPage
              orders={orders}
              authenticated={Boolean(user)}
              selectedOrderId={selectedOrderId}
              onNavigate={openPage}
              onSelectOrder={(orderId) => navigate(`/app/orders/${orderId}`)}
              onOrdersChange={handleOrdersChange}
            />
          </div>
        )}
        {page === 'profile' && (
          <div className="legacy-page">
            <ProfilePage
              user={user ? { ...user, orders } : null}
              onUserChange={onUserChange}
              onNavigate={openPage}
            />
          </div>
        )}
      </PageContainer>
      <Footer onNavigate={openPage} />
    </div>
  )
}

export default App
