import { useEffect, useMemo, useRef, useState } from 'react'
import VinylFormFields from './VinylFormFields'
import CoverUploader from './CoverUploader'
import AudioUploader from './AudioUploader'
import GenreSelector from './GenreSelector'
import StockInput from './StockInput'
import PriceInput from './PriceInput'
import VinylDescriptionInput from './VinylDescriptionInput'
import PublicationToggle from './PublicationToggle'
import VinylFormActions from './VinylFormActions'
import {
  FIELD_ORDER,
  mapServerFieldErrors,
  toFormValues,
  toVinylPayload,
  validateVinyl,
} from './vinylFormModel'
import useCatalogLookups from '../../../hooks/useCatalogLookups'
import {
  createAudioPreview,
  createVinyl,
  getAdminVinyls,
  getAudioPreviews,
  setVinylEnabled,
  updateVinyl,
} from '../../../services/adminService'

const FOCUS_TARGETS = {
  genreId: '#vf-genre-label + .genre-chips button',
  audioPreviewId: '#vf-audioPreviewId',
  audioUrl: '#vf-audioUrl',
  audioDuration: '#vf-audioDuration',
}

const VinylForm = ({ mode = 'create', initialData = null, onSuccess, onCancel }) => {
  const isEdit = mode === 'edit'
  const initialValues = useMemo(() => toFormValues(initialData), [initialData])
  const { artists, categories, genres, addGenre } = useCatalogLookups()

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [previews, setPreviews] = useState([])
  const [usedPreviewIds, setUsedPreviewIds] = useState(() => new Set())
  const createdAudio = useRef(null)
  const formRef = useRef(null)

  useEffect(() => { setValues(initialValues) }, [initialValues])

  useEffect(() => {
    let active = true
    Promise.allSettled([getAudioPreviews(), getAdminVinyls()]).then(([previewsResult, vinylsResult]) => {
      if (!active) return
      if (previewsResult.status === 'fulfilled') setPreviews(previewsResult.value)
      if (vinylsResult.status === 'fulfilled') {
        setUsedPreviewIds(new Set(vinylsResult.value.filter((vinyl) => vinyl.audioPreviewId).map((vinyl) => String(vinyl.audioPreviewId))))
      }
    })
    return () => { active = false }
  }, [])

  const dirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(initialValues), [values, initialValues])

  useEffect(() => {
    if (!dirty || submitting) return undefined
    const handler = (event) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty, submitting])

  const clientErrors = useMemo(() => validateVinyl(values), [values])

  const visibleErrors = useMemo(() => {
    const result = { ...errors }
    Object.entries(clientErrors).forEach(([field, message]) => {
      const touchKey = field.startsWith('audio') ? 'audio' : field
      if (submitted || touched[touchKey]) result[field] = message
    })
    return result
  }, [errors, clientErrors, touched, submitted])

  const handleChange = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (field === 'audio') {
        const { audioPreviewId, audioUrl, audioDuration, ...rest } = current
        return rest
      }
      if (!(field in current)) return current
      const { [field]: _removed, ...rest } = current
      return rest
    })
    if (field === 'audio') setTouched((current) => ({ ...current, audio: true }))
  }

  const handleBlur = (field) => setTouched((current) => ({ ...current, [field]: true }))

  const focusFirstError = (errorMap) => {
    const first = FIELD_ORDER.find((field) => errorMap[field])
    if (!first) return
    const element = formRef.current?.querySelector(FOCUS_TARGETS[first] ?? `#vf-${first}`)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const resolveAudioPreviewId = async () => {
    const { audio } = values
    if (audio.mode === 'existing') return audio.audioPreviewId
    if (audio.mode !== 'new') return null
    const key = `${audio.url.trim()}|${audio.durationSeconds}`
    if (createdAudio.current?.key === key) return createdAudio.current.id
    const preview = await createAudioPreview({ url: audio.url.trim(), durationSeconds: Number(audio.durationSeconds) })
    createdAudio.current = { key, id: preview.id }
    setPreviews((current) => [...current, preview])
    return preview.id
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)
    setServerError('')

    if (Object.keys(clientErrors).length > 0) {
      focusFirstError(clientErrors)
      return
    }

    setSubmitting(true)
    try {
      const audioPreviewId = await resolveAudioPreviewId()
      const payload = toVinylPayload(values, audioPreviewId)

      let saved = isEdit
        ? await updateVinyl(initialData.id, payload)
        : await createVinyl(payload)

      const wantedEnabled = Boolean(values.enabled)
      const savedEnabled = saved?.enabled ?? true
      if (wantedEnabled !== savedEnabled) {
        saved = await setVinylEnabled(saved.id, wantedEnabled)
      }

      createdAudio.current = null
      onSuccess?.(saved)
    } catch (submitError) {
      const fieldErrors = mapServerFieldErrors(submitError.fieldErrors)
      setErrors(fieldErrors)
      if (Object.keys(fieldErrors).length > 0) {
        setServerError('El servidor rechazó algunos datos. Revisá los campos marcados.')
        focusFirstError(fieldErrors)
      } else if (submitError.isNotFound) {
        setServerError(`${submitError.message} Puede que lo hayan eliminado o que una relación (artista, género, categoría) ya no exista.`)
      } else if (submitError.isUnauthorized || submitError.isForbidden) {
        setServerError('Tu sesión no tiene permisos de administración. Volvé a ingresar.')
      } else {
        setServerError(submitError.message || 'No pudimos guardar el vinilo.')
      }
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setSubmitted(false)
    setServerError('')
  }

  const handleCancel = () => {
    if (dirty && !window.confirm('Tenés cambios sin guardar. ¿Querés descartarlos?')) return
    onCancel?.()
  }

  const lockedRelations = {
    artistId: isEdit && Boolean(initialData?.artistId),
    categoryId: isEdit && Boolean(initialData?.categoryId),
    genreId: isEdit && Boolean(initialData?.genreId),
    audio: isEdit && Boolean(initialData?.audioPreviewId),
  }

  const errorCount = Object.keys(visibleErrors).length

  return (
    <form ref={formRef} className="vinyl-form" onSubmit={handleSubmit} noValidate aria-busy={submitting}>
      {serverError && (
        <div className="admin-alert" role="alert">
          <p>{serverError}</p>
        </div>
      )}
      {submitted && errorCount > 0 && !serverError && (
        <p className="admin-alert" role="alert">
          Hay {errorCount} campo{errorCount === 1 ? '' : 's'} para revisar.
        </p>
      )}

      <div className="vinyl-form-grid">
        <div className="vinyl-form-main">
          <VinylFormFields
            values={values}
            errors={visibleErrors}
            onChange={handleChange}
            onBlur={handleBlur}
            artists={artists}
            categories={categories}
            lockedRelations={lockedRelations}
          />

          <fieldset className="vf-section">
            <legend><span className="vf-step">02</span> Género y descripción</legend>
            <GenreSelector
              value={values.genreId}
              onChange={(genreId) => handleChange('genreId', genreId)}
              genres={genres}
              onGenreCreated={addGenre}
              error={visibleErrors.genreId}
              locked={lockedRelations.genreId}
            />
            <VinylDescriptionInput
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={visibleErrors.description}
            />
          </fieldset>

          <fieldset className="vf-section">
            <legend><span className="vf-step">03</span> Precio y stock</legend>
            <div className="vf-span-2">
              <PriceInput
                price={values.price}
                discountPercentage={values.discountPercentage}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={visibleErrors}
              />
            </div>
            <StockInput
              value={values.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              error={visibleErrors.stock}
              initialStock={isEdit ? initialData?.stock ?? null : null}
            />
          </fieldset>

          <AudioUploader
            value={values.audio}
            onChange={handleChange}
            errors={visibleErrors}
            previews={previews}
            usedPreviewIds={usedPreviewIds}
            currentPreviewId={initialData?.audioPreviewId ?? ''}
            locked={lockedRelations.audio}
          />
        </div>

        <aside className="vinyl-form-side">
          <fieldset className="vf-section">
            <legend><span className="vf-step">04</span> Portada</legend>
            <CoverUploader value={values.image} onChange={handleChange} onBlur={handleBlur} error={visibleErrors.image} />
          </fieldset>
          <fieldset className="vf-section">
            <legend><span className="vf-step">06</span> Publicación</legend>
            <PublicationToggle checked={values.enabled} onChange={handleChange} stock={values.stock} />
          </fieldset>
        </aside>
      </div>

      <VinylFormActions
        mode={mode}
        submitting={submitting}
        dirty={dirty}
        onCancel={handleCancel}
        onReset={handleReset}
      />
    </form>
  )
}

export default VinylForm
