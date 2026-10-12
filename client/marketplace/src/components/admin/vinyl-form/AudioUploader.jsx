import { useEffect, useState } from 'react'
import { FieldError, fieldA11y } from './VinylFormFields'

const formatDuration = (seconds) => {
  const total = Number(seconds) || 0
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

const fileNameFromUrl = (url = '') => {
  try {
    return decodeURIComponent(new URL(url, window.location.origin).pathname.split('/').pop() || url)
  } catch {
    return url
  }
}

const MODES = [
  { id: 'none', label: 'Sin preview' },
  { id: 'existing', label: 'Usar una existente' },
  { id: 'new', label: 'Cargar nueva' },
]

const AudioUploader = ({ value, onChange, errors = {}, previews = [], usedPreviewIds = new Set(), currentPreviewId = '', locked = false }) => {
  const [detecting, setDetecting] = useState(false)
  const [detectError, setDetectError] = useState('')

  const update = (patch) => onChange('audio', { ...value, ...patch })
  const selected = previews.find((preview) => String(preview.id) === value.audioPreviewId)
  const playerUrl = value.mode === 'existing' ? selected?.url : value.mode === 'new' ? value.url.trim() : ''

  useEffect(() => {
    if (value.mode !== 'new' || !/^https?:\/\/|^\//.test(value.url.trim())) {
      setDetectError('')
      return undefined
    }
    const audio = new Audio()
    let active = true
    setDetecting(true)
    setDetectError('')
    const timeout = setTimeout(() => {
      audio.preload = 'metadata'
      audio.src = value.url.trim()
    }, 400)
    audio.onloadedmetadata = () => {
      if (!active) return
      setDetecting(false)
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        onChange('audio', { ...value, durationSeconds: String(Math.round(audio.duration)) })
      }
    }
    audio.onerror = () => {
      if (!active) return
      setDetecting(false)
      setDetectError('No pudimos leer ese audio. Revisá la URL o cargá la duración a mano.')
    }
    return () => {
      active = false
      clearTimeout(timeout)
      audio.removeAttribute('src')
    }
  }, [value.mode, value.url])

  return (
    <fieldset className="vf-section audio-uploader">
      <legend><span className="vf-step">05</span> Preview de audio</legend>

      <div className="segmented vf-span-2" role="radiogroup" aria-label="Origen de la preview">
        {MODES.filter((mode) => !(locked && mode.id === 'none')).map((mode) => (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={value.mode === mode.id}
            className={value.mode === mode.id ? 'is-active' : ''}
            onClick={() => update({ mode: mode.id })}
          >
            {mode.label}
          </button>
        ))}
      </div>
      {locked && <p className="vf-hint vf-span-2">El back no permite desvincular una preview: podés reemplazarla por otra.</p>}

      {value.mode === 'existing' && (
        <div className="vf-field vf-span-2">
          <label htmlFor="vf-audioPreviewId">Preview</label>
          <select
            {...fieldA11y('audioPreviewId', errors.audioPreviewId)}
            value={value.audioPreviewId}
            onChange={(event) => update({ audioPreviewId: event.target.value })}
          >
            <option value="">Elegí una preview…</option>
            {previews.map((preview) => {
              const id = String(preview.id)
              const taken = usedPreviewIds.has(id) && id !== String(currentPreviewId)
              return (
                <option key={id} value={id} disabled={taken}>
                  #{id} · {fileNameFromUrl(preview.url)} · {formatDuration(preview.durationSeconds)}{taken ? ' (en uso)' : ''}
                </option>
              )
            })}
          </select>
          {previews.length === 0 && <p className="vf-hint">Todavía no hay previews cargadas: usá “Cargar nueva”.</p>}
          <FieldError id="vf-audioPreviewId-error" message={errors.audioPreviewId} />
        </div>
      )}

      {value.mode === 'new' && (
        <>
          <div className="vf-field">
            <label htmlFor="vf-audioUrl">URL del audio</label>
            <input
              {...fieldA11y('audioUrl', errors.audioUrl)}
              type="url"
              inputMode="url"
              maxLength={255}
              placeholder="https://…/preview.mp3"
              value={value.url}
              onChange={(event) => update({ url: event.target.value })}
            />
            <FieldError id="vf-audioUrl-error" message={errors.audioUrl || detectError} />
          </div>
          <div className="vf-field">
            <label htmlFor="vf-audioDuration">Duración (segundos)</label>
            <input
              {...fieldA11y('audioDuration', errors.audioDuration, 'vf-audioDuration-hint')}
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={value.durationSeconds}
              onChange={(event) => update({ durationSeconds: event.target.value })}
            />
            <p className="vf-hint" id="vf-audioDuration-hint">
              {detecting ? 'Detectando duración…' : value.durationSeconds ? `≈ ${formatDuration(value.durationSeconds)}` : 'Se completa sola al leer el audio.'}
            </p>
            <FieldError id="vf-audioDuration-error" message={errors.audioDuration} />
          </div>
        </>
      )}

      {playerUrl && (
        <div className="vf-span-2 audio-player-preview">
          <audio controls preload="none" src={playerUrl}>Tu navegador no puede reproducir este audio.</audio>
        </div>
      )}
    </fieldset>
  )
}

export default AudioUploader
