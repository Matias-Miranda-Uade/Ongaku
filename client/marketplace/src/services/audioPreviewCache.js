import { getAudioPreview } from './api.js'

const previews = new Map()
const cacheDuration = 30000

// Home y detalle comparten tanto la petición pendiente como su resultado reciente.
export const getCachedAudioPreview = audioPreviewId => {
  if (!audioPreviewId) return Promise.resolve(null)
  const key = String(audioPreviewId)
  const cached = previews.get(key)
  if (cached && (cached.pending || Date.now() - cached.fetchedAt < cacheDuration)) return cached.promise

  const entry = { pending: true, fetchedAt: 0 }
  entry.promise = getAudioPreview(audioPreviewId).then(preview => {
    entry.pending = false
    entry.fetchedAt = Date.now()
    return preview
  }).catch(error => {
    previews.delete(key)
    throw error
  })
  previews.set(key, entry)
  return entry.promise
}
