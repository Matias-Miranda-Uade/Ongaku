import { useContext, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import './persona2.css'
import './admin.css'
import './controls.css'
import { CartContext, CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { AuthContext } from './context/AuthContext'
import { createOrder, getOrders } from './services/api'
import AppRoutes, { ADMIN_BASE_PATH, isAdminPath } from './routes/AppRoutes'
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
  admin: `${ADMIN_BASE_PATH}/dashboard`,
}

const resolveRoute = (pathname) => {
  if (isAdminPath(pathname)) return { page: 'admin', vinylId: null, orderId: null }

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
  const {
    user,
    setUser,
    isAdmin,
    isRestoringSession,
    sessionError,
    login,
    register,
    logout,
  } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [storageError, setStorageError] = useState('')
  const [ordersReload, setOrdersReload] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  useEffect(() => {
    if (!user || isAdmin) {
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
  }, [user?.id, isAdmin, ordersReload])

  const openPage = (nextPage) => {
    if (nextPage === 'orders' && isAdmin) {
      navigate('/app/admin/orders')
      return
    }
    navigate(pagePaths[nextPage] ?? '/')
  }

  const openVinyl = (vinylId) => {
    navigate(`/app/catalog/${encodeURIComponent(vinylId)}`)
  }

  const handleLogin = async (credentials) => {
    const profile = await login(credentials)
    setStorageError('')
    setOrders([])
    openPage(profile.role === 'ADMIN' ? 'admin' : 'home')
  }

  const handleRegister = async (account) => {
    await register(account)
    setStorageError('')
    setOrders([])
    openPage('profile')
  }

  const handleLogout = async () => {
    await logout()
    setStorageError('')
    setOrders([])
    openPage('home')
  }

  const handleOrdersChange = (nextOrders) => {
    setOrders(nextOrders)
  }

  if (isRestoringSession) {
    return <main className="app-shell"><p role="status">Recuperando tu sesión…</p></main>
  }

  if (!page) return <Navigate to="/" replace />
  if (isAdmin && page === 'orders') return <Navigate to="/app/admin/orders" replace />

  return (
    <CartProvider user={isAdmin ? null : user}>
      <FavoritesProvider>
        <AppContent
          page={page}
          user={user}
          onUserChange={setUser}
          orders={orders}
          isAdmin={isAdmin}
          storageError={sessionError || storageError}
          selectedVinylId={selectedVinylId}
          selectedOrderId={selectedOrderId}
          queryString={location.search}
          focusCatalogSearch={Boolean(location.state && location.state.focusCatalogSearch)}
          searchRequest={location.key}
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
  isAdmin,
  onUserChange,
  orders,
  storageError,
  selectedVinylId,
  selectedOrderId,
  queryString,
  focusCatalogSearch,
  searchRequest,
  openPage,
  openVinyl,
  handleLogin,
  handleRegister,
  handleLogout,
  handleOrdersChange,
  reloadOrders,
}) => {
  const navigate = useNavigate()
  const { refreshCart } = useContext(CartContext)
  const query = new URLSearchParams(queryString)

  const handleCheckout = async () => {
    if (isAdmin) return { error: 'Las cuentas de administración no pueden crear compras.' }
    if (!user) {
      openPage('login')
      return false
    }

    try {
      const order = await createOrder()
      handleOrdersChange([order, ...orders])
      await refreshCart()
      reloadOrders()
      navigate(`/app/orders/${order.id}`)
      return true
    } catch (error) {
      return { error: error.message }
    }
  }

  return (
    <div className="app-shell">
      <Header
        page={page}
        onNavigate={openPage}
        onSearch={() => navigate(pagePaths.catalog, { state: { focusCatalogSearch: true } })}
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      {storageError && <p className="storage-notice" role="alert">{storageError}</p>}
      <PageContainer>
        {page === 'admin' && <AppRoutes />}
        {page === 'home' && <HomePage user={user} onNavigate={openPage} />}
        {page === 'login' && <LoginPage onNavigate={openPage} onLogin={handleLogin} />}
        {page === 'register' && <RegisterPage onNavigate={openPage} onRegister={handleRegister} />}
        {page === 'catalog' && <CatalogPage onOpenVinyl={openVinyl} collectionId={query.get('collection')} onClearCollection={() => navigate('/app/catalog')} focusSearch={focusCatalogSearch} searchRequest={searchRequest} />}
        {page === 'vinyl-detail' && selectedVinylId && (
          <VinylDetailPage
            vinylId={selectedVinylId}
            onBack={() => openPage('catalog')}
            onReviews={() => navigate(`/app/reviews?vinylId=${encodeURIComponent(selectedVinylId)}`)}
            onLogin={() => openPage('login')}
          />
        )}
        {page === 'reviews' && <ReviewsPage vinylId={query.get('vinylId')} onClearVinyl={() => navigate('/app/reviews')} />}
        {page === 'favorites' && <div className="legacy-page"><FavoritesPage onNavigate={openPage} onOpenVinyl={openVinyl} /></div>}
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
