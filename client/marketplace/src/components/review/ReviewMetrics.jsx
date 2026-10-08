const ReviewMetrics = ({ reviews }) => {
  const countFor = (score) => reviews.filter((review) => Math.round(review.score) === score).length
  return (
    <section className="review-metrics">
      {[5, 4, 3, 2, 1].map((score) => {
        const count = countFor(score)
        const width = reviews.length ? (count / reviews.length) * 100 : 0
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
