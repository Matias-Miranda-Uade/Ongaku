import { useEffect, useState } from 'react'
import { getAudioPreview } from '../../services/vinylService'
import MediaPlayer from './MediaPlayer'

const AudioPreview = ({ audioPreviewId, externalUrl }) => {
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setPreview(null)
    setError('')
    setLoading(true)
    getAudioPreview(audioPreviewId)
      .then((data) => { if (active) setPreview(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [audioPreviewId])

  if (!audioPreviewId && !externalUrl) return null
  return (
    <section className="audio-preview-section">
      <div>
        <p className="eyebrow">PREVIEW</p>
        <h2>Escuchá el vinilo</h2>
      </div>
      {loading ? <p role="status">Cargando audio…</p>
        : error ? <p role="alert">{error}</p>
          : preview?.url || externalUrl ? <MediaPlayer id={preview?.id} url={preview?.url || externalUrl} durationSeconds={preview?.durationSeconds} /> : <p>No hay audio disponible.</p>}
    </section>
  )
}
export default AudioPreview
