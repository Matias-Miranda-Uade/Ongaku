import { getMediaSource } from '../audio/mediaSource.js'

// El catálogo y el detalle usan audioPreviewId y albumUrl.
export const getAlbumPreview = (album, preview) => {
  const source = getMediaSource(preview?.url) || getMediaSource(album.albumUrl)
  return source ? { ...preview, url: source.url } : null
}
