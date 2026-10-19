import { useContext } from 'react'
import { FavoritesContext } from '../../context/FavoritesContext'
import { AuthContext } from '../../context/AuthContext'
import { getVinylPrice } from './vinylUtils'

const FavoriteButton = ({ vinyl }) => {
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext)
  const { isAdmin } = useContext(AuthContext)
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
          artist: vinyl.artist || vinyl.artistName || `Artista #${vinyl.artistId != null ? vinyl.artistId : '—'}`,
          price: getVinylPrice(vinyl),
        })
      }}
      aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {favorite ? '♥' : '♡'}
    </button>
  )
}
export default FavoriteButton
