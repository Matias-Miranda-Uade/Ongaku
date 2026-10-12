import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { createReview, getReviewEligibility } from '../../services/reviewService'
import ReviewCard from './ReviewCard'

const ReviewComposer = ({ vinylId, revision, onChanged, onLogin }) => {
  const { user, isAdmin } = useAuth()
  const [eligibility, setEligibility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    setEligibility(null)
    setError('')
    setLoading(true)
    if (!user || isAdmin) { setLoading(false); return }
    getReviewEligibility(vinylId)
      .then((data) => { if (active) setEligibility(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [vinylId, user?.id, isAdmin, revision, reload])

  const submit = async (event) => {
    event.preventDefault()
    if (pending || !eligibility?.canReview) return
    if (!comment.trim()) { setError('Escribí un comentario antes de publicar.'); return }
    setPending(true)
    setError('')
    try {
      const review = await createReview({ vinylId: Number(vinylId), score: Number(score), comment: comment.trim() })
      setEligibility((current) => ({ ...current, canReview: false, review }))
      setComment('')
      onChanged()
    } catch (requestError) {
      setError(requestError.message)
    } finally { setPending(false) }
  }

  if (!user) return <button type="button" onClick={onLogin}>Iniciá sesión para escribir una reseña</button>
  if (isAdmin) return <p>Los administradores pueden moderar reseñas, pero no publicarlas.</p>
  if (loading) return <p role="status">Comprobando tu compra…</p>

  return (
    <section className="review-composer">
      <h3>Tu reseña</h3>
      {error && <p role="alert">{error}</p>}
      {!eligibility && <button type="button" onClick={() => setReload((value) => value + 1)}>Reintentar</button>}
      {eligibility?.review && <ReviewCard review={eligibility.review} onChanged={onChanged} />}
      {eligibility && !eligibility.purchased && !eligibility.review && (
        <p>Podés reseñar este vinilo cuando una orden tuya que lo incluya esté pagada. Crear una orden pendiente todavía no habilita la reseña.</p>
      )}
      {eligibility?.canReview && (
        <form className="review-edit-form" onSubmit={submit}>
          <label htmlFor={`new-review-score-${vinylId}`}>Puntaje</label>
          <select id={`new-review-score-${vinylId}`} value={score} disabled={pending} onChange={(event) => setScore(event.target.value)}>
            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} de 5</option>)}
          </select>
          <label htmlFor={`new-review-comment-${vinylId}`}>Tu comentario</label>
          <textarea id={`new-review-comment-${vinylId}`} value={comment} required maxLength={1000} disabled={pending} onChange={(event) => setComment(event.target.value)} />
          <button type="submit" disabled={pending}>{pending ? 'Publicando…' : 'Publicar reseña'}</button>
        </form>
      )}
    </section>
  )
}

export default ReviewComposer
