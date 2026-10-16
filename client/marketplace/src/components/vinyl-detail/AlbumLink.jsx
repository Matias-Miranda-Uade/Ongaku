import { getAlbumUrl } from './albumUrl'

const AlbumLink = ({ url }) => {
  const href = getAlbumUrl(url)
  if (!href) return null
  return (
    <div className="album-listen">
      <a href={href} target="_blank" rel="noopener noreferrer" className="album-listen-link">
        Ver canciones y escuchar en Apple Music <span aria-hidden="true">↗</span>
      </a>
      <p>Abre el álbum en una nueva pestaña. Las muestras y la reproducción completa dependen de la disponibilidad en tu región y de tu suscripción.</p>
    </div>
  )
}

export default AlbumLink
