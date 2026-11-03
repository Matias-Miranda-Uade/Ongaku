const normalize = value => String(value ?? '').trim().toLocaleLowerCase('es')
export const genresOf = vinyl => (vinyl.genreNames?.length ? vinyl.genreNames : [vinyl.genreName]).filter(Boolean)
export function recommendVinyls(current, catalog) {
  const genres = new Set(genresOf(current).map(normalize))
  return catalog.filter(item => String(item.id) !== String(current.id)).map(item => {
    const sameArtist = (current.artistId != null && item.artistId != null && String(current.artistId) === String(item.artistId)) || (normalize(current.artistName) && normalize(current.artistName) === normalize(item.artistName))
    const shared = genresOf(item).filter(genre => genres.has(normalize(genre)))
    const sameCategory = current.categoryId != null && item.categoryId != null && String(current.categoryId) === String(item.categoryId)
    return { vinyl: item, score: (sameArtist ? 8 : 0) + shared.length * 4 + (sameCategory ? 1 : 0), reason: sameArtist ? 'Más de este artista' : shared.length ? shared.join(' / ') : sameCategory ? item.categoryDescription || 'Misma categoría' : 'Explorá el catálogo' }
  }).sort((a, b) => b.score - a.score || String(a.vinyl.id).localeCompare(String(b.vinyl.id), 'es', { numeric: true })).slice(0, 10)
}
