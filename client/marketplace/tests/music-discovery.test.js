import assert from 'node:assert/strict'
import { test } from 'node:test'
import { matchesMood, chooseSurprise } from '../src/components/experiences/musicDiscovery.js'
import { readFileSync } from 'node:fs'
import { moods, moodSelections } from '../src/components/experiences/musicDiscovery.js'

test('cada ánimo tiene discos reales del catálogo y exige coincidencia de artista', () => {
  const catalog = JSON.parse(readFileSync(new URL('../../../catalog/albums.json', import.meta.url), 'utf8').replace(/^\uFEFF/, ''))
    .map(album => ({ ...album, artistName: album.artist, genreName: album.genre }))
  for (const mood of moods) {
    assert.ok(catalog.filter(album => matchesMood(album, mood.id)).length >= 4, mood.name)
    for (const [name, artistName] of moodSelections[mood.id]) {
      assert.ok(catalog.some(album => album.name === name && album.artistName.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === artistName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')), `${name} / ${artistName}`)
      assert.equal(matchesMood({ name, artistName }, mood.id), true)
      assert.equal(matchesMood({ name, artistName: 'Otro artista' }, mood.id), false)
    }
  }
})

test('los moods usan géneros y descripciones sin clasificar por título, artista o año', () => {
  assert.equal(matchesMood({ genreNames: ['Ambient'] }, 'chill'), true)
  assert.equal(matchesMood({ genreName: 'Bolero' }, 'romantic'), true)
  assert.equal(matchesMood({ description: 'Una sesión nocturna de jazz.' }, 'night'), true)
  assert.equal(matchesMood({ genreNames: ['Hard Rock'] }, 'energy'), true)
  assert.equal(matchesMood({ description: 'Un sonido nostálgico.' }, 'nostalgic'), true)
  for (const mood of ['chill', 'nostalgic', 'energy', 'night', 'romantic']) {
    assert.equal(matchesMood({ name: 'Ambient romantic nocturno', artistName: 'Retro', year: 1960 }, mood), false)
    assert.equal(matchesMood({}, mood), false)
  }
  assert.equal(matchesMood({}, null), true)
})
test('el sorteo usa IDs reales, evita repetición inmediata y admite catálogo vacío o único', () => {
  const catalog = [{ id: 1 }, { id: 2 }, { id: 3 }]
  for (const random of [0, .3, .7, .999]) assert.notEqual(chooseSurprise(catalog, '2', () => random), 2)
  assert.equal(chooseSurprise([], null), null)
  assert.equal(chooseSurprise([{ id: 1 }], 1), 1)
  assert.deepEqual(catalog, [{ id: 1 }, { id: 2 }, { id: 3 }])
})
