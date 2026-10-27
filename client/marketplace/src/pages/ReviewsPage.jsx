import { useEffect, useState } from 'react'
import ReviewCard from '../components/review/ReviewCard'
import ReviewFilters from '../components/review/ReviewFilters'
import ReviewMetrics from '../components/review/ReviewMetrics'
import ReviewSummary from '../components/review/ReviewSummary'
import { getReviews } from '../services/reviewService'

const ReviewsPage = ({ vinylId = null, onClearVinyl }) => {
  const [reviews, setReviews] = useState([])
  const [score, setScore] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setReviews([])
    getReviews(vinylId)
      .then((data) => { if (active) setReviews(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [vinylId, reload])

  let filtered = reviews
  if (score !== 'all') {
    filtered = reviews.filter((review) => String(Math.round(review.score)) === score)
  }

  return (
    <div className="page reviews-page">
      <section className="page-hero reviews-hero">
        <p className="eyebrow">VOCES / COMUNIDAD</p>
        <h1>Reseñas de la comunidad</h1>
        <p>Opiniones de quienes escuchan, coleccionan y vuelven a poner el lado A.</p>
      </section>

      <div className="reviews-dashboard">
        <ReviewSummary reviews={reviews} />
        <ReviewMetrics reviews={reviews} />
      </div>

      <ReviewFilters score={score} onChange={setScore} />
      {vinylId && <button type="button" className="text-link link-button" onClick={onClearVinyl}>Ver reseñas de todos los vinilos</button>}
      {error && <div role="alert"><p>{error}</p><button type="button" onClick={() => setReload((value) => value + 1)}>Reintentar</button></div>}

      {loading ? (
        <p className="empty-state">Cargando reseñas…</p>
      ) : !error && (
        <div className="review-list">
          {filtered.map((review) => <ReviewCard key={review.id} review={review} onChanged={() => setReload((value) => value + 1)} />)}
          {!filtered.length && <p className="empty-state">No hay reseñas con estos filtros.</p>}
        </div>
      )}
    </div>
  )
}
export default ReviewsPage
