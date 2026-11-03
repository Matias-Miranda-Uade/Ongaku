export const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
export const moods = [
  { id: 'chill', name: 'Chill', jp: '静', color: '#8baa9b', pattern: /\b(ambient|downtempo|chill|lo-fi|bossa nova|relajante)\b/ },
  { id: 'nostalgic', name: 'Nostálgico', jp: '懐', color: '#c7a077', pattern: /\b(nostalgia|nostalgico|nostalgica|retro|synthwave)\b/ },
  { id: 'energy', name: 'Energético', jp: '動', color: '#d36c52', pattern: /\b(punk|hard rock|metal|hardcore|techno|dance|energetico|energetica)\b/ },
  { id: 'night', name: 'Nocturno', jp: '夜', color: '#9293bb', pattern: /\b(nocturno|nocturna|nocturnal|trip-hop|dark ambient)\b/ },
  { id: 'romantic', name: 'Romántico', jp: '愛', color: '#c38f9e', pattern: /\b(romantico|romantica|romantic|balada|bolero)\b/ },
]
// Selección editorial de álbumes existentes. No agrega productos ni cambia sus datos.
// Se exige álbum + artista para no asignar otro disco con el mismo título.
export const moodSelections = {
  chill: [
    ['Kind of Blue', 'Miles Davis'], ['Time Out', 'The Dave Brubeck Quartet'],
    ['Artaud', 'Pescado Rabioso'], ['Fuerza Natural', 'Gustavo Cerati'],
  ],
  nostalgic: [
    ['Abbey Road', 'The Beatles'], ['Rumours', 'Fleetwood Mac'],
    ['Clics Modernos', 'Charly García'], ['Signos', 'Soda Stereo'],
    ['Wish You Were Here', 'Pink Floyd'], ['Rubber Soul', 'The Beatles'],
  ],
  energy: [
    ['Nevermind', 'Nirvana'], ['Discovery', 'Daft Punk'],
    ['Random Access Memories', 'Daft Punk'], ['Homework', 'Daft Punk'],
    ['Canción Animal', 'Soda Stereo'], ['Ahí Vamos', 'Gustavo Cerati'],
    ['Led Zeppelin II', 'Led Zeppelin'], ['Dig Your Own Hole', 'The Chemical Brothers'],
  ],
  night: [
    ['Mezzanine', 'Massive Attack'], ['Dummy', 'Portishead'],
    ['Bocanada', 'Gustavo Cerati'], ['AM', 'Arctic Monkeys'],
    ['The Dark Side of the Moon', 'Pink Floyd'], ['Homogenic', 'Björk'],
  ],
  romantic: [
    ['I Put a Spell on You', 'Nina Simone'], ['Back to Black', 'Amy Winehouse'],
    ["What's Going On", 'Marvin Gaye'], ['Songs in the Key of Life', 'Stevie Wonder'],
    ['The Miseducation of Lauryn Hill', 'Lauryn Hill'],
  ],
}
export function matchesMood(vinyl, moodId) {
  const mood = moods.find(item => item.id === moodId)
  if (!mood) return true
  const curated = moodSelections[moodId]?.some(([album, artist]) => normalize(vinyl.name).trim() === normalize(album).trim() && normalize(vinyl.artistName).trim() === normalize(artist).trim())
  if (curated) return true
  // Para otros discos se requieren metadatos musicales explícitos.
  return mood.pattern.test(normalize([...(vinyl.genreNames || []), vinyl.genreName, vinyl.description].filter(Boolean).join(' ')))
}
export function chooseSurprise(catalog, previousId, random = Math.random) {
  const pool = catalog.length > 1 ? catalog.filter(item => String(item.id) !== String(previousId)) : catalog
  return pool.length ? pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))]?.id : null
}
