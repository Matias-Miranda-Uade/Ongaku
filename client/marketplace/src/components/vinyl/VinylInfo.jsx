import VinylPrice from './VinylPrice'
import VinylTags from './VinylTags'

const VinylInfo = ({ vinyl }) => (
  <div className="vinyl-info">
    <p className="eyebrow">{vinyl.artistName || `ARTISTA #${vinyl.artistId ?? '—'}`}</p>
    <h2>{vinyl.name}</h2>
    <VinylTags vinyl={vinyl} />
    <VinylPrice vinyl={vinyl} />
  </div>
)
export default VinylInfo
