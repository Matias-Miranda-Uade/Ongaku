import assert from 'node:assert/strict'
import { test } from 'node:test'
import { collections, matchesCollection } from '../src/data/collections.js'

test('cada colección de curaduría selecciona sus géneros y permite limpiar el filtro', () => {
  const catalog = [
    { name: 'RAM', genreName: 'Electrónica' },
    { name: 'Kind of Blue', genreName: 'Jazz' },
    { name: 'Nevermind', genreName: 'Grunge' },
    { name: 'Clics Modernos', genreName: 'Rock nacional' },
  ]
  assert.deepEqual(catalog.filter((vinyl) => matchesCollection(vinyl, collections.find((item) => item.id === 'rock'))).map((item) => item.name), ['Nevermind'])
  assert.deepEqual(catalog.filter((vinyl) => matchesCollection(vinyl, collections.find((item) => item.id === 'jazz'))).map((item) => item.name), ['Kind of Blue'])
  assert.equal(catalog.filter((vinyl) => matchesCollection(vinyl, null)).length, 4)
  for (const collection of collections) assert.ok(catalog.some((vinyl) => matchesCollection(vinyl, collection)))
})
