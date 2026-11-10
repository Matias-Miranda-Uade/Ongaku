import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AudioPreview from '../components/audio/AudioPreview'
import ReviewCard from '../components/review/ReviewCard'
import ReviewComposer from '../components/review/ReviewComposer'
import RatingStars from '../components/ui/RatingStars'
import VinylDetailInfo from '../components/vinyl-detail/VinylDetailInfo'
import VinylGallery from '../components/vinyl-detail/VinylGallery'
import { fetchVinylById } from '../Redux/slices/catalogSlice.js';
import { fetchReviews, selectReviewData } from '../Redux/slices/reviewsSlice.js';

import { emptyRequest } from '../Redux/requestState.js'

const VinylDetailPage = ({ vinylId, onBack, onReviews, onLogin }) => {
  const dispatch = useDispatch()
  const vinyl = useSelector(state => state.catalog.entities[vinylId])
  const detailRequest = useSelector(state => state.catalog.details[vinylId] || emptyRequest)
  const reviewData = useSelector(state => selectReviewData(state, vinylId))
  const error = detailRequest.error
  const reviewError = reviewData.error
  const reviewsLoading = reviewData.status === 'idle' || reviewData.status === 'loading'

  useEffect(() => {
    dispatch(fetchVinylById({ vinylId }))
    dispatch(fetchReviews({ vinylId }))
  }, [dispatch, vinylId])

  if (error) return (
    <div className="page detail-page">
      <button className="back-link link-button" type="button" onClick={onBack}>← VOLVER AL CATÁLOGO</button>
      <div role="alert"><p>{error}</p><button type="button" onClick={() => dispatch(fetchVinylById({ vinylId, force: true }))}>Reintentar</button></div>
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

      <AudioPreview audioPreviewId={vinyl.audioPreviewId} externalUrl={vinyl.albumUrl} />

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
          {reviewError && <div role="alert"><p>{reviewError}</p><button type="button" onClick={() => dispatch(fetchReviews({ vinylId, force: true }))}>Reintentar</button></div>}
          {!reviewsLoading && !reviewError && reviewData.reviews.slice(0, 2).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {!reviewsLoading && !reviewError && !reviewData.reviews.length && <p className="empty-state">Todavía no hay reseñas para este vinilo.</p>}
        </div>
        <button className="text-link link-button" type="button" onClick={onReviews}>VER TODAS LAS RESEÑAS →</button>
        <ReviewComposer key={vinylId} vinylId={vinylId} onLogin={onLogin} />
      </section>
    </div>
  )
}
export default VinylDetailPage
