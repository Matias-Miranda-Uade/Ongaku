import RatingStars from '../ui/RatingStars'

const ReviewSummary = ({ reviews }) => {
  const ratedReviews = reviews.filter((review) => Number(review.score) >= 1 && Number(review.score) <= 5)
  const average = ratedReviews.length
    ? ratedReviews.reduce((sum, review) => sum + Number(review.score), 0) / ratedReviews.length
    : 0

  return (
    <section className="review-summary">
      <p className="eyebrow">COMUNIDAD ONGAKU</p>
      <div className="summary-score">{average.toFixed(1)}</div>
      <RatingStars value={average} />
      <p>{reviews.length} reseñas publicadas</p>
    </section>
  )
}
export default ReviewSummary
