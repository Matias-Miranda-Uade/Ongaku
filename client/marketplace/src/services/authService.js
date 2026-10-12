import {
  clearAccessToken,
  getAccessToken,
  getProfile,
  login,
  logout,
  register,
} from './api'

export const hasSession = () => Boolean(getAccessToken())

const authService = { login, register, logout, getProfile, getAccessToken, clearAccessToken, hasSession }

export { login, register, logout, getProfile, getAccessToken, clearAccessToken }
export default authService
