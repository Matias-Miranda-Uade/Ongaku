import { getAlbumUrl } from './albumUrl'

const AlbumLink = ({ url }) => {
  const href = getAlbumUrl(url)
  if (!href) return null
  const platform = new URL(href).hostname === 'open.spotify.com' ? 'Spotify' : 'Apple Music'
  return (
    <div className="album-listen">
      <a href={href} target="_blank" rel="noopener noreferrer" className="album-listen-link">
        Ver canciones y escuchar en {platform} <span aria-hidden="true">↗</span>
      </a>
      <p>Abre el álbum en una nueva pestaña. Las muestras y la reproducción completa dependen de la disponibilidad en tu región y de tu suscripción.</p>
    </div>
  )
}

export default AlbumLink
