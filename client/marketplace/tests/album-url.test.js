import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getAlbumUrl } from '../src/components/vinyl-detail/albumUrl.js'

test('abre enlaces de álbumes reales y descarta destinos inválidos', () => {
  const url = 'https://music.apple.com/us/album/animals/1065974284?uo=4'
  assert.equal(getAlbumUrl(url), url)
  for (const invalid of [null, '', 'javascript:alert(1)', 'http://music.apple.com/us/album/1', 'https://music.apple.com.ejemplo.com/us/album/1', 'https://music.apple.com/us/artist/1', 'https://user:pass@music.apple.com/us/album/1']) {
    assert.equal(getAlbumUrl(invalid), null)
  }
})
