const ReviewActions = ({ review }) => (
  <div className="review-actions">
    <button type="button">ÚTIL</button>
    <span>{review.edited ? 'EDITADA' : 'VERIFICADA'}</span>
  </div>
)
export default ReviewActions
