import RatingStars from '../ui/RatingStars'
import ReviewActions from './ReviewActions'

const ReviewCard = ({ review, onChanged }) => (
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
      <span>{review.edited ? 'EDITADA' : 'PUBLICADA'}</span>
    </div>
    {onChanged && <ReviewActions review={review} onChanged={onChanged} />}
  </article>
)
export default ReviewCard
