export const getAlbumUrl = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'music.apple.com' && !url.username && !url.password && url.pathname.includes('/album/')
      ? url.href : null
  } catch {
    return null
  }
}
