import { useEffect, useState } from 'react'
import { getAudioPreview } from '../../services/api'
import AudioPlayer from './AudioPlayer'

const AudioPreview = ({ audioPreviewId }) => {
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    getAudioPreview(audioPreviewId).then(setPreview)
  }, [audioPreviewId])

  if (!audioPreviewId) return null
  return (
    <section className="audio-preview-section">
      <div>
        <p className="eyebrow">PREVIEW</p>
        <h2>Escuchá un fragmento</h2>
      </div>
      <AudioPlayer preview={preview} />
    </section>
  )
}
export default AudioPreview
