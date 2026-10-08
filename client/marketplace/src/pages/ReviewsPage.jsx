import { useEffect, useMemo, useState } from 'react'
import ReviewCard from '../components/review/ReviewCard'
import ReviewFilters from '../components/review/ReviewFilters'
import ReviewMetrics from '../components/review/ReviewMetrics'
import ReviewSummary from '../components/review/ReviewSummary'
import { getReviews } from '../services/api'

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const [score, setScore] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReviews().then((data) => {
      setReviews(data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(
    () => score === 'all' ? reviews : reviews.filter((review) => String(Math.round(review.score)) === score),
    [reviews, score]
  )

  return (
    <div className="page reviews-page">
      <section className="page-hero reviews-hero">
        <p className="eyebrow">VOCES / COMUNIDAD</p>
        <h1>Reseñas de<br />la comunidad</h1>
        <p>Opiniones de quienes escuchan, coleccionan y vuelven a poner el lado A.</p>
      </section>

      <div className="reviews-dashboard">
        <ReviewSummary reviews={reviews} />
        <ReviewMetrics reviews={reviews} />
      </div>

      <ReviewFilters score={score} onChange={setScore} />

      {loading ? (
        <p className="empty-state">Cargando reseñas…</p>
      ) : (
        <div className="review-list">
          {filtered.map((review) => <ReviewCard key={review.id} review={review} />)}
        </div>
      )}
    </div>
  )
}
export default ReviewsPage
