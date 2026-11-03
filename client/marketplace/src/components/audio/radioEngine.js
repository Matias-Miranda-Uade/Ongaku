import { getMediaSource } from './mediaSource.js'

export const hasPreview = vinyl => Boolean(vinyl.audioPreviewId || vinyl.albumUrl)
export const initialRadioState = { track: null, playing: false, loading: false, error: '', time: 0, duration: 0, volume: .7, minimized: false, analyser: null, analysisNote: '' }

// Un único propietario del audio. Inyectar el entorno permite probar eventos y carreras.
export class RadioEngine {
  constructor({ getPreview, createAudio = () => new Audio(), getAudioContext = () => window.AudioContext || window.webkitAudioContext, getOrigin = () => window.location.origin }) {
    this.getPreview = getPreview
    this.createAudio = createAudio
    this.getAudioContext = getAudioContext
    this.getOrigin = getOrigin
    this.state = { ...initialRadioState }
    this.listeners = new Set()
    this.sequence = 0
    this.audio = null
    this.context = null
    this.catalog = []
  }
  subscribe = listener => { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  getSnapshot = () => this.state
  update = patch => { this.state = { ...this.state, ...patch }; this.listeners.forEach(listener => listener()) }
  suspend = () => { this.context?.suspend().catch(() => {}) }
  release = () => {
    if (this.audio) {
      const audio = this.audio
      audio.onplaying = audio.onpause = audio.onwaiting = audio.ontimeupdate = audio.ondurationchange = audio.onended = audio.onerror = null
      audio.pause(); audio.removeAttribute('src'); audio.load()
      this.audio = null
    }
    this.context?.close().catch(() => {})
    this.context = null
  }
  close = () => {
    ++this.sequence
    this.release()
    this.update({ ...initialRadioState, volume: this.state.volume })
  }
  setMinimized = minimized => this.update({ minimized })
  prepareAnalysis = async (source, token) => {
    const origin = this.getOrigin()
    if (new URL(source.url, origin).origin !== origin) {
      this.update({ analysisNote: 'Visual estático: el análisis de esta fuente externa requiere permisos CORS.' })
      return
    }
    const Context = this.getAudioContext()
    if (!Context) { this.update({ analysisNote: 'Visual estático: este navegador no admite análisis de audio.' }); return }
    try {
      const context = new Context()
      this.context = context
      const analyser = context.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = .8
      const node = context.createMediaElementSource(this.audio)
      node.connect(analyser); analyser.connect(context.destination)
      await context.resume()
      if (token === this.sequence) this.update({ analyser, analysisNote: '' })
    } catch {
      if (token === this.sequence) {
        // Restablecer audio normal si el navegador no pudo conectar el grafo.
        this.release()
        this.update({ analyser: null, analysisNote: 'Visual estático: el análisis de audio no está disponible.' })
        this.attachAudio(source, token)
      }
    }
  }
  attachAudio = (source, token) => {
    const audio = this.createAudio()
    this.audio = audio
    audio.preload = 'metadata'
    audio.volume = this.state.volume
    audio.src = source.url
    const valid = () => token === this.sequence && this.audio === audio
    audio.onplaying = () => {
      if (!valid()) return
      this.context?.resume().catch(() => {})
      this.update({ playing: true })
    }
    audio.onpause = audio.onwaiting = audio.onended = () => {
      if (valid()) { this.update({ playing: false }); this.suspend() }
    }
    audio.ontimeupdate = () => { if (valid()) this.update({ time: audio.currentTime }) }
    audio.ondurationchange = () => { if (valid()) this.update({ duration: Number.isFinite(audio.duration) ? audio.duration : 0 }) }
    audio.onerror = () => { if (valid()) { audio.pause(); this.update({ error: 'No se pudo cargar el audio.', playing: false, loading: false }); this.suspend() } }
    return audio
  }
  playVinyl = async (vinyl, resolvedPreview) => {
    const token = ++this.sequence
    this.release()
    this.update({ track: null, playing: false, loading: true, error: '', minimized: false, time: 0, duration: 0, analyser: null, analysisNote: '' })
    try {
      const preview = resolvedPreview || await this.getPreview(vinyl.audioPreviewId)
      if (token !== this.sequence) return
      const source = getMediaSource(preview?.url || vinyl.albumUrl)
      if (!source) throw new Error('Este disco no tiene un preview compatible disponible.')
      this.update({ track: { vinyl, source } })
      if (source.type === 'audio') {
        this.attachAudio(source, token)
        await this.prepareAnalysis(source, token)
        if (token !== this.sequence) return
        await this.audio.play()
      } else this.update({ analysisNote: 'Visual estático: el reproductor externo no comparte su señal de audio.' })
    } catch (error) {
      if (token === this.sequence) { this.update({ error: error.message || 'No se pudo reproducir el audio.', playing: false }); this.suspend() }
    } finally { if (token === this.sequence) this.update({ loading: false }) }
  }
  toggle = async () => {
    const audio = this.audio
    const token = this.sequence
    if (!audio || this.state.loading) return
    if (!audio.paused) { audio.pause(); return }
    try {
      this.update({ error: '' })
      await this.context?.resume()
      if (token === this.sequence) await audio.play()
    } catch { if (token === this.sequence) { this.update({ playing: false, error: 'No se pudo reproducir el audio.' }); this.suspend() } }
  }
  step = direction => {
    const queue = this.catalog.filter(hasPreview)
    if (!queue.length) return
    const index = queue.findIndex(item => String(item.id) === String(this.state.track?.vinyl.id))
    return this.playVinyl(queue[index < 0 ? (direction < 0 ? queue.length - 1 : 0) : (index + direction + queue.length) % queue.length])
  }
  seek = value => {
    if (this.audio && this.state.duration > 0) {
      const time = Math.max(0, Math.min(Number(value), this.state.duration))
      this.audio.currentTime = time; this.update({ time })
    }
  }
  changeVolume = value => {
    const volume = Math.max(0, Math.min(Number(value), 1))
    if (this.audio) this.audio.volume = volume
    this.update({ volume })
  }
}
