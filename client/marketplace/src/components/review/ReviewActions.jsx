import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { deleteReview, updateReview } from '../../services/reviewService';
const ReviewActions = ({
  review,
  onChanged
}) => {
  const {
    user,
    isAdmin
  } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [score, setScore] = useState(review.score != null ? review.score : 5);
  const [comment, setComment] = useState(review.comment != null ? review.comment : '');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const isAuthor = Boolean(user) && String(user.id) === String(review.userId);
  if (!isAuthor && !isAdmin) return null;
  const save = event => {
    event.preventDefault();
    setError('');
    if (!comment.trim() || Number(score) < 1 || Number(score) > 5) {
      setError('Completá el comentario y elegí un puntaje entre 1 y 5.');
      return Promise.resolve();
    }
    setPending(true);
    return Promise.resolve(updateReview(review.id, {
      score: Number(score),
      comment: comment.trim()
    })).then(() => {
      setEditing(false);
      onChanged();
    }).catch(requestError => {
      setError(requestError.message);
    }).finally(() => {
      setPending(false);
    });
  };
  const remove = () => {
    setError('');
    setPending(true);
    return Promise.resolve(deleteReview(review.id)).then(() => {
      onChanged();
    }).catch(requestError => {
      setError(requestError.message);
    }).finally(() => {
      setPending(false);
    });
  };
  return <div className="review-management">
      {error && <p className="form-error" role="alert">{error}</p>}
      {editing ? <form className="review-edit-form" onSubmit={save}>
          <label htmlFor={`review-score-${review.id}`}>Puntaje</label>
          <select id={`review-score-${review.id}`} value={score} disabled={pending} onChange={event => setScore(event.target.value)}>
            {[1, 2, 3, 4, 5].map(value => <option value={value} key={value}>{value} de 5</option>)}
          </select>
          <label htmlFor={`review-comment-${review.id}`}>Comentario</label>
          <textarea id={`review-comment-${review.id}`} value={comment} required maxLength={1000} disabled={pending} onChange={event => setComment(event.target.value)} />
          <div className="review-actions">
            <button type="submit" disabled={pending}>{pending ? 'Guardando…' : 'Guardar'}</button>
            <button type="button" disabled={pending} onClick={() => {
          setEditing(false);
          setError('');
        }}>Cancelar</button>
          </div>
        </form> : <div className="review-actions">
          {isAuthor && !isAdmin && !confirmDelete && <button type="button" disabled={pending} onClick={() => {
        setScore(review.score != null ? review.score : 5);
        setComment(review.comment != null ? review.comment : '');
        setError('');
        setEditing(true);
      }}>EDITAR</button>}
          {confirmDelete ? <>
            <span>¿Eliminar esta reseña?</span>
            <button type="button" disabled={pending} onClick={remove}>{pending ? 'Eliminando…' : 'Confirmar'}</button>
            <button type="button" disabled={pending} onClick={() => setConfirmDelete(false)}>Cancelar</button>
          </> : <button type="button" disabled={pending} onClick={() => setConfirmDelete(true)}>ELIMINAR</button>}
        </div>}
    </div>;
};
export default ReviewActions;
