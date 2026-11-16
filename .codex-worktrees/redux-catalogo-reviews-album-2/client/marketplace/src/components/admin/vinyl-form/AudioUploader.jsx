import { useEffect, useRef, useState } from 'react'
import { FieldError, fieldA11y } from './VinylFormFields'
import { getMediaSource } from '../../audio/mediaSource'
import MediaPlayer from '../../audio/MediaPlayer'

const MODES = [{ id: 'none', label: 'Sin preview' }, { id: 'existing', label: 'Usar una existente' }, { id: 'new', label: 'Agregar enlace' }]

const AudioUploader = ({ value, onChange, errors = {}, previews = [], usedPreviewIds = new Set(), currentPreviewId = '' }) => {
  const [detecting, setDetecting] = useState(false)
  const [detectError, setDetectError] = useState('')
  const latest = useRef(value)
  latest.current = value
  const update = (patch) => onChange('audio', { ...value, ...patch })
  const selected = previews.find((preview) => String(preview.id) === value.audioPreviewId)
  const playerUrl = value.mode === 'existing' ? selected?.url : value.mode === 'new' ? value.url.trim() : ''
  const source = getMediaSource(playerUrl)

  useEffect(() => {
    setDetectError('')
    setDetecting(false)
    const media = getMediaSource(value.url)
    if (value.mode !== 'new' || media?.type !== 'audio') return undefined
    const audio = new Audio()
    let active = true
    setDetecting(true)
    const stop = () => { if (active) setDetecting(false) }
    const timeout = setTimeout(() => {
      stop()
      if (active) setDetectError('No se pudo leer la muestra. Verificá que el enlace apunte al archivo de audio; los links de plataformas usan su propio reproductor.')
    }, 15000)
    audio.onloadedmetadata = () => {
      if (!active) return
      clearTimeout(timeout)
      stop()
      if (Number.isFinite(audio.duration) && audio.duration > 0) onChange('audio', { ...latest.current, durationSeconds: String(Math.ceil(audio.duration)) })
    }
    audio.onerror = () => {
      clearTimeout(timeout)
      stop()
      if (active) setDetectError('No se pudo cargar el audio. Usá la URL directa del archivo o un enlace de Spotify, Apple Music o YouTube.')
    }
    audio.preload = 'metadata'
    audio.src = media.url
    return () => { active = false; clearTimeout(timeout); audio.pause(); audio.removeAttribute('src'); audio.load() }
  }, [value.mode, value.url])

  return <fieldset className="vf-section audio-uploader">
    <legend><span className="vf-step">05</span> Muestra de audio</legend>
    <p className="vf-hint vf-span-2">Podés pegar un link de una canción de Spotify, Apple Music o YouTube, o la URL directa de un archivo MP3, M4A, OGG o WAV. La muestra se escucha desde el detalle del vinilo.</p>
    <div className="segmented vf-span-2" role="radiogroup" aria-label="Origen de la muestra">
      {MODES.map((mode) => <button key={mode.id} type="button" role="radio" aria-checked={value.mode === mode.id}
        className={value.mode === mode.id ? 'is-active' : ''} onClick={() => update({ mode: mode.id })}>{mode.label}</button>)}
    </div>
    {value.mode === 'existing' && <div className="vf-field vf-span-2">
      <label htmlFor="vf-audioPreviewId">Muestra guardada</label>
      <select {...fieldA11y('audioPreviewId', errors.audioPreviewId)} value={value.audioPreviewId} onChange={(event) => update({ audioPreviewId: event.target.value })}>
        <option value="">Elegí una muestra…</option>
        {previews.map((preview) => {
          const taken = usedPreviewIds.has(String(preview.id)) && String(preview.id) !== String(currentPreviewId)
          return <option key={preview.id} value={preview.id} disabled={taken}>#{preview.id} · {preview.url}{taken ? ' (en uso)' : ''}</option>
        })}
      </select>
      {!previews.length && <p className="vf-hint">No hay muestras guardadas. Elegí “Agregar enlace”.</p>}
      <FieldError id="vf-audioPreviewId-error" message={errors.audioPreviewId} />
    </div>}
    {value.mode === 'new' && <>
      <div className="vf-field vf-span-2">
        <label htmlFor="vf-audioUrl">Link de la muestra o canción</label>
        <input {...fieldA11y('audioUrl', errors.audioUrl)} type="url" maxLength={2048} value={value.url}
          placeholder="https://open.spotify.com/track/… o https://…/muestra.mp3" onChange={(event) => update({ url: event.target.value, durationSeconds: '' })} />
        <FieldError id="vf-audioUrl-error" message={errors.audioUrl} />
        {detectError && <p className="vf-hint" role="status">{detectError}</p>}
      </div>
      {source?.type === 'audio' && <div className="vf-field vf-span-2">
        <label htmlFor="vf-audioDuration">Duración en segundos (opcional)</label>
        <input {...fieldA11y('audioDuration', errors.audioDuration)} type="number" min="1" max="600" value={value.durationSeconds} onChange={(event) => update({ durationSeconds: event.target.value })} />
        <p className="vf-hint">{detecting ? 'Leyendo el archivo…' : 'Se detecta al cargar el audio. No es necesaria para los reproductores de plataformas.'}</p>
        <FieldError id="vf-audioDuration-error" message={errors.audioDuration} />
      </div>}
    </>}
    {source && <div className="vf-span-2 audio-player-preview"><MediaPlayer url={playerUrl} durationSeconds={selected?.durationSeconds || value.durationSeconds} /></div>}
  </fieldset>
}
export default AudioUploader
