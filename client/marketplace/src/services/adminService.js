import { jsonRequest, request } from './api.js'

const asList = (data) => (Array.isArray(data) ? data : [])

const withQuery = (url, params) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ).toString()
  return query ? `${url}?${query}` : url
}

export const getDashboardSummary = () => request('/dashboard')

export const getAllOrders = async () => asList(await request('/orders'))

export const updateOrderStatus = (orderId, status) =>
  request(`/orders/${orderId}/status`, jsonRequest('PATCH', { status }))

export const getAdminVinyls = async () => asList(await request('/admin/vinyls'))

export const getAdminVinylById = (vinylId) => request(`/admin/vinyls/${vinylId}`)

export const createVinyl = (payload) => request('/admin/vinyls', jsonRequest('POST', payload))

export const updateVinyl = (vinylId, payload) =>
  request(`/admin/vinyls/${vinylId}`, jsonRequest('PATCH', payload))

export const deleteVinyl = (vinylId) => request(`/admin/vinyls/${vinylId}`, jsonRequest('DELETE'))

export const setVinylEnabled = (vinylId, enabled) =>
  request(withQuery(`/admin/vinyls/${vinylId}/enabled`, { enabled }), jsonRequest('PATCH'))

export const adjustVinylStock = (vinylId, quantity) =>
  request(withQuery(`/admin/vinyls/${vinylId}/stock`, { quantity }), jsonRequest('PATCH'))

export const updateVinylDiscount = (vinylId, discountPercentage) =>
  request(`/admin/vinyls/${vinylId}/discount`, jsonRequest('PATCH', { discountPercentage }))

export const getArtists = async () => asList(await request('/artists'))
export const getGenres = async () => asList(await request('/genres'))
export const getCategories = async () => asList(await request('/categories'))
export const getAudioPreviews = async () => asList(await request('/audio-previews'))

export const createGenre = (name) => request('/genres', jsonRequest('POST', { name }))
export const createArtist = (name) => request('/artists', jsonRequest('POST', { name }))
export const createCategory = (description) => request('/categories', jsonRequest('POST', { description }))
export const uploadCover = (file) => {
  const body = new FormData()
  body.append('file', file)
  return request('/admin/vinyls/covers', { method: 'POST', body })
}

export const createAudioPreview = ({ url, durationSeconds }) =>
  request('/audio-previews', jsonRequest('POST', { url, durationSeconds }))

export const getCatalogLookups = async () => {
  const [artists, genres, categories] = await Promise.all([getArtists(), getGenres(), getCategories()])
  return { artists, genres, categories }
}

const adminService = {
  getDashboardSummary,
  getAllOrders,
  updateOrderStatus,
  getAdminVinyls,
  getAdminVinylById,
  createVinyl,
  updateVinyl,
  deleteVinyl,
  setVinylEnabled,
  adjustVinylStock,
  updateVinylDiscount,
  getArtists,
  getGenres,
  getCategories,
  getAudioPreviews,
  createGenre,
  createArtist,
  createCategory,
  uploadCover,
  createAudioPreview,
  getCatalogLookups,
}

export default adminService
