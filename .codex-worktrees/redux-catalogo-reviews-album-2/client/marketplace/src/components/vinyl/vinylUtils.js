export function getVinylPrice(vinyl) {
  if (vinyl.finalPrice !== null && vinyl.finalPrice !== undefined) {
    return vinyl.finalPrice
  }
  return vinyl.price
}
