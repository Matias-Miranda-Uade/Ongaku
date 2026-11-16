import { useEffect, useRef, useState } from 'react';
import { uploadCover } from '../../../services/adminService';
import { FieldError, fieldA11y } from './VinylFormFields';
const MAX_FILE_MB = 5;
const CoverUploader = ({
  value,
  onChange,
  onBlur,
  error,
  onStatusChange
}) => {
  const [dragging, setDragging] = useState(false);
  const [previewState, setPreviewState] = useState(value ? 'loading' : 'empty');
  const [uploading, setUploading] = useState(false);
  const uploadVersion = useRef(0);
  const [fileError, setFileError] = useState('');
  const fileInput = useRef(null);
  const previewUrl = value.trim();
  const status = uploading ? 'uploading' : fileError ? 'error' : previewState;
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);
  useEffect(() => () => {
    uploadVersion.current += 1;
  }, []);
  useEffect(() => {
    setPreviewState(previewUrl ? 'loading' : 'empty');
  }, [previewUrl]);
  const setUrl = url => {
    setFileError('');
    onChange('image', url);
  };
  const handleFile = file => {
    if (uploading) return Promise.resolve();
    setFileError('');
    if (!file) return Promise.resolve();
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setFileError('El archivo tiene que ser una imagen (JPG o PNG).');
      return Promise.resolve();
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`La imagen supera los ${MAX_FILE_MB} MB.`);
      return Promise.resolve();
    }
    const version = ++uploadVersion.current;
    setUploading(true);
    return Promise.resolve(uploadCover(file)).then(result => {
      if (version !== uploadVersion.current) return;
      setPreviewState('loading');
      onChange('image', result.url);
    }).catch(failure => {
      if (version === uploadVersion.current) setFileError(failure.message || 'No se pudo subir la portada.');
    }).finally(() => {
      if (version === uploadVersion.current) setUploading(false);
    });
  };
  const handleDrop = event => {
    event.preventDefault();
    if (uploading) return;
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
      return;
    }
    const url = (event.dataTransfer.getData('text/uri-list') || event.dataTransfer.getData('text/plain') || '').split('\n')[0].trim();
    if (url) setUrl(url);
  };
  return <div className="vf-field vf-span-2 cover-uploader">
      <span className="vf-label">Portada</span>
      <div className="cover-layout">
        <div className={`cover-drop${dragging ? ' is-dragging' : ''}${previewState === 'error' ? ' is-broken' : ''}`} onDragOver={event => {
        event.preventDefault();
        setDragging(true);
      }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
          {previewUrl && previewState !== 'error' ? <img src={previewUrl} alt="Vista previa de la portada" onLoad={() => setPreviewState('ready')} onError={() => setPreviewState('error')} className={previewState === 'ready' ? 'is-ready' : ''} /> : <div className="cover-placeholder">
              <span className="cover-disc" aria-hidden="true" />
              <p>{previewState === 'error' ? 'No pudimos cargar la imagen de esa URL.' : 'Arrastrá una imagen o pegá su URL'}</p>
            </div>}
        </div>

        <div className="cover-controls">
          <label htmlFor="vf-image">URL de la imagen</label>
          <input {...fieldA11y('image', error, 'vf-image-hint')} disabled={uploading} type="url" inputMode="url" value={value} maxLength={255} placeholder="https://…/portada.jpg" onChange={event => setUrl(event.target.value)} onBlur={() => onBlur('image')} />
          <p className="vf-hint" id="vf-image-hint">Pegá el enlace directo a una imagen, no el de una página web. También podés subir un JPG o PNG de hasta 5 MB y 4096 × 4096 píxeles.</p>
          <FieldError id="vf-image-error" message={error} />

          <div className="cover-buttons">
            <button type="button" className="secondary-button small" disabled={uploading} onClick={() => fileInput.current?.click()}>
              {uploading ? 'Subiendo portada…' : 'Subir imagen'}
            </button>
            {(value || fileError) && <button type="button" className="link-button" disabled={uploading} onClick={() => setUrl('')}>Quitar portada</button>}
          </div>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png" disabled={uploading} hidden onChange={event => {
          handleFile(event.target.files?.[0]);
          event.target.value = '';
        }} />
          {uploading && <p className="vf-hint" role="status">Guardando la imagen en el servidor…</p>}
          <FieldError id="vf-image-file-error" message={fileError} />
        </div>
      </div>
    </div>;
};
export default CoverUploader;
