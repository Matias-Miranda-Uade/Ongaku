const TOKEN_STORAGE_KEY = 'ongaku-access-token'
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? ''

export const getAccessToken = () => window.localStorage.getItem(TOKEN_STORAGE_KEY)

export const setAccessToken = (token) => {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export const clearAccessToken = () => {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

const readData = (payload) => payload && Object.hasOwn(payload, 'data') ? payload.data : payload

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
        ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
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
    const fallback = response.status >= 500
      ? 'El servidor no pudo procesar la solicitud. Verificá que el backend esté iniciado y volvé a intentar.'
      : `Error HTTP ${response.status}`
    throw new ApiError(`${payload?.message || fallback}${details}`, response.status, errors)
  }

  if (response.status !== 204 && payload === null) {
    throw new ApiError('El servidor devolvió una respuesta inválida. Verificá la dirección de la API.', 502)
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

export const normalizeOrder = (order, payments = []) => ({
  ...order,
  status: order.orderStatus?.name ?? order.status ?? 'PENDIENTE',
  payment: payments.find((payment) => String(payment.orderId) === String(order.id)) ?? order.payment ?? null,
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
  const [orders, payments] = await Promise.all([request('/orders'), getPayments()])
  return Array.isArray(orders) ? orders.map((order) => normalizeOrder(order, payments)) : []
}

export const getOrder = async (orderId) => {
  const [order, payments] = await Promise.all([request(`/orders/${orderId}`), getPayments()])
  return normalizeOrder(order, payments)
}

export const getPayments = async () => {
  const data = await request('/payments')
  return Array.isArray(data) ? data : []
}

export const createPayment = ({ orderId, amount, method = 'SIMULADO', savedCardId }) => request(
  '/payments', jsonRequest('POST', { orderId, amount, method, ...(savedCardId == null ? {} : { savedCardId }) }),
)

export const createOrder = async (addressId, savedCardId) => normalizeOrder(await request('/orders', jsonRequest('POST', addressId == null ? undefined : { addressId, ...(savedCardId == null ? {} : { savedCardId }) })))

export const getSavedCards = () => request('/users/me/cards')
export const saveCard = (card, id) => request(id == null ? '/users/me/cards' : `/users/me/cards/${id}`, jsonRequest(id == null ? 'POST' : 'PATCH', card))
export const deleteCard = (id) => request(`/users/me/cards/${id}`, jsonRequest('DELETE'))

export const getAddresses = () => request('/users/me/addresses')
export const saveAddress = (address, id) => request(id == null ? '/users/me/addresses' : `/users/me/addresses/${id}`, jsonRequest(id == null ? 'POST' : 'PATCH', address))
export const deleteAddress = (id) => request(`/users/me/addresses/${id}`, jsonRequest('DELETE'))

export const getFavorites = async () => {
  const [favorites, vinyls] = await Promise.all([request('/favorites'), getVinyls()])
  return favorites.flatMap((favorite) => {
    const vinyl = vinyls.find((item) => String(item.id) === String(favorite.vinylId))
    return vinyl ? [{ ...vinyl, favoriteId: favorite.id, artist: vinyl.artistName, price: vinyl.finalPrice ?? vinyl.price }] : []
  })
}
export const createFavorite = (vinylId) => request('/favorites', jsonRequest('POST', { vinylId }))
export const deleteFavorite = (id) => request(`/favorites/${id}`, jsonRequest('DELETE'))

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
  const [data, lookups] = await Promise.all([request('/vinyls'), getVinylLookups()])
  return (Array.isArray(data) ? data : []).map((vinyl) => normalizeVinyl(vinyl, lookups))
}

export const getVinylById = async (id) => {
  const [vinyl, lookups] = await Promise.all([request(`/vinyls/${encodeURIComponent(id)}`), getVinylLookups()])
  return normalizeVinyl(vinyl, lookups)
}

const getVinylLookups = async () => {
  const [artists, genres, categories] = await Promise.all([
    request('/artists'), request('/genres'), request('/categories'),
  ])
  const index = (items) => Object.fromEntries((Array.isArray(items) ? items : []).map((item) => [item.id, item]))
  return { artists: index(artists), genres: index(genres), categories: index(categories) }
}

const normalizeVinyl = (vinyl, lookups) => ({
  ...vinyl,
  artistName: lookups.artists[vinyl.artistId]?.name ?? vinyl.artistName,
  genreName: lookups.genres[vinyl.genreId]?.name ?? vinyl.genreName,
  genreNames: (vinyl.genreIds?.length ? vinyl.genreIds : vinyl.genreId ? [vinyl.genreId] : []).map((id) => lookups.genres[id]?.name).filter(Boolean),
  categoryDescription: lookups.categories[vinyl.categoryId]?.description ?? vinyl.categoryDescription,
})

export const getReviews = async (vinylId) => {
  const query = vinylId == null ? '' : `?vinylId=${encodeURIComponent(vinylId)}`
  const data = await request(`/reviews${query}`)
  return Array.isArray(data) ? data : []
}

export const getReviewsByVinyl = async (vinylId) => {
  const data = await request(`/reviews/vinyl/${encodeURIComponent(vinylId)}`)
  return {
    reviews: data?.reviews ?? [],
    averageScore: data?.averageScore ?? 0,
    totalReviews: data?.totalReviews ?? 0,
  }
}

export const updateReview = (reviewId, { score, comment }) => request(
  `/reviews/${encodeURIComponent(reviewId)}`, jsonRequest('PATCH', { score, comment }),
)

export const getReviewEligibility = (vinylId) => request(`/reviews/vinyl/${encodeURIComponent(vinylId)}/eligibility`)

export const deleteReview = (reviewId) => request(
  `/reviews/${encodeURIComponent(reviewId)}`, jsonRequest('DELETE'),
)

export const getAudioPreview = async (audioPreviewId) => {
  if (!audioPreviewId) return null
  return request(`/audio-previews/${encodeURIComponent(audioPreviewId)}`)
}
