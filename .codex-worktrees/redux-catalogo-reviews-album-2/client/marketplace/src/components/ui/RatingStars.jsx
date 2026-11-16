const RatingStars = ({ value = 0, max = 5 }) => {
  const rounded = Math.round(Number(value) || 0)
  return (
    <span className="rating-stars" aria-label={`${value} de ${max} estrellas`}>
      {Array.from({ length: max }, (_, index) => (
        <span key={index}>{index < rounded ? '★' : '☆'}</span>
      ))}
    </span>
  )
}
export default RatingStars
