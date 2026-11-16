import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { getAlbumPreview } from '../src/components/home/albumPreview.js'

test('los enlaces reales de Apple Music del catálogo no se descartan por ser embeds', async () => {
  const albums = JSON.parse(await readFile(new URL('../../../catalog/albums.json', import.meta.url), 'utf8'))
  assert.ok(albums.length > 0)
  for (const album of albums) {
    assert.equal(getAlbumPreview({ albumUrl: album.source }, null)?.url, album.source)
  }
})

test('usa la preview asociada y conserva duración e ID', () => {
  const preview = { id: 3, url: '/audio/real.mp3', durationSeconds: 15 }
  assert.deepEqual(getAlbumPreview({ albumUrl: 'https://youtu.be/M7lc1UVf-VE' }, preview), preview)
})

test('una preview ausente o inválida no oculta un albumUrl compatible', () => {
  const album = { albumUrl: 'https://music.apple.com/us/album/animals/1065974284' }
  assert.equal(getAlbumPreview(album, null).url, album.albumUrl)
  assert.equal(getAlbumPreview(album, { url: 'javascript:alert(1)' }).url, album.albumUrl)
  assert.equal(getAlbumPreview({}, null), null)
})
