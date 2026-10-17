
import { getAlbumUrl } from '../../vinyl-detail/albumUrl.js'
import { getMediaSource } from '../../audio/mediaSource.js'

export const MAX_TEXT_LENGTH = 255
export const MAX_ALBUM_URL_LENGTH = 2048
export const MAX_PRICE = 2_147_483_647
export const MAX_STOCK = 100_000
export const MAX_AUDIO_SECONDS = 600
export const MIN_YEAR = 1900
export const maxYear = () => new Date().getFullYear() + 1

export const EMPTY_AUDIO = { mode: 'none', audioPreviewId: '', url: '', durationSeconds: '' }

export const EMPTY_VINYL = {
  name: '',
  artistId: '',
  categoryId: '',
  genreId: '',
  genreIds: [],
  year: '',
  description: '',
  price: '',
  discountPercentage: '0',
  stock: '0',
  image: '',
  albumUrl: '',
  enabled: true,
  audio: EMPTY_AUDIO,
}

const idOrEmpty = (value) => (value === null || value === undefined ? '' : String(value))
const numberOrEmpty = (value) => (value === null || value === undefined ? '' : String(value))

export const toFormValues = (vinyl) => {
  if (!vinyl) return EMPTY_VINYL
  return {
    name: vinyl.name ?? '',
    artistId: idOrEmpty(vinyl.artistId),
    categoryId: idOrEmpty(vinyl.categoryId),
    genreId: idOrEmpty(vinyl.genreId),
    genreIds: (vinyl.genreIds?.length ? vinyl.genreIds : vinyl.genreId ? [vinyl.genreId] : []).map(String),
    year: numberOrEmpty(vinyl.year || ''),
    description: vinyl.description ?? '',
    price: numberOrEmpty(vinyl.originalPrice || vinyl.price),
    discountPercentage: numberOrEmpty(vinyl.discountPercentage ?? 0),
    stock: numberOrEmpty(vinyl.stock ?? 0),
    image: vinyl.image ?? '',
    albumUrl: vinyl.albumUrl ?? '',
    enabled: vinyl.enabled ?? true,
    audio: vinyl.audioPreviewId
      ? { ...EMPTY_AUDIO, mode: 'existing', audioPreviewId: String(vinyl.audioPreviewId) }
      : EMPTY_AUDIO,
  }
}

const isInteger = (value) => /^-?\d+$/.test(String(value).trim())

const isValidUrl = (value) => {
  if (value.startsWith('/')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const validateVinyl = (values) => {
  const errors = {}
  const name = values.name.trim()
  if (!name) errors.name = 'El título es obligatorio.'
  else if (name.length > MAX_TEXT_LENGTH) errors.name = `Máximo ${MAX_TEXT_LENGTH} caracteres.`

  if (!String(values.year).trim()) errors.year = 'Indicá el año de edición.'
  else if (!isInteger(values.year)) errors.year = 'El año debe ser un número entero.'
  else if (Number(values.year) < MIN_YEAR || Number(values.year) > maxYear()) errors.year = `Debe estar entre ${MIN_YEAR} y ${maxYear()}.`

  if (!String(values.price).trim()) errors.price = 'El precio es obligatorio.'
  else if (!isInteger(values.price)) errors.price = 'Usá un monto entero en pesos, sin centavos.'
  else if (Number(values.price) <= 0) errors.price = 'El precio debe ser mayor a 0.'
  else if (Number(values.price) > MAX_PRICE) errors.price = 'El precio es demasiado alto.'

  if (!isInteger(values.discountPercentage)) errors.discountPercentage = 'El descuento debe ser un número entero.'
  else if (Number(values.discountPercentage) < 0 || Number(values.discountPercentage) > 100) errors.discountPercentage = 'Debe estar entre 0 y 100.'

  if (!String(values.stock).trim()) errors.stock = 'Indicá el stock disponible.'
  else if (!isInteger(values.stock)) errors.stock = 'El stock debe ser un número entero.'
  else if (Number(values.stock) < 0) errors.stock = 'El stock no puede ser negativo.'
  else if (Number(values.stock) > MAX_STOCK) errors.stock = `Máximo ${MAX_STOCK.toLocaleString('es-AR')} unidades.`

  if (values.description.length > MAX_TEXT_LENGTH) errors.description = `Máximo ${MAX_TEXT_LENGTH} caracteres.`

  const image = values.image.trim()
  if (image && image.length > MAX_TEXT_LENGTH) errors.image = `La URL no puede superar ${MAX_TEXT_LENGTH} caracteres.`
  else if (image && !isValidUrl(image)) errors.image = 'Ingresá una URL válida (https://…) o una ruta que empiece con /.'

  const { audio } = values
  const albumUrl = (values.albumUrl ?? '').trim()
  if (albumUrl.length > MAX_ALBUM_URL_LENGTH) errors.albumUrl = `Máximo ${MAX_ALBUM_URL_LENGTH} caracteres.`
  else if (albumUrl && !getAlbumUrl(albumUrl)) errors.albumUrl = 'Pegá el enlace de una canción o álbum de Spotify, Apple Music o un video de YouTube.'
  if (audio.mode === 'existing' && !audio.audioPreviewId) errors.audioPreviewId = 'Elegí una preview de la lista.'
  if (audio.mode === 'new') {
    const url = audio.url.trim()
    if (!url) errors.audioUrl = 'Ingresá la URL del audio.'
    else if (!getMediaSource(url)) errors.audioUrl = 'Ingresá un enlace de audio, Spotify, Apple Music o YouTube de hasta 2048 caracteres.'
    if (audio.durationSeconds && (!isInteger(audio.durationSeconds) || Number(audio.durationSeconds) <= 0)) errors.audioDuration = 'Indicá una duración positiva en segundos o dejala vacía para detectarla.'
    else if (Number(audio.durationSeconds) > MAX_AUDIO_SECONDS) errors.audioDuration = `La preview no puede durar más de ${MAX_AUDIO_SECONDS / 60} minutos.`
  }

  return errors
}

const toId = (value) => (value === '' || value === null || value === undefined ? null : Number(value))

export const toVinylPayload = (values, audioPreviewId) => ({
  name: values.name.trim(),
  description: values.description.trim(),
  price: Number(values.price),
  discountPercentage: Number(values.discountPercentage) || 0,
  stock: Number(values.stock),
  image: values.image.trim(),
  albumUrl: (values.albumUrl ?? '').trim(),
  year: Number(values.year),
  artistId: toId(values.artistId),
  categoryId: toId(values.categoryId),
  genreId: toId(values.genreId),
  genreIds: (values.genreIds ?? (values.genreId ? [values.genreId] : [])).map(Number),
  audioPreviewId: toId(audioPreviewId),
})

const SERVER_FIELD_MAP = {
  name: 'name',
  description: 'description',
  price: 'price',
  discountPercentage: 'discountPercentage',
  stock: 'stock',
  image: 'image',
  albumUrl: 'albumUrl',
  year: 'year',
  artistId: 'artistId',
  categoryId: 'categoryId',
  genreId: 'genreId',
  genreIds: 'genreIds',
  audioPreviewId: 'audioPreviewId',
  url: 'audioUrl',
  durationSeconds: 'audioDuration',
}

export const mapServerFieldErrors = (fieldErrors = {}) =>
  Object.entries(fieldErrors).reduce((acc, [field, message]) => {
    const key = SERVER_FIELD_MAP[field]
    if (key) acc[key] = message.charAt(0).toUpperCase() + message.slice(1)
    return acc
  }, {})

export const FIELD_ORDER = [
  'name', 'artistId', 'year', 'categoryId', 'genreIds', 'genreId', 'price', 'discountPercentage', 'stock',
  'description', 'image', 'albumUrl', 'audioPreviewId', 'audioUrl', 'audioDuration',
]
