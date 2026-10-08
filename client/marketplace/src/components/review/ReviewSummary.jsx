import RatingStars from '../ui/RatingStars'

const ReviewSummary = ({ reviews }) => {
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.score || 0), 0) / reviews.length
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
