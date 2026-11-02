import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectReviewDraft, setDraftComment, setDraftError, setDraftScore } from '../../Redux/slices/reviewsSlice';
const OrderRating = ({
  item,
  onRate,
  submitting = false,
  autoFocus = false
}) => {
  const dispatch = useDispatch();
  const { score, comment, error } = useSelector(selectReviewDraft(item.vinylId));
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
      dispatch(setDraftError({ vinylId: item.vinylId, error: 'Elegí un puntaje entre 1 y 5.' }));
      return Promise.resolve();
    }
    if (!comment.trim()) {
      dispatch(setDraftError({ vinylId: item.vinylId, error: 'El comentario no puede estar vacío.' }));
      return Promise.resolve();
    }
    dispatch(setDraftError({ vinylId: item.vinylId, error: '' }));
    return Promise.resolve(onRate(item.vinylId, {
      score,
      comment: comment.trim()
    })).then(() => {});
  };
  return <form className="order-review-form" onSubmit={handleSubmit}>
      <p className="eyebrow">CONTANOS QUÉ TE PARECIÓ</p>
      <div className="order-rating-stars" role="group" aria-label="Puntaje">
        {[1, 2, 3, 4, 5].map(value => <button className={value <= score ? 'is-selected' : ''} type="button" key={value} aria-label={`${value} estrella${value === 1 ? '' : 's'}`} aria-pressed={score === value} onClick={() => dispatch(setDraftScore({ vinylId: item.vinylId, score: value }))}>
            {value <= score ? '★' : '☆'}
          </button>)}
      </div>
      <label className="order-review-label" htmlFor={`review-${item.vinylId}`}>Tu comentario</label>
      <textarea ref={commentRef} id={`review-${item.vinylId}`} name="comment" value={comment} maxLength={1000} onChange={event => dispatch(setDraftComment({ vinylId: item.vinylId, comment: event.target.value }))} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="secondary-button" type="submit" disabled={submitting}>
        {submitting ? 'Guardando…' : 'Publicar reseña'}
      </button>
    </form>;
};
export default OrderRating;
