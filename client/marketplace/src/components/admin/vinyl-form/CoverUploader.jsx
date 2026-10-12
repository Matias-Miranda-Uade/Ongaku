import { useEffect, useRef, useState } from 'react'
import { FieldError, fieldA11y } from './VinylFormFields'

const MAX_FILE_MB = 5

const CoverUploader = ({ value, onChange, onBlur, error }) => {
  const [dragging, setDragging] = useState(false)
  const [previewState, setPreviewState] = useState(value ? 'loading' : 'empty')
  const [localFile, setLocalFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const fileInput = useRef(null)

  const previewUrl = localFile?.url || value.trim()

  useEffect(() => {
    setPreviewState(previewUrl ? 'loading' : 'empty')
  }, [previewUrl])

  useEffect(() => () => { if (localFile?.url) URL.revokeObjectURL(localFile.url) }, [localFile])

  const setUrl = (url) => {
    setLocalFile(null)
    setFileError('')
    onChange('image', url)
  }

  const handleFile = (file) => {
    setFileError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setFileError('El archivo tiene que ser una imagen (JPG, PNG o WebP).')
      return
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`La imagen supera los ${MAX_FILE_MB} MB.`)
      return
    }
    setLocalFile({ name: file.name, url: URL.createObjectURL(file) })
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
      return
    }
    const url = (event.dataTransfer.getData('text/uri-list') || event.dataTransfer.getData('text/plain') || '').split('\n')[0].trim()
    if (url) setUrl(url)
  }

  return (
    <div className="vf-field vf-span-2 cover-uploader">
      <span className="vf-label">Portada</span>
      <div className="cover-layout">
        <div
          className={`cover-drop${dragging ? ' is-dragging' : ''}${previewState === 'error' ? ' is-broken' : ''}`}
          onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {previewUrl && previewState !== 'error' ? (
            <img
              src={previewUrl}
              alt="Vista previa de la portada"
              onLoad={() => setPreviewState('ready')}
              onError={() => setPreviewState('error')}
              className={previewState === 'ready' ? 'is-ready' : ''}
            />
          ) : (
            <div className="cover-placeholder">
              <span className="cover-disc" aria-hidden="true" />
              <p>{previewState === 'error' ? 'No pudimos cargar la imagen de esa URL.' : 'Arrastrá una imagen o pegá su URL'}</p>
            </div>
          )}
        </div>

        <div className="cover-controls">
          <label htmlFor="vf-image">URL de la imagen</label>
          <input
            {...fieldA11y('image', error, 'vf-image-hint')}
            type="url"
            inputMode="url"
            value={value}
            maxLength={255}
            placeholder="https://…/portada.jpg"
            onChange={(event) => setUrl(event.target.value)}
            onBlur={() => onBlur('image')}
          />
          <p className="vf-hint" id="vf-image-hint">Cuadrada, idealmente de 1000 × 1000 px. Máximo 255 caracteres.</p>
          <FieldError id="vf-image-error" message={error} />

          <div className="cover-buttons">
            <button type="button" className="secondary-button small" onClick={() => fileInput.current?.click()}>
              Probar archivo local
            </button>
            {(value || localFile) && (
              <button type="button" className="link-button" onClick={() => setUrl('')}>Quitar portada</button>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => { handleFile(event.target.files?.[0]); event.target.value = '' }}
          />
          {localFile && (
            <p className="vf-hint vf-warning" role="status">
              Estás viendo <strong>{localFile.name}</strong> sólo como vista previa. Subila a tu hosting de imágenes y pegá la URL para guardarla.
            </p>
          )}
          <FieldError id="vf-image-file-error" message={fileError} />
        </div>
      </div>
    </div>
  )
}

export default CoverUploader
