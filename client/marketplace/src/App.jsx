import { useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import PageContainer from './components/layout/PageContainer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const App = () => {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)

  const handleLogin = (newUser) => {
    setUser(newUser)
    setPage('home')
  }
  const handleLogout = () => {
    setUser(null)
    setPage('home')
  }

  return (
    <>
      <Header page={page} onNavigate={setPage} user={user} onLogout={handleLogout} />
      <PageContainer>
        {page === 'home' && <HomePage user={user} />}
        {page === 'login' && <LoginPage onNavigate={setPage} onLogin={handleLogin} />}
        {page === 'register' && <RegisterPage onNavigate={setPage} onRegister={handleLogin} />}
      </PageContainer>
      <Footer />
    </>
  )
}
export default App
