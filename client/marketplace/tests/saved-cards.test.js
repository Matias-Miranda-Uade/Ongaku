import assert from 'node:assert/strict'
import { test } from 'node:test'
import { toSavedCardPayload, validateSavedCard } from '../src/components/profile/savedCardModel.js'

const now = new Date(2026, 9, 16)
const card = { holder: 'María Pérez', brand: 'VISA', lastFour: '4242', expiry: '2027-12' }
test('las tarjetas guardadas solo contienen datos enmascarados', () => {
  assert.deepEqual(validateSavedCard(card, now), {})
  assert.deepEqual(toSavedCardPayload({ ...card, number: 'NO ENVIAR', securityCode: 'NO ENVIAR' }), { holder: 'María Pérez', brand: 'VISA', lastFour: '4242', expiryMonth: 12, expiryYear: 2027 })
})
test('rechaza tarjetas vencidas y números completos en el campo últimos cuatro', () => {
  assert.ok(validateSavedCard({ ...card, expiry: '2026-09' }, now).expiry)
  assert.ok(validateSavedCard({ ...card, expiry: '2027-13' }, now).expiry)
  assert.deepEqual(validateSavedCard({ ...card, expiry: '2026-10' }, now), {})
  assert.ok(validateSavedCard({ ...card, lastFour: '4242424242424242' }, now).lastFour)
  assert.ok(validateSavedCard({ ...card, holder: '123' }, now).holder)
  assert.ok(validateSavedCard({ ...card, brand: 'INVALID' }, now).brand)
})
