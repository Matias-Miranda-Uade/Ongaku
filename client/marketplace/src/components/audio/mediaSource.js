// Solo construimos iframes para plataformas conocidas; el resto usa audio nativo.
export const getMediaSource = (value) => {
  const text = String(value ?? '').trim()
  if (!text || text.length > 2048) return null
  if (text.startsWith('/') && !text.startsWith('//') && !text.includes('\\')) return { type: 'audio', url: text }
  try {
    const url = new URL(text)
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null
    const secure = url.protocol === 'https:' && (!url.port || url.port === '443')
    const host = url.hostname
    const spotify = url.pathname.match(/^\/(?:intl-[a-z]{2}\/)?(album|track)\/([a-zA-Z0-9]{22})\/?$/)
    if (host === 'open.spotify.com') return spotify && secure
      ? { type: 'embed', platform: 'Spotify', url: url.href, embedUrl: `https://open.spotify.com/embed/${spotify[1]}/${spotify[2]}`, height: spotify[1] === 'track' ? 152 : 352 } : null
    if (host === 'music.apple.com') {
      if (!secure || !/^\/(?:[a-z]{2}\/)?(album|song)\/(?:[^/]+\/)?\d+\/?$/.test(url.pathname)) return null
      return { type: 'embed', platform: 'Apple Music', url: url.href, embedUrl: `https://embed.music.apple.com${url.pathname}${url.search}`, height: url.pathname.includes('/song/') || url.searchParams.has('i') ? 175 : 450 }
    }
    if (['www.youtube.com', 'youtube.com', 'music.youtube.com', 'youtu.be'].includes(host)) {
      const id = host === 'youtu.be' ? url.pathname.slice(1) : url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)$/)?.[1]
      if (!secure || !/^[a-zA-Z0-9_-]{11}$/.test(id ?? '')) return null
      return { type: 'embed', platform: 'YouTube', url: url.href, embedUrl: `https://www.youtube-nocookie.com/embed/${id}`, height: 315 }
    }
    if (host.endsWith('spotify.com') || host.endsWith('apple.com') || host.endsWith('youtube.com')) return null
    return { type: 'audio', url: url.href }
  } catch { return null }
}
