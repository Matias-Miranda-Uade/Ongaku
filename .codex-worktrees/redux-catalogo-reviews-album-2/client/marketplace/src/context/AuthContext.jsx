import { createContext, useCallback, useEffect, useState } from 'react';
import authService from '../services/authService';
export const AuthContext = createContext(null);
export const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null);
  const [isRestoringSession, setIsRestoringSession] = useState(() => authService.hasSession());
  const [sessionError, setSessionError] = useState('');
  useEffect(() => {
    if (!authService.hasSession()) return undefined;
    let active = true;
    authService.getProfile().then(profile => {
      if (active) setUser(profile);
    }).catch(error => {
      authService.clearAccessToken();
      if (active) setSessionError(`No se pudo recuperar la sesión: ${error.message}`);
    }).finally(() => {
      if (active) setIsRestoringSession(false);
    });
    return () => {
      active = false;
    };
  }, []);
  const login = useCallback(credentials => {
    return Promise.resolve(authService.login(credentials)).then(profile => {
      setSessionError('');
      setUser(profile);
      return profile;
    });
  }, []);
  const register = useCallback(account => {
    return Promise.resolve(authService.register(account)).then(profile => {
      setSessionError('');
      setUser(profile);
      return profile;
    });
  }, []);
  const logout = useCallback(() => {
    return Promise.resolve(authService.logout()).then(() => {
      setSessionError('');
    }).catch(error => {
      setSessionError(`No se pudo invalidar la sesión en el servidor: ${error.message}`);
    }).finally(() => {
      setUser(null);
    });
  }, []);
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
    logout
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;
