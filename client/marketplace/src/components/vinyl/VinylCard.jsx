import AddToCartButton from './AddToCartButton'
import FavoriteButton from './FavoriteButton'
import VinylImage from './VinylImage'
import VinylInfo from './VinylInfo'
import { useRadio, hasPreview } from '../../context/RadioContext'

const VinylCard = ({ vinyl, onOpen }) => {
  const radio = useRadio()
  const active = String(radio.track?.vinyl.id) === String(vinyl.id)
  return (
  <article className="vinyl-card">
    <div
      className="vinyl-card-link"
      role="button"
      tabIndex={0}
      onClick={() => { if (onOpen) onOpen(vinyl.id) }}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && onOpen) {
          event.preventDefault()
          onOpen(vinyl.id)
        }
      }}
    >
      <div className={`vinyl-card-media ${vinyl.stock <= 0 ? 'is-out-of-stock' : ''}`}>
        <VinylImage src={vinyl.image} alt={vinyl.name} />
        {vinyl.stock <= 0 && <span className="stock-out-overlay">SIN STOCK</span>}
        <FavoriteButton vinyl={vinyl} />
        {vinyl.discountPercentage > 0 && <span className="discount-sticker">-{vinyl.discountPercentage}%</span>}
      </div>
      <VinylInfo vinyl={vinyl} />
    </div>
    {hasPreview(vinyl) && <button type="button" className="music-button music-button-outline catalog-radio-button" disabled={radio.loading} onClick={() => active && radio.track.source.type === 'audio' ? radio.toggle() : active ? radio.setMinimized(false) : radio.playVinyl(vinyl)}>{active && radio.playing ? 'Ⅱ Pausar preview' : active && radio.track.source.type === 'embed' ? 'Abrir Radio ↗' : '▶ Escuchar preview'}</button>}
    <AddToCartButton vinyl={vinyl} compact />
  </article>
)
}
export default VinylCard
