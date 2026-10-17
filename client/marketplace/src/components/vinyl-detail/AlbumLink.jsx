import { getAlbumUrl } from './albumUrl'
import { getMediaSource } from '../audio/mediaSource'

const AlbumLink = ({ url }) => {
  const href = getAlbumUrl(url)
  if (!href) return null
  const platform = getMediaSource(href).platform
  return (
    <div className="album-listen">
      <a href={href} target="_blank" rel="noopener noreferrer" className="album-listen-link">
        Abrir en {platform} <span aria-hidden="true">↗</span>
      </a>
      <p>Abre la canción o el álbum en una nueva pestaña. La reproducción depende de la disponibilidad de la plataforma.</p>
    </div>
  )
}

export default AlbumLink
