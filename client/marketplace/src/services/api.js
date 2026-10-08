import { mockAudio, mockReviews, mockVinyls } from '../data/mockData'

const readData = (payload) => payload?.data ?? payload

const request = async (url) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return readData(await response.json())
}

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
