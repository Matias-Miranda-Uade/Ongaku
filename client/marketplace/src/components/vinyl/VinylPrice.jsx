import Price from '../ui/Price'
import { getVinylPrice } from './vinylUtils'

const VinylPrice = ({ vinyl }) => (
  <Price value={getVinylPrice(vinyl)} originalValue={vinyl.originalPrice} />
)
export default VinylPrice
