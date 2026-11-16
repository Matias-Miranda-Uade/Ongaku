import assert from 'node:assert/strict'
import { test } from 'node:test'
import { EMPTY_VINYL, toFormValues, toVinylPayload, validateVinyl, mapServerFieldErrors } from '../src/components/admin/vinyl-form/vinylFormModel.js'

const valid = { ...EMPTY_VINYL, name: 'Animals', price: '30000', stock: '2', year: '1977' }

test('crear y editar conservan el enlace y permiten quitarlo del vinilo', () => {
  const url = 'https://music.apple.com/us/album/animals/1065974284'
  const values = toFormValues({ ...toVinylPayload(valid), albumUrl: url })
  assert.equal(values.albumUrl, url)
  assert.equal(toVinylPayload({ ...values, albumUrl: ` ${url} ` }).albumUrl, url)
  assert.equal(toVinylPayload({ ...values, albumUrl: '' }).albumUrl, '')
  assert.equal(validateVinyl({ ...valid, albumUrl: url }).albumUrl, undefined)
  assert.equal(validateVinyl({ ...valid, albumUrl: '' }).albumUrl, undefined)
})

test('el formulario marca los enlaces inválidos y muestra el error enviado por el servidor', () => {
  assert.ok(validateVinyl({ ...valid, albumUrl: 'https://ejemplo.com/album/1' }).albumUrl)
  assert.ok(validateVinyl({ ...valid, albumUrl: 'a'.repeat(2049) }).albumUrl)
  assert.equal(mapServerFieldErrors({ albumUrl: 'enlace inválido' }).albumUrl, 'Enlace inválido')
})
