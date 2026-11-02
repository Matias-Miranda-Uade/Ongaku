import { useEffect, useState } from 'react'
import ReviewCard from '../components/review/ReviewCard'
import ReviewFilters from '../components/review/ReviewFilters'
import ReviewMetrics from '../components/review/ReviewMetrics'
import ReviewSummary from '../components/review/ReviewSummary'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReviews } from '../Redux/actions/reviewsActions.js'
import { selectReviewData } from '../Redux/slices/reviewsSlice.js'

const ReviewsPage = ({ vinylId = null, onClearVinyl }) => {
  const dispatch = useDispatch()
  const { reviews, status, error } = useSelector(state => selectReviewData(state, vinylId))
  const loading = status === 'idle' || status === 'loading'
  const [score, setScore] = useState('all')

  useEffect(() => { dispatch(fetchReviews({ vinylId })) }, [dispatch, vinylId])

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
      {error && <div role="alert"><p>{error}</p><button type="button" onClick={() => dispatch(fetchReviews({ vinylId, force: true }))}>Reintentar</button></div>}

      {loading ? (
        <p className="empty-state">Cargando reseñas…</p>
      ) : !error && (
        <div className="review-list">
          {filtered.map((review) => <ReviewCard key={review.id} review={review} />)}
          {!filtered.length && <p className="empty-state">No hay reseñas con estos filtros.</p>}
        </div>
      )}
    </div>
  )
}
export default ReviewsPage
