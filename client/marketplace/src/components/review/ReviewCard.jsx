import RatingStars from '../ui/RatingStars'
import ReviewActions from './ReviewActions'

const ReviewCard = ({ review }) => (
  <article className="review-card">
    <div className="review-card-head">
      <div>
        <strong>{review.userName || `Usuario #${review.userId}`}</strong>
        <p>{review.vinylName || `Vinilo #${review.vinylId}`}</p>
      </div>
      <RatingStars value={review.score} />
    </div>
    <p className="review-comment">“{review.comment}”</p>
    <div className="review-meta">
      <time>{review.createdAt ? new Date(review.createdAt).toLocaleDateString('es-AR') : '—'}</time>
      <ReviewActions review={review} />
    </div>
  </article>
)
export default ReviewCard
