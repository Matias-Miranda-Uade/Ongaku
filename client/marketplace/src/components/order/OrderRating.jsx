import { useEffect, useRef, useState } from 'react';
const OrderRating = ({
  item,
  onRate,
  submitting = false,
  autoFocus = false
}) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const commentRef = useRef(null);
  useEffect(() => {
    if (autoFocus && !item.review) commentRef.current?.focus();
  }, [autoFocus, item.review]);
  if (item.review) {
    return <section className="order-review-saved">
        <p className="eyebrow">TU RESEÑA</p>
        <p className="order-review-stars" aria-label={`${item.review.score} de 5 estrellas`}>
          {'★'.repeat(item.review.score)}{'☆'.repeat(5 - item.review.score)}
        </p>
        <p>{item.review.comment}</p>
      </section>;
  }
  const handleSubmit = event => {
    event.preventDefault();
    if (score < 1) {
      setError('Elegí un puntaje entre 1 y 5.');
      return Promise.resolve();
    }
    if (!comment.trim()) {
      setError('El comentario no puede estar vacío.');
      return Promise.resolve();
    }
    setError('');
    return Promise.resolve(onRate(item.vinylId, {
      score,
      comment: comment.trim()
    })).then(() => {});
  };
  return <form className="order-review-form" onSubmit={handleSubmit}>
      <p className="eyebrow">CONTANOS QUÉ TE PARECIÓ</p>
      <div className="order-rating-stars" role="group" aria-label="Puntaje">
        {[1, 2, 3, 4, 5].map(value => <button className={value <= score ? 'is-selected' : ''} type="button" key={value} aria-label={`${value} estrella${value === 1 ? '' : 's'}`} aria-pressed={score === value} onClick={() => setScore(value)}>
            {value <= score ? '★' : '☆'}
          </button>)}
      </div>
      <label className="order-review-label" htmlFor={`review-${item.vinylId}`}>Tu comentario</label>
      <textarea ref={commentRef} id={`review-${item.vinylId}`} name="comment" value={comment} maxLength={1000} onChange={event => setComment(event.target.value)} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="secondary-button" type="submit" disabled={submitting}>
        {submitting ? 'Guardando…' : 'Publicar reseña'}
      </button>
    </form>;
};
export default OrderRating;
