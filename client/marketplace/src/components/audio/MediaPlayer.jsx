import { getMediaSource } from './mediaSource'
import AudioPlayer from './AudioPlayer'
import { useEffect, useState } from 'react'
import { claimPlayback } from './playback'

const EmbeddedPlayer = ({ source, autoPlay }) => {
  const [active, setActive] = useState(true)
  useEffect(() => {
    if (!active) return
    return claimPlayback(() => setActive(false))
  }, [active])
  if (!active) return <button type="button" onClick={() => setActive(true)}>Escuchar en {source.platform}</button>
  // YouTube admite autoplay por URL. Los demás conservan sus controles oficiales.
  const src = autoPlay && source.platform === 'YouTube' ? `${source.embedUrl}?autoplay=1` : source.embedUrl
  return <iframe src={src} title={`Escuchar en ${source.platform}`}
    width="100%" height={source.height} loading={autoPlay ? 'eager' : 'lazy'}
    allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
}

const MediaPlayer = ({ url, durationSeconds, id, autoPlay = false }) => {
  const source = getMediaSource(url)
  if (!source) return <p role="alert">Este enlace no es compatible. Usá un archivo de audio o un enlace de Spotify, Apple Music o YouTube.</p>
  return <div className="media-player">
    {source.type === 'embed'
      ? <EmbeddedPlayer key={source.embedUrl} source={source} autoPlay={autoPlay} />
      : <AudioPlayer preview={{ id: id ?? source.url, url: source.url, durationSeconds }} autoPlay={autoPlay} />}
    {source.type === 'audio' && <a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">Abrir audio ↗</a>}
  </div>
}
export default MediaPlayer
