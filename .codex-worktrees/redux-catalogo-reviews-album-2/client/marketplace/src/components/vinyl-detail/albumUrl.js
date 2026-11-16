import { getMediaSource } from '../audio/mediaSource.js'
export const getAlbumUrl = (value) => {
  const source = getMediaSource(value)
  return source?.type === 'embed' ? source.url : null
}
