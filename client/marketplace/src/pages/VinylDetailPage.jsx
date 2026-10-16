import { useEffect, useState } from 'react'
import AudioPreview from '../components/audio/AudioPreview'
import ReviewCard from '../components/review/ReviewCard'
import ReviewComposer from '../components/review/ReviewComposer'
import RatingStars from '../components/ui/RatingStars'
import VinylDetailInfo from '../components/vinyl-detail/VinylDetailInfo'
import VinylGallery from '../components/vinyl-detail/VinylGallery'
import { getVinylById } from '../services/vinylService'
import { getReviewsByVinyl } from '../services/reviewService'

const VinylDetailPage = ({ vinylId, onBack, onReviews, onLogin }) => {
  const [vinyl, setVinyl] = useState(null)
  const [reviewData, setReviewData] = useState({ reviews: [], averageScore: 0, totalReviews: 0 })
  const [error, setError] = useState(null)
  const [reviewError, setReviewError] = useState('')
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reload, setReload] = useState(0)
  const [reviewReload, setReviewReload] = useState(0)

  useEffect(() => {
    setVinyl(null)
    setError(null)
    let active = true
    getVinylById(vinylId)
      .then((data) => { if (active) setVinyl(data) })
      .catch((requestError) => { if (active) setError(requestError) })
    return () => { active = false }
  }, [vinylId, reload])

  useEffect(() => {
    let active = true
    setReviewsLoading(true)
    setReviewError('')
    setReviewData({ reviews: [], averageScore: 0, totalReviews: 0 })
    getReviewsByVinyl(vinylId)
      .then((data) => { if (active) setReviewData(data) })
      .catch((requestError) => { if (active) setReviewError(requestError.message) })
      .finally(() => { if (active) setReviewsLoading(false) })
    return () => { active = false }
  }, [vinylId, reload, reviewReload])

  if (error?.isUnauthorized) return (
    <div className="page detail-page">
      <button className="back-link link-button" type="button" onClick={onBack}>← VOLVER AL CATÁLOGO</button>
      <section className="login-gate" aria-labelledby="login-gate-title">
        <div className="login-gate-art" aria-hidden="true">
          <span className="login-gate-record"><span /></span>
          <span className="login-gate-orbit login-gate-orbit-one" />
          <span className="login-gate-orbit login-gate-orbit-two" />
        </div>
        <div className="login-gate-copy">
          <p className="eyebrow">ONGAKU / ARCHIVO ANALÓGICO</p>
          <h1 id="login-gate-title">Este vinilo te está esperando.</h1>
          <p>Iniciá sesión para descubrir todos los detalles, escuchar su adelanto y leer las reseñas de la comunidad.</p>
          <button className="primary-button" type="button" onClick={onLogin}>Iniciar sesión</button>
        </div>
      </section>
    </div>
  )

  if (error) return (
    <div className="page detail-page">
      <button className="back-link link-button" type="button" onClick={onBack}>← VOLVER AL CATÁLOGO</button>
      <div role="alert"><p>{error.message}</p><button type="button" onClick={() => setReload((value) => value + 1)}>Reintentar</button></div>
    </div>
  )

  if (!vinyl) return <div className="page loading-page">Cargando vinilo…</div>

  return (
    <div className="page detail-page">
      <button className="back-link link-button" type="button" onClick={onBack}>← VOLVER AL CATÁLOGO</button>
      <div className="detail-layout">
        <VinylGallery vinyl={vinyl} />
        <VinylDetailInfo vinyl={vinyl} />
      </div>

      <AudioPreview audioPreviewId={vinyl.audioPreviewId} />

      <section className="detail-reviews">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">RESEÑAS</p>
            <h2>Lo que dice la comunidad</h2>
          </div>
          <div className="detail-score">
            <strong>{Number(reviewData.averageScore || 0).toFixed(1)}</strong>
            <RatingStars value={reviewData.averageScore} />
          </div>
        </div>
        <div className="review-list compact-list">
          {reviewsLoading && <p role="status">Cargando reseñas…</p>}
          {reviewError && <div role="alert"><p>{reviewError}</p><button type="button" onClick={() => setReviewReload((value) => value + 1)}>Reintentar</button></div>}
          {!reviewsLoading && !reviewError && reviewData.reviews.slice(0, 2).map((review) => (
            <ReviewCard key={review.id} review={review} onChanged={() => setReviewReload((value) => value + 1)} />
          ))}
          {!reviewsLoading && !reviewError && !reviewData.reviews.length && <p className="empty-state">Todavía no hay reseñas para este vinilo.</p>}
        </div>
        <button className="text-link link-button" type="button" onClick={onReviews}>VER TODAS LAS RESEÑAS →</button>
        <ReviewComposer key={vinylId} vinylId={vinylId} revision={reviewReload} onChanged={() => setReviewReload((value) => value + 1)} onLogin={onLogin} />
      </section>
    </div>
  )
}
export default VinylDetailPage
