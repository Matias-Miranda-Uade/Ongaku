import useFavorites from '../../hooks/useFavorites'
import { useAuth } from '../../context/AuthContext'

const FavoriteButton = ({ vinyl }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isAdmin } = useAuth()
  const favorite = vinyl ? isFavorite(vinyl.id) : false

  if (isAdmin) return null

  return (
    <button
      className={`icon-action ${favorite ? 'is-active' : ''}`}
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        if (!vinyl) return
        toggleFavorite({
          ...vinyl,
          artist: vinyl.artist || vinyl.artistName || `Artista #${vinyl.artistId ?? '—'}`,
          price: vinyl.finalPrice ?? vinyl.price,
        })
      }}
      aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {favorite ? '♥' : '♡'}
    </button>
  )
}
export default FavoriteButton
