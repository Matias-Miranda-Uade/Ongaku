import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getMediaSource } from '../src/components/audio/mediaSource.js'
import { EMPTY_VINYL, toFormValues, toVinylPayload, validateVinyl } from '../src/components/admin/vinyl-form/vinylFormModel.js'

test('cada plataforma usa un reproductor propio y los archivos usan audio nativo', () => {
  const spotify = getMediaSource('https://open.spotify.com/track/0123456789ABCDEFGHIJKL?si=abc')
  assert.equal(spotify.embedUrl, 'https://open.spotify.com/embed/track/0123456789ABCDEFGHIJKL')
  const apple = getMediaSource('https://music.apple.com/ar/album/animals/1065974284?i=1065974291')
  assert.equal(apple.embedUrl, 'https://embed.music.apple.com/ar/album/animals/1065974284?i=1065974291')
  assert.equal(getMediaSource('https://youtu.be/M7lc1UVf-VE').embedUrl, 'https://www.youtube-nocookie.com/embed/M7lc1UVf-VE')
  assert.equal(getMediaSource('https://music.youtube.com/watch?v=M7lc1UVf-VE').platform, 'YouTube')
  assert.equal(getMediaSource('/audio/preview.mp3').type, 'audio')
  assert.equal(getMediaSource('https://audio.example.com/' + 'a'.repeat(300) + '.m4a?token=abc').type, 'audio')
  for (const bad of ['javascript:alert(1)', '//evil.example.com', 'https://user:password@open.spotify.com/track/0123456789ABCDEFGHIJKL', 'https://open.spotify.com/track/incorrecto']) assert.equal(getMediaSource(bad), null)
})

test('el formulario conserva varios géneros y permite muestras sin duración manual', () => {
  const values = toFormValues({ name: 'Disco', price: 100, year: 2020, stock: 1, genreId: 2, genreIds: [2, 3] })
  assert.deepEqual(values.genreIds, ['2', '3'])
  assert.deepEqual(toVinylPayload(values).genreIds, [2, 3])
  assert.deepEqual(toVinylPayload({ ...values, genreIds: [] }).genreIds, [])
  assert.deepEqual(toFormValues({ genreId: 9 }).genreIds, ['9'])
  const input = { ...EMPTY_VINYL, name: 'Disco', price: '100', year: '2020', stock: '1', audio: { mode: 'new', url: 'https://open.spotify.com/track/0123456789ABCDEFGHIJKL', durationSeconds: '' } }
  assert.deepEqual(validateVinyl(input), {})
})
