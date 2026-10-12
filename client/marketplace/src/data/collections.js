export const collections = [
  { id: 'rock', name: 'Rock y alternativo', number: '01', subtitle: 'CLÁSICOS / GUITARRAS', image: '/covers/dark-side.svg', genres: ['Rock', 'Rock alternativo', 'Grunge'] },
  { id: 'jazz', name: 'Jazz', number: '02', subtitle: 'SESIONES / IMPROVISACIÓN', image: '/covers/kind-of-blue.svg', genres: ['Jazz'] },
  { id: 'electronic', name: 'Electrónica', number: '03', subtitle: 'RITMO / EXPLORACIÓN', image: '/covers/ram.svg', genres: ['Electrónica'] },
  { id: 'national', name: 'Rock nacional', number: '04', subtitle: 'ARCHIVO / ARGENTINA', image: '/covers/cancion-animal.svg', genres: ['Rock nacional'] },
]

export const matchesCollection = (vinyl, collection) => !collection || collection.genres.includes(vinyl.genreName)
