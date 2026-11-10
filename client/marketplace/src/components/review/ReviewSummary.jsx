import RatingStars from '../ui/RatingStars'

const ReviewSummary = ({ averageScore, totalReviews }) => {
  return (
    <section className="review-summary">
      <p className="eyebrow">COMUNIDAD ONGAKU</p>
      <div className="summary-score">{Number(averageScore).toFixed(1)}</div>
      <RatingStars value={averageScore} />
      <p>{totalReviews} reseñas publicadas</p>
    </section>
  )
}
export default ReviewSummary
