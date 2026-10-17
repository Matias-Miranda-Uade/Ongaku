import { getMediaSource } from './mediaSource'
import AudioPlayer from './AudioPlayer'

const MediaPlayer = ({ url, durationSeconds, id }) => {
  const source = getMediaSource(url)
  if (!source) return <p role="alert">Este enlace no es compatible. Usá un archivo de audio o un enlace de Spotify, Apple Music o YouTube.</p>
  return <div className="media-player">
    {source.type === 'embed'
      ? <iframe key={source.embedUrl} src={source.embedUrl} title={`Escuchar en ${source.platform}`}
          width="100%" height={source.height} loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
      : <AudioPlayer preview={{ id: id ?? source.url, url: source.url, durationSeconds }} />}
    <a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">{source.type === 'embed' ? `Abrir en ${source.platform}` : 'Abrir audio'} ↗</a>
  </div>
}
export default MediaPlayer
