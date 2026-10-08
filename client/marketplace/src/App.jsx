import { useState } from 'react'
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

const App = () => {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [selectedVinylId, setSelectedVinylId] = useState(null)

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
    setUser(newUser)
    openPage('home')
  }

  const handleLogout = () => {
    setUser(null)
    openPage('home')
  }

  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="app-shell">
          <Header page={page} onNavigate={openPage} user={user} onLogout={handleLogout} />
          <PageContainer>
            {page === 'home' && <HomePage user={user} />}
            {page === 'login' && <LoginPage onNavigate={openPage} onLogin={handleLogin} />}
            {page === 'register' && <RegisterPage onNavigate={openPage} onRegister={handleLogin} />}
            {page === 'catalog' && <CatalogPage onOpenVinyl={openVinyl} />}
            {page === 'vinyl-detail' && selectedVinylId && (
              <VinylDetailPage
                vinylId={selectedVinylId}
                onBack={() => openPage('catalog')}
                onReviews={() => openPage('reviews')}
              />
            )}
            {page === 'reviews' && <ReviewsPage />}
            {page === 'favorites' && <div className="legacy-page"><FavoritesPage /></div>}
            {page === 'cart' && <div className="legacy-page"><CartPage /></div>}
            {page === 'orders' && <div className="legacy-page"><OrdersPage /></div>}
            {page === 'profile' && <div className="legacy-page"><ProfilePage /></div>}
          </PageContainer>
          <Footer />
        </div>
      </FavoritesProvider>
    </CartProvider>
  )
}

export default App
