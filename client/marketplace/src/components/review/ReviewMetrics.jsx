const ReviewMetrics = ({ reviews }) => {
  const ratedReviews = reviews.filter((review) => Number(review.score) >= 1 && Number(review.score) <= 5)
  const countFor = (score) => reviews.filter((review) => Math.round(review.score) === score).length
  return (
    <section className="review-metrics">
      {[5, 4, 3, 2, 1].map((score) => {
        const count = countFor(score)
        const width = ratedReviews.length ? (count / ratedReviews.length) * 100 : 0
        return (
          <div className="metric-row" key={score}>
            <span>{score}★</span>
            <div><i style={{ width: `${width}%` }} /></div>
            <small>{count}</small>
          </div>
        )
      })}
    </section>
  )
}
export default ReviewMetrics
