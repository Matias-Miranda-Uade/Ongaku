import { getMediaSource } from '../audio/mediaSource.js'

// El catálogo y el detalle usan audioPreviewId y albumUrl.
export const getAlbumPreview = (album, preview) => {
  const source = getMediaSource(preview?.url) || getMediaSource(album.albumUrl)
  return source ? { ...preview, url: source.url } : null
}

// Si queda un solo disco y ya fue elegido, no lo vuelve a seleccionar.
export const chooseRandomAlbum = (albums, previousId) => {
  const candidates = albums.filter(album => String(album.id) !== String(previousId))
  return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null
}
