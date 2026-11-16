import assert from 'node:assert/strict'
import { after, beforeEach, test } from 'node:test'
import { http } from '../src/services/api.js'
import { getCachedAudioPreview } from '../src/services/audioPreviewCache.js'

const originalAdapter = http.defaults.adapter
const originalWindow = globalThis.window
let calls
beforeEach(() => {
  calls = []
  globalThis.window = { localStorage: { getItem: () => null } }
  http.defaults.adapter = async config => {
    calls.push(config.url)
    return { data: { data: { id: Number(config.url.split('/').pop()), url: '/audio/real.mp3' } },
      status: 200, statusText: '', headers: {}, config, request: {} }
  }
})
after(() => {
  http.defaults.adapter = originalAdapter
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
})

test('sin audioPreviewId no consulta el backend', async () => {
  assert.equal(await getCachedAudioPreview(null), null)
  assert.equal(await getCachedAudioPreview(undefined), null)
  assert.deepEqual(calls, [])
})

test('Home y detalle comparten peticiones simultáneas y respuestas recientes por ID', async () => {
  const home = getCachedAudioPreview(101)
  const detail = getCachedAudioPreview('101')
  assert.equal(home, detail)
  const preview = await home
  assert.equal(await getCachedAudioPreview(101), preview)
  assert.deepEqual(calls, ['/audio-previews/101'])
})

test('una respuesta vencida se vuelve a consultar', async () => {
  const originalNow = Date.now
  let now = 1000
  Date.now = () => now
  try {
    await getCachedAudioPreview(102)
    now += 29999
    await getCachedAudioPreview(102)
    assert.equal(calls.length, 1)
    now += 1
    await getCachedAudioPreview(102)
    assert.equal(calls.length, 2)
  } finally { Date.now = originalNow }
})

test('los errores no se guardan y permiten reintentar inmediatamente', async () => {
  const adapter = http.defaults.adapter
  http.defaults.adapter = async config => {
    calls.push(config.url)
    throw new Error('Sin conexión')
  }
  await assert.rejects(getCachedAudioPreview(103), /No se pudo conectar con el servidor/)
  http.defaults.adapter = adapter
  assert.equal((await getCachedAudioPreview(103)).id, 103)
  assert.equal(calls.length, 2)
})

test('previews distintas mantienen sus respuestas separadas', async () => {
  const [first, second] = await Promise.all([getCachedAudioPreview(104), getCachedAudioPreview(105)])
  assert.equal(first.id, 104)
  assert.equal(second.id, 105)
  assert.equal(calls.length, 2)
})
