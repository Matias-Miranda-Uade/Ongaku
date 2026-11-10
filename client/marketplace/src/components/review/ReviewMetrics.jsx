const ReviewMetrics = ({ reviews }) => {
  const counts = [0, 0, 0, 0, 0, 0]
  let total = 0
  for (const review of reviews) {
    const score = Number(review.score)
    if (score >= 1 && score <= 5) {
      counts[Math.round(score)] += 1
      total += 1
    }
  }
  return (
    <section className="review-metrics">
      {[5, 4, 3, 2, 1].map((score) => {
        const count = counts[score]
        const width = total ? (count / total) * 100 : 0
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
