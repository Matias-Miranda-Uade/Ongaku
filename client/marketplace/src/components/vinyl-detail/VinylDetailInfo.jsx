import AddToCartButton from '../vinyl/AddToCartButton'
import FavoriteButton from '../vinyl/FavoriteButton'
import VinylPrice from '../vinyl/VinylPrice'
import VinylFeatures from './VinylFeatures'
import VinylMetadata from './VinylMetadata'
import StockIndicator from './StockIndicator'

const VinylDetailInfo = ({ vinyl }) => (
  <section className="detail-info">
    <p className="eyebrow">{vinyl.artistName || 'ONGAKU SELECTION'}</p>
    <h1>{vinyl.name}</h1>
    <p className="detail-description">{vinyl.description}</p>
    <VinylPrice vinyl={vinyl} />
    <StockIndicator stock={vinyl.stock} />
    <VinylMetadata vinyl={vinyl} />
    <VinylFeatures />
    <div className="detail-actions">
      <AddToCartButton vinyl={vinyl} />
      <FavoriteButton vinyl={vinyl} />
    </div>
  </section>
)
export default VinylDetailInfo
