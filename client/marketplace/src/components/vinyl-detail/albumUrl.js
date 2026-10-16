export const getAlbumUrl = (value) => {
  try {
    const url = new URL(value)
    const album = (url.hostname === 'music.apple.com' && /^\/(?:[a-z]{2}\/)?album\/(?:[^/]+\/)?\d+\/?$/.test(url.pathname))
      || (url.hostname === 'open.spotify.com' && /^\/(?:intl-[a-z]{2}\/)?album\/[a-zA-Z0-9]{22}\/?$/.test(url.pathname))
    return url.protocol === 'https:' && (!url.port || url.port === '443') && !url.username && !url.password && album
      ? url.href : null
  } catch {
    return null
  }
}
