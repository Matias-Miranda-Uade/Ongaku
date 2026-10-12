import VinylPrice from './VinylPrice'
import VinylTags from './VinylTags'
import StockIndicator from '../vinyl-detail/StockIndicator'

const VinylInfo = ({ vinyl }) => (
  <div className="vinyl-info">
    <p className="eyebrow">{vinyl.artistName || `ARTISTA #${vinyl.artistId ?? '—'}`}</p>
    <h2>{vinyl.name}</h2>
    <VinylTags vinyl={vinyl} />
    <VinylPrice vinyl={vinyl} />
    <StockIndicator stock={vinyl.stock} />
  </div>
)
export default VinylInfo
