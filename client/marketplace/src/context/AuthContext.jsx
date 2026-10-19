import { createContext, useCallback, useEffect, useState } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isRestoringSession, setIsRestoringSession] = useState(() => authService.hasSession())
  const [sessionError, setSessionError] = useState('')

  useEffect(() => {
    if (!authService.hasSession()) return undefined

    let active = true
    authService.getProfile()
      .then((profile) => {
        if (active) setUser(profile)
      })
      .catch((error) => {
        authService.clearAccessToken()
        if (active) setSessionError(`No se pudo recuperar la sesión: ${error.message}`)
      })
      .finally(() => {
        if (active) setIsRestoringSession(false)
      })

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const profile = await authService.login(credentials)
    setSessionError('')
    setUser(profile)
    return profile
  }, [])

  const register = useCallback(async (account) => {
    const profile = await authService.register(account)
    setSessionError('')
    setUser(profile)
    return profile
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
      setSessionError('')
    } catch (error) {
      setSessionError(`No se pudo invalidar la sesión en el servidor: ${error.message}`)
    } finally {
      setUser(null)
    }
  }, [])

  const value = {
    user,
    setUser,
    isRestoringSession,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
    sessionError,
    setSessionError,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
