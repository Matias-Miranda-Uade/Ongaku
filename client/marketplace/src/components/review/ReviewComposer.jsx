import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, fetchReviewEligibility, selectEligibility, selectSubmittingVinylId } from '../../Redux/slices/reviewsSlice.js';

import { getMessage } from '../../Redux/requestState.js';
import ReviewCard from './ReviewCard';
const ReviewComposer = ({
  vinylId,
  onChanged,
  onLogin
}) => {
  const {
    user,
    isAdmin
  } = useContext(AuthContext);
  const userId = user ? user.id : null;
  const dispatch = useDispatch();
  const request = useSelector(state => selectEligibility(state, userId, vinylId));
  const ownerId = useSelector(state => state.reviews.ownerId);
  const eligibility = request.data;
  const loading = request.status === 'idle' || request.status === 'loading';
  const submittingVinylId = useSelector(selectSubmittingVinylId);
  const pending = submittingVinylId != null;
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (userId != null && !isAdmin && String(ownerId) === String(userId)) {
      dispatch(fetchReviewEligibility({ userId, vinylId }));
    }
  }, [dispatch, vinylId, userId, isAdmin, ownerId]);
  const submit = event => {
    event.preventDefault();
    if (pending || !eligibility || !eligibility.canReview) return Promise.resolve();
    if (!comment.trim()) {
      setError('Escribí un comentario antes de publicar.');
      return Promise.resolve();
    }
    setError('');
    return dispatch(createReview({
      vinylId: Number(vinylId),
      score: Number(score),
      comment: comment.trim()
    })).unwrap().then(() => {
      setComment('');
      if (onChanged) onChanged();
    }).catch(requestError => {
      setError(getMessage(requestError));
    });
  };
  if (!user) return <button type="button" onClick={onLogin}>Iniciá sesión para escribir una reseña</button>;
  if (isAdmin) return <p>Los administradores pueden moderar reseñas, pero no publicarlas.</p>;
  if (loading) return <p role="status">Comprobando tu compra…</p>;
  return <section className="review-composer">
      <h3>Tu reseña</h3>
      {(error || request.error) && <p role="alert">{error || request.error}</p>}
      {!eligibility && <button type="button" onClick={() => dispatch(fetchReviewEligibility({ userId, vinylId, force: true }))}>Reintentar</button>}
      {eligibility && eligibility.review && <ReviewCard review={eligibility.review} onChanged={onChanged} />}
      {eligibility && !eligibility.purchased && !eligibility.review && <p>Podés reseñar este vinilo cuando una orden tuya que lo incluya figure como entregada.</p>}
      {eligibility && eligibility.canReview && <form className="review-edit-form" onSubmit={submit}>
          <label htmlFor={`new-review-score-${vinylId}`}>Puntaje</label>
          <select id={`new-review-score-${vinylId}`} value={score} disabled={pending} onChange={event => setScore(event.target.value)}>
            {[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{value} de 5</option>)}
          </select>
          <label htmlFor={`new-review-comment-${vinylId}`}>Tu comentario</label>
          <textarea id={`new-review-comment-${vinylId}`} value={comment} required maxLength={1000} disabled={pending} onChange={event => setComment(event.target.value)} />
          <button type="submit" disabled={pending}>{pending ? 'Publicando…' : 'Publicar reseña'}</button>
        </form>}
    </section>;
};
export default ReviewComposer;
