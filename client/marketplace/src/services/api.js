import { mockAudio, mockReviews, mockVinyls } from '../data/mockData'

const TOKEN_STORAGE_KEY = 'ongaku-access-token'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const getAccessToken = () => window.localStorage.getItem(TOKEN_STORAGE_KEY)

export const setAccessToken = (token) => {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export const clearAccessToken = () => {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

const readData = (payload) => payload?.data ?? payload

export class ApiError extends Error {
  constructor(message, status = 0, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
    this.fieldErrors = {}
    const field = /Campo invalido '([^']+)':\s*(.+)/i.exec(message)
    if (field) this.fieldErrors[field[1]] = field[2]
    errors.forEach((entry) => {
      const match = /^([\w.]+):\s*(.+)$/.exec(entry)
      if (match) this.fieldErrors[match[1]] = match[2]
    })
  }

  get isNotFound() { return this.status === 404 }
  get isConflict() { return this.status === 409 }
  get isUnauthorized() { return this.status === 401 }
  get isForbidden() { return this.status === 403 }
}

export const request = async (url, options = {}) => {
  const token = getAccessToken()
  let response

  try {
    response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch (error) {
    throw new ApiError('No se pudo conectar con el servidor. Verificá que el backend esté disponible.')
  }

  const payload = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const errors = Array.isArray(payload?.errors) ? payload.errors : []
    const details = errors.length ? ` ${errors.join(' ')}` : ''
    throw new ApiError(`${payload?.message || `Error HTTP ${response.status}`}${details}`, response.status, errors)
  }

  return readData(payload)
}

export const jsonRequest = (method, body) => ({
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
})

const normalizeCartItem = (item) => ({
  ...item,
  id: item.vinylId,
  price: item.finalPrice ?? item.unitPrice,
  artist: item.artistName,
})

export const normalizeCart = (cart) => ({
  ...cart,
  items: (cart?.items ?? []).map(normalizeCartItem),
})

export const normalizeOrder = (order) => ({
  ...order,
  status: order.orderStatus?.name ?? order.status ?? 'PENDIENTE',
  items: (order.items ?? []).map((item) => ({
    ...item,
    unitPrice: item.finalPrice ?? item.unitPrice,
    review: item.review ?? null,
  })),
})

export const login = async ({ email, password }) => {
  const response = await request('/api/v1/auth/authenticate', jsonRequest('POST', { email, password }))
  const token = response?.['access token'] ?? response?.accessToken
  if (!token) throw new Error('El servidor no devolvió un token de acceso válido.')
  setAccessToken(token)
  try {
    return await getProfile()
  } catch (error) {
    clearAccessToken()
    throw error
  }
}

export const register = async ({ firstName, lastName, email, password }) => {
  const response = await request('/api/v1/auth/register', jsonRequest('POST', {
    firstName,
    lastName,
    email,
    password,
  }))
  const token = response?.['access token'] ?? response?.accessToken
  if (!token) throw new Error('El servidor no devolvió un token de acceso válido.')
  setAccessToken(token)
  try {
    return await getProfile()
  } catch (error) {
    clearAccessToken()
    throw error
  }
}

export const logout = async () => {
  try {
    await request('/api/v1/auth/logout', jsonRequest('POST'))
  } finally {
    clearAccessToken()
  }
}

export const getProfile = async () => request('/users/me')

export const updateProfile = async (profile) => request('/users/me', jsonRequest('PATCH', profile))

export const changePassword = async ({ currentPassword, newPassword }) => (
  request('/users/me/password', jsonRequest('PATCH', { currentPassword, newPassword }))
)

export const getCart = async () => normalizeCart(await request('/carts'))

export const addCartItem = async (vinylId, quantity = 1) => normalizeCart(
  await request('/carts/items', jsonRequest('POST', { vinylId, quantity }))
)

export const updateCartItem = async (vinylId, quantity) => normalizeCart(
  await request(`/carts/items/${vinylId}`, jsonRequest('PATCH', { quantity }))
)

export const removeCartItem = async (vinylId) => normalizeCart(
  await request(`/carts/items/${vinylId}`, jsonRequest('DELETE'))
)

export const clearServerCart = async () => normalizeCart(
  await request('/carts/items', jsonRequest('DELETE'))
)

export const getOrders = async () => {
  const orders = await request('/orders')
  return Array.isArray(orders) ? orders.map(normalizeOrder) : []
}

export const getOrder = async (orderId) => normalizeOrder(await request(`/orders/${orderId}`))

export const createOrder = async () => normalizeOrder(await request('/orders', jsonRequest('POST')))

export const cancelOrder = async (orderId) => normalizeOrder(
  await request(`/orders/${orderId}/status`, jsonRequest('PATCH', { status: 'CANCELADA' }))
)

export const getMyReviews = async () => {
  const reviews = await request('/reviews/me')
  return Array.isArray(reviews) ? reviews : []
}

export const createReview = async ({ vinylId, score, comment }) => request(
  '/reviews',
  jsonRequest('POST', { vinylId, score, comment })
)

export const getVinyls = async () => {
  try {
    const data = await request('/vinyls')
    return Array.isArray(data) ? data : []
  } catch {
    return mockVinyls
  }
}

export const getVinylById = async (id) => {
  try {
    return await request(`/vinyls/${id}`)
  } catch {
    return mockVinyls.find((vinyl) => String(vinyl.id) === String(id)) ?? mockVinyls[0]
  }
}

export const getReviews = async () => {
  try {
    const data = await request('/reviews')
    return Array.isArray(data) ? data : []
  } catch {
    return mockReviews
  }
}

export const getReviewsByVinyl = async (vinylId) => {
  try {
    const data = await request(`/reviews/vinyl/${vinylId}`)
    return {
      reviews: data?.reviews ?? [],
      averageScore: data?.averageScore ?? 0,
      totalReviews: data?.totalReviews ?? 0
    }
  } catch {
    const reviews = mockReviews.filter((review) => String(review.vinylId) === String(vinylId))
    const averageScore = reviews.length
      ? reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length
      : 0
    return { reviews, averageScore, totalReviews: reviews.length }
  }
}

export const getAudioPreview = async (audioPreviewId) => {
  if (!audioPreviewId) return null
  try {
    return await request(`/audio-previews/${audioPreviewId}`)
  } catch {
    return mockAudio[audioPreviewId] ?? null
  }
}
