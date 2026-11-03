import assert from 'node:assert/strict'
import { test } from 'node:test'
import { RadioEngine } from '../src/components/audio/radioEngine.js'

const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
class FakeAudio {
  paused = true
  currentTime = 0
  duration = 30
  plays = 0
  play() { this.paused = false; this.plays++; this.onplaying?.(); return Promise.resolve() }
  pause() { this.paused = true; this.onpause?.() }
  removeAttribute() { this.src = '' }
  load() {}
}
class FakeContext {
  state = 'suspended'
  createAnalyser() { return { frequencyBinCount: 128, connect() {}, getByteFrequencyData() {} } }
  createMediaElementSource() { return { connect() {} } }
  resume() { this.state = 'running'; return Promise.resolve() }
  suspend() { this.state = 'suspended'; return Promise.resolve() }
  close() { this.state = 'closed'; return Promise.resolve() }
}
function setup(getPreview = async id => ({ url: `/media/${id}.mp3` }), Context = FakeContext) {
  const elements = []
  const engine = new RadioEngine({ getPreview, createAudio: () => { const audio = new FakeAudio(); elements.push(audio); return audio }, getOrigin: () => 'http://localhost:5173', getAudioContext: () => Context })
  return { engine, elements }
}
test('Radio mantiene una fuente activa y comparte pausa, progreso, volumen y minimización', async () => {
  const { engine, elements } = setup()
  await engine.playVinyl({ id: 1, audioPreviewId: 4 })
  assert.equal(engine.state.playing, true)
  assert.ok(engine.state.analyser)
  const context = engine.context
  engine.audio.ondurationchange()
  engine.seek(12); engine.changeVolume(.3); engine.setMinimized(true)
  assert.equal(engine.audio.currentTime, 12)
  assert.equal(engine.audio.volume, .3)
  assert.equal(engine.state.minimized, true)
  assert.equal(engine.state.playing, true)
  await engine.toggle()
  assert.equal(engine.state.playing, false)
  assert.equal(context.state, 'suspended')
  await engine.toggle()
  assert.equal(engine.state.playing, true)
  await engine.playVinyl({ id: 2, audioPreviewId: 5 })
  assert.equal(elements[0].paused, true)
  assert.equal(elements[0].src, '')
  assert.equal(context.state, 'closed')
  assert.equal(elements.filter(audio => !audio.paused).length, 1)
  engine.audio.onended()
  assert.equal(engine.state.playing, false)
  assert.equal(engine.context.state, 'suspended')
  engine.close()
})
test('una respuesta tardía o cerrar durante la carga no reproduce un disco anterior', async () => {
  const first = deferred()
  const { engine, elements } = setup(id => id === 1 ? first.promise : Promise.resolve({ url: '/media/current.mp3' }))
  const old = engine.playVinyl({ id: 1, audioPreviewId: 1 })
  await engine.playVinyl({ id: 2, audioPreviewId: 2 })
  first.resolve({ url: '/media/old.mp3' }); await old
  assert.equal(engine.state.track.vinyl.id, 2)
  assert.equal(elements.length, 1)
  const pending = deferred()
  engine.getPreview = () => pending.promise
  const loading = engine.playVinyl({ id: 3, audioPreviewId: 3 })
  engine.close(); pending.resolve({ url: '/media/late.mp3' }); await loading
  assert.equal(engine.state.track, null)
  assert.equal(elements.filter(audio => !audio.paused).length, 0)
})
test('fuentes externas y embeds conservan audio sin fingir análisis ni estado de reproducción', async () => {
  const { engine, elements } = setup(async () => null)
  await engine.playVinyl({ id: 1, albumUrl: 'https://example.com/audio.mp3' })
  assert.equal(engine.state.playing, true)
  assert.equal(engine.context, null)
  assert.equal(engine.state.analyser, null)
  assert.match(engine.state.analysisNote, /CORS/)
  await engine.playVinyl({ id: 2, albumUrl: 'https://open.spotify.com/track/1234567890123456789012' })
  assert.equal(elements[0].paused, true)
  assert.equal(engine.state.track.source.type, 'embed')
  assert.equal(engine.state.playing, false)
  assert.equal(engine.state.analyser, null)
  engine.close()
})
test('siguiente y anterior recorren sólo discos con preview y conservan el catálogo', async () => {
  const { engine } = setup()
  engine.catalog = [{ id: 1, audioPreviewId: 1 }, { id: 2 }, { id: 3, audioPreviewId: 3 }]
  await engine.playVinyl(engine.catalog[0]); await engine.step(1)
  assert.equal(engine.state.track.vinyl.id, 3)
  await engine.step(1)
  assert.equal(engine.state.track.vinyl.id, 1)
  await engine.step(-1)
  assert.equal(engine.state.track.vinyl.id, 3)
  assert.equal(engine.catalog.length, 3)
  engine.close()
})
test('un error real detiene el visualizador y se puede reintentar', async () => {
  const { engine } = setup()
  await engine.playVinyl({ id: 1, audioPreviewId: 1 })
  engine.audio.onerror()
  assert.equal(engine.state.playing, false)
  assert.match(engine.state.error, /cargar/)
  assert.equal(engine.context.state, 'suspended')
  await engine.toggle()
  assert.equal(engine.state.error, '')
  assert.equal(engine.state.playing, true)
  engine.close()
})
