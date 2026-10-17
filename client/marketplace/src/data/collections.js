export const collections = [
  { id: 'rock', name: 'Rock y alternativo', number: '01', subtitle: 'CLÁSICOS / GUITARRAS', image: '/covers/real/dark-side.jpg', genres: ['Rock', 'Rock alternativo', 'Grunge'] },
  { id: 'jazz', name: 'Jazz', number: '02', subtitle: 'SESIONES / IMPROVISACIÓN', image: '/covers/real/kind-of-blue.jpg', genres: ['Jazz'] },
  { id: 'electronic', name: 'Electrónica', number: '03', subtitle: 'RITMO / EXPLORACIÓN', image: '/covers/real/ram.jpg', genres: ['Electrónica'] },
  { id: 'national', name: 'Rock nacional', number: '04', subtitle: 'ARCHIVO / ARGENTINA', image: '/covers/real/cancion-animal.jpg', genres: ['Rock nacional'] },
]

export const matchesCollection = (vinyl, collection) => !collection || (vinyl.genreNames?.length ? vinyl.genreNames : [vinyl.genreName]).some((name) => collection.genres.includes(name))
