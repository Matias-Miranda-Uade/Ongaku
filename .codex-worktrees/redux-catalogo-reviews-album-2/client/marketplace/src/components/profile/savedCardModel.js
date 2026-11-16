export const emptySavedCard = { holder: '', brand: 'VISA', lastFour: '', expiry: '' }
export const validateSavedCard = (card, now = new Date()) => {
  const errors = {}
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .’'-]*[\p{L}\p{M}]$/u.test(card.holder.trim()) || card.holder.trim().length > 120) errors.holder = 'Ingresá un titular válido, sin números.'
  if (!['VISA', 'MASTERCARD', 'AMEX'].includes(card.brand)) errors.brand = 'Elegí una marca válida.'
  if (!/^\d{4}$/.test(card.lastFour)) errors.lastFour = 'Ingresá solamente los últimos cuatro dígitos.'
  const match = /^(20\d{2})-(0[1-9]|1[0-2])$/.exec(card.expiry)
  if (!match || Number(match[1]) < now.getFullYear() || (Number(match[1]) === now.getFullYear() && Number(match[2]) < now.getMonth() + 1)) errors.expiry = 'Elegí un vencimiento vigente.'
  return errors
}
export const toSavedCardPayload = (card) => {
  const [expiryYear, expiryMonth] = card.expiry.split('-').map(Number)
  return { holder: card.holder.trim(), brand: card.brand, lastFour: card.lastFour, expiryMonth, expiryYear }
}
