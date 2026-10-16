import AddToCartButton from './AddToCartButton'
import FavoriteButton from './FavoriteButton'
import VinylImage from './VinylImage'
import VinylInfo from './VinylInfo'

const VinylCard = ({ vinyl, onOpen }) => (
  <article className="vinyl-card">
    <div
      className="vinyl-card-link"
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(vinyl.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onOpen?.(vinyl.id)
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
    <AddToCartButton vinyl={vinyl} compact />
  </article>
)
export default VinylCard
