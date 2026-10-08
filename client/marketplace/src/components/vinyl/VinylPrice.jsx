import Price from '../ui/Price'

const VinylPrice = ({ vinyl }) => (
  <Price value={vinyl.finalPrice || vinyl.price} originalValue={vinyl.originalPrice} />
)
export default VinylPrice
