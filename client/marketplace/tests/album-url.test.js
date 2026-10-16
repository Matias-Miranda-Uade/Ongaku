import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getAlbumUrl } from '../src/components/vinyl-detail/albumUrl.js'

test('abre enlaces de álbumes reales y descarta destinos inválidos', () => {
  const url = 'https://music.apple.com/us/album/animals/1065974284?uo=4'
  assert.equal(getAlbumUrl(url), url)
  const spotify = 'https://open.spotify.com/album/0123456789ABCDEFGHIJKL?si=test'
  assert.equal(getAlbumUrl(spotify), spotify)
  for (const invalid of [null, '', 'javascript:alert(1)', 'http://music.apple.com/us/album/1', 'https://music.apple.com.ejemplo.com/us/album/1', 'https://music.apple.com/us/artist/1', 'https://user:pass@music.apple.com/us/album/1']) {
    assert.equal(getAlbumUrl(invalid), null)
  }
})

test('solo acepta enlaces a álbumes y no a canciones, playlists o puertos alternativos', () => {
  for (const invalid of ['https://open.spotify.com/track/0123456789ABCDEFGHIJKL', 'https://open.spotify.com/playlist/0123456789ABCDEFGHIJKL', 'https://music.apple.com:8080/us/album/animals/1065974284', 'https://music.apple.com/us/album/no-es-un-id', 'https://open.spotify.com/album/incorrecto']) {
    assert.equal(getAlbumUrl(invalid), null)
  }
})
