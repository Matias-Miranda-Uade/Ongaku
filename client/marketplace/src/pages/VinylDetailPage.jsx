import { useEffect, useState } from 'react'
import AudioPreview from '../components/audio/AudioPreview'
import ReviewCard from '../components/review/ReviewCard'
import RatingStars from '../components/ui/RatingStars'
import VinylDetailInfo from '../components/vinyl-detail/VinylDetailInfo'
import VinylGallery from '../components/vinyl-detail/VinylGallery'
import { getReviewsByVinyl, getVinylById } from '../services/api'

const VinylDetailPage = ({ vinylId, onBack, onReviews }) => {
  const [vinyl, setVinyl] = useState(null)
  const [reviewData, setReviewData] = useState({ reviews: [], averageScore: 0, totalReviews: 0 })

  useEffect(() => {
    setVinyl(null)
    getVinylById(vinylId).then(setVinyl)
    getReviewsByVinyl(vinylId).then(setReviewData)
  }, [vinylId])

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
          {reviewData.reviews.slice(0, 2).map((review) => <ReviewCard key={review.id} review={review} />)}
          {!reviewData.reviews.length && <p className="empty-state">Todavía no hay reseñas para este vinilo.</p>}
        </div>
        <button className="text-link link-button" type="button" onClick={onReviews}>VER TODAS LAS RESEÑAS →</button>
      </section>
    </div>
  )
}
export default VinylDetailPage
