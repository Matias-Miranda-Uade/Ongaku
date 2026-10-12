
const moneyFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const compactFormatter = new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 })
const numberFormatter = new Intl.NumberFormat('es-AR')
const dateFormatter = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
const dayFormatter = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' })

export const formatMoney = (value) => moneyFormatter.format(Number(value) || 0)
export const formatCompactMoney = (value) => `$ ${compactFormatter.format(Number(value) || 0)}`
export const formatNumber = (value) => numberFormatter.format(Number(value) || 0)
export const formatDateTime = (value) => (value ? dateFormatter.format(new Date(value)) : '—')
export const formatDay = (value) => dayFormatter.format(value instanceof Date ? value : new Date(value))

export const LOW_STOCK_THRESHOLD = 3

export const getStockStatus = (stock) => {
  const units = Number(stock) || 0
  if (units <= 0) return 'out'
  if (units <= LOW_STOCK_THRESHOLD) return 'low'
  return 'ok'
}

export const STOCK_STATUS_LABELS = {
  ok: 'En stock',
  low: 'Stock bajo',
  out: 'Sin stock',
}

export const REVENUE_STATUSES = ['PAGADA', 'ENVIADA', 'ENTREGADA']

export const orderStatusName = (order) =>
  (order?.orderStatus?.name ?? order?.status ?? '').toString().toUpperCase()

export const ORDER_TRANSITIONS = {
  PENDIENTE: ['PAGADA', 'CANCELADA'],
  PAGADA: ['ENVIADA', 'CANCELADA'],
  ENVIADA: ['ENTREGADA'],
  ENTREGADA: [],
  CANCELADA: [],
}

export const indexById = (list = []) =>
  list.reduce((acc, item) => {
    acc[String(item.id)] = item
    return acc
  }, {})

export const normalizeText = (value = '') =>
  value.toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export const computeFinalPrice = (price, discountPercentage = 0) => {
  const base = Number(price) || 0
  const discount = Math.min(100, Math.max(0, Number(discountPercentage) || 0))
  return Math.floor((base * (100 - discount) + 50) / 100)
}
