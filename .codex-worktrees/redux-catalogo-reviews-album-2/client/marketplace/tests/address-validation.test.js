import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeAddress, validateAddress } from '../src/components/profile/addressValidation.js'

const address = { recipient: 'María-José Pérez', street: 'Av. San Martín 123, Piso 2', city: '3 de Febrero', province: 'Buenos Aires', zipCode: '1000', country: 'Argentina', phone: '+54 (11) 1234-5678', instructions: '' }
test('admite nombres con tildes, direcciones numeradas y formatos postales argentinos', () => {
  assert.deepEqual(validateAddress(address), {})
  assert.deepEqual(validateAddress({ ...address, zipCode: 'c1000abc' }), {})
  assert.equal(normalizeAddress({ ...address, zipCode: ' c1000abc ' }).zipCode, 'C1000ABC')
  assert.deepEqual(validateAddress({ ...address, street: 'Camino rural s/n' }), {})
})
test('rechaza códigos incompletos, texto y símbolos sin confundirlos con un CPA', () => {
  for (const zipCode of ['hola', '12', '12345', '0000', 'C1234', 'I1000ABC', '123!', 'C1000AB1']) {
    assert.ok(validateAddress({ ...address, zipCode }).zipCode, zipCode)
  }
})
test('cada campo obligatorio valida su contenido y longitud', () => {
  const invalid = { recipient: '123', street: 'Sin altura', city: '123', province: '@@', country: 'Argentina123', phone: 'abc123', instructions: '\u0000', zipCode: '!!' }
  assert.equal(Object.keys(validateAddress(invalid)).length, 8)
  for (const field of ['recipient', 'street', 'city', 'province', 'zipCode', 'country', 'phone']) {
    assert.ok(validateAddress({ ...address, [field]: ' ' })[field])
    assert.ok(validateAddress({ ...address, [field]: 'a'.repeat(501) })[field])
  }
})
test('la altura de la calle admite hasta cinco dígitos', () => {
  assert.deepEqual(validateAddress({ ...address, street: 'Calle 12345' }), {})
  assert.ok(validateAddress({ ...address, street: 'Calle 10000000000' }).street)
})
