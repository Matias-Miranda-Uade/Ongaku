import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VinylFormFields from './VinylFormFields';
import CoverUploader from './CoverUploader';
import AudioUploader from './AudioUploader';
import GenreSelector from './GenreSelector';
import StockInput from './StockInput';
import PriceInput from './PriceInput';
import VinylDescriptionInput from './VinylDescriptionInput';
import PublicationToggle from './PublicationToggle';
import VinylFormActions from './VinylFormActions';
import { FIELD_ORDER, MAX_ALBUM_URL_LENGTH, mapServerFieldErrors, toFormValues, toVinylPayload, validateVinyl } from './vinylFormModel';
import { createAdminAudioPreview, fetchAdminLookups, fetchAdminVinyls, fetchAudioPreviews, saveAdminVinyl, selectAdminArtists, selectAdminCategories, selectAdminGenres, selectAdminLookupsRequest, selectAudioPreviews, selectUsedPreviewIds } from '../../../Redux/slices/adminCatalogSlice';
import { getAlbumUrl } from '../../vinyl-detail/albumUrl';
const FOCUS_TARGETS = {
  genreId: '#vf-genre-label + .genre-chips button',
  genreIds: '#vf-genre-label + .genre-chips button',
  audioPreviewId: '#vf-audioPreviewId',
  audioUrl: '#vf-audioUrl',
  audioDuration: '#vf-audioDuration'
};
const VinylForm = ({
  mode = 'create',
  initialData = null,
  onSuccess,
  onCancel
}) => {
  const isEdit = mode === 'edit';
  const initialValues = toFormValues(initialData);
  const dispatch = useDispatch();
  const artists = useSelector(selectAdminArtists);
  const categories = useSelector(selectAdminCategories);
  const genres = useSelector(selectAdminGenres);
  const lookupsRequest = useSelector(selectAdminLookupsRequest);
  const previews = useSelector(selectAudioPreviews);
  const usedPreviewIds = useSelector(selectUsedPreviewIds);
  const lookupError = lookupsRequest.status === 'failed' ? lookupsRequest.error : '';
  useEffect(() => {
    dispatch(fetchAdminLookups());
    dispatch(fetchAudioPreviews());
    dispatch(fetchAdminVinyls());
  }, [dispatch]);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [coverStatus, setCoverStatus] = useState('idle');
  const createdAudio = useRef(null);
  const formRef = useRef(null);
  useEffect(() => {
    setValues(toFormValues(initialData));
  }, [initialData]);
  const dirty = JSON.stringify(values) !== JSON.stringify(initialValues);
  useEffect(() => {
    if (!dirty || submitting) return undefined;
    const handler = event => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty, submitting]);
  const clientErrors = validateVinyl(values);
  function calculateVisibleErrors() {
    const result = {
      ...errors
    };
    Object.entries(clientErrors).forEach(([field, message]) => {
      const touchKey = field.startsWith('audio') ? 'audio' : field;
      if (submitted || touched[touchKey]) result[field] = message;
    });
    return result;
  }
  const visibleErrors = calculateVisibleErrors();
  const handleChange = (field, value) => {
    setValues(current => ({
      ...current,
      [field]: value
    }));
    setErrors(current => {
      if (field === 'audio') {
        const {
          audioPreviewId,
          audioUrl,
          audioDuration,
          ...rest
        } = current;
        return rest;
      }
      if (!(field in current)) return current;
      const {
        [field]: _removed,
        ...rest
      } = current;
      return rest;
    });
    if (field === 'audio') setTouched(current => ({
      ...current,
      audio: true
    }));
  };
  const handleBlur = field => setTouched(current => ({
    ...current,
    [field]: true
  }));
  const focusFirstError = errorMap => {
    const first = FIELD_ORDER.find(field => errorMap[field]);
    if (!first) return;
    const element = formRef.current?.querySelector(FOCUS_TARGETS[first] ?? `#vf-${first}`);
    element?.focus();
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };
  const resolveAudioPreviewId = () => {
    const {
      audio
    } = values;
    if (audio.mode === 'existing') return Promise.resolve(audio.audioPreviewId);
    if (audio.mode !== 'new') return Promise.resolve(null);
    const key = `${audio.url.trim()}|${audio.durationSeconds}`;
    if (createdAudio.current?.key === key) return Promise.resolve(createdAudio.current.id);
    return dispatch(createAdminAudioPreview({
      url: audio.url.trim(),
      durationSeconds: Number(audio.durationSeconds) || 30
    })).unwrap().then(preview => {
      createdAudio.current = {
        key,
        id: preview.id
      };
      return preview.id;
    });
  };
  const handleSubmit = event => {
    event.preventDefault();
    setSubmitted(true);
    setServerError('');
    if (coverStatus === 'loading' || coverStatus === 'uploading' || coverStatus === 'error') {
      setServerError(coverStatus === 'error' ? 'Revisá la portada: la imagen no se pudo cargar. Subí un archivo JPG o PNG o pegá un enlace directo a una imagen.' : 'Esperá a que termine de cargar la portada.');
      return Promise.resolve();
    }
    if (Object.keys(clientErrors).length > 0) {
      focusFirstError(clientErrors);
      return Promise.resolve();
    }
    setSubmitting(true);
    return resolveAudioPreviewId().then(audioPreviewId => {
      return dispatch(saveAdminVinyl({
        vinylId: isEdit ? initialData.id : null,
        payload: toVinylPayload(values, audioPreviewId),
        enabled: values.enabled
      })).unwrap().then(saved => {
        createdAudio.current = null;
        onSuccess?.(saved);
      });
    }).catch(submitError => {
      const fieldErrors = mapServerFieldErrors(submitError.fieldErrors);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length > 0) {
        setServerError('El servidor rechazó algunos datos. Revisá los campos marcados.');
        focusFirstError(fieldErrors);
      } else if (submitError.isNotFound) {
        setServerError(`${submitError.message} Puede que lo hayan eliminado o que una relación (artista, género, categoría) ya no exista.`);
      } else if (submitError.isUnauthorized || submitError.isForbidden) {
        setServerError('Tu sesión no tiene permisos de administración. Volvé a ingresar.');
      } else {
        setServerError(submitError.message || 'No pudimos guardar el vinilo.');
      }
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }).finally(() => {
      setSubmitting(false);
    });
  };
  const handleReset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitted(false);
    setServerError('');
  };
  const handleCancel = () => {
    if (dirty && !window.confirm('Tenés cambios sin guardar. ¿Querés descartarlos?')) return;
    onCancel?.();
  };
  const lockedRelations = {
    artistId: isEdit && Boolean(initialData?.artistId),
    categoryId: isEdit && Boolean(initialData?.categoryId),
    genreId: isEdit && Boolean(initialData?.genreId),
    audio: isEdit && Boolean(initialData?.audioPreviewId)
  };
  const errorCount = Object.keys(visibleErrors).length;
  return <form ref={formRef} className="vinyl-form" onSubmit={handleSubmit} noValidate aria-busy={submitting}>
      {lookupError && <div className="admin-alert" role="alert"><p>No se pudieron cargar artistas, categorías o géneros: {lookupError}</p><button type="button" onClick={() => dispatch(fetchAdminLookups({ force: true }))}>Reintentar</button></div>}
      {serverError && <div className="admin-alert" role="alert">
          <p>{serverError}</p>
        </div>}
      {submitted && errorCount > 0 && !serverError && <p className="admin-alert" role="alert">
          Hay {errorCount} campo{errorCount === 1 ? '' : 's'} para revisar.
        </p>}

      <div className="vinyl-form-grid">
        <div className="vinyl-form-main">
          <VinylFormFields values={values} errors={visibleErrors} onChange={handleChange} onBlur={handleBlur} artists={artists} onArtistDeleted={id => {
          setValues(current => String(current.artistId) === String(id) ? { ...current, artistId: '' } : current);
        }} onCategoryDeleted={id => {
          setValues(current => String(current.categoryId) === String(id) ? { ...current, categoryId: '' } : current);
        }} categories={categories} lockedRelations={lockedRelations} />

          <fieldset className="vf-section">
            <legend><span className="vf-step">02</span> Género y descripción</legend>
            <GenreSelector value={values.genreIds} onChange={genreIds => handleChange('genreIds', genreIds)} genres={genres} error={visibleErrors.genreIds || visibleErrors.genreId} locked={lockedRelations.genreId} />
            <VinylDescriptionInput value={values.description} onChange={handleChange} onBlur={handleBlur} error={visibleErrors.description} />
          </fieldset>

          <fieldset className="vf-section">
            <legend><span className="vf-step">03</span> Precio y stock</legend>
            <div className="vf-span-2">
              <PriceInput price={values.price} discountPercentage={values.discountPercentage} onChange={handleChange} onBlur={handleBlur} errors={visibleErrors} />
            </div>
            <StockInput value={values.stock} onChange={handleChange} onBlur={handleBlur} error={visibleErrors.stock} initialStock={isEdit ? initialData?.stock ?? null : null} />
          </fieldset>

          <AudioUploader value={values.audio} onChange={handleChange} errors={visibleErrors} previews={previews} usedPreviewIds={usedPreviewIds} currentPreviewId={initialData?.audioPreviewId ?? ''} locked={lockedRelations.audio} />
          <fieldset className="vf-section">
            <legend><span className="vf-step">06</span> Enlace para escuchar</legend>
            <div className="vf-field vf-span-2">
              <label htmlFor="vf-albumUrl">Canción o álbum en una plataforma (opcional)</label>
              <input id="vf-albumUrl" type="url" inputMode="url" value={values.albumUrl} maxLength={MAX_ALBUM_URL_LENGTH} placeholder="https://music.apple.com/… o https://open.spotify.com/album/…" onChange={event => handleChange('albumUrl', event.target.value)} onBlur={() => handleBlur('albumUrl')} aria-invalid={Boolean(visibleErrors.albumUrl)} aria-describedby={`vf-albumUrl-hint${visibleErrors.albumUrl ? ' vf-albumUrl-error' : ''}`} />
              <p className="vf-hint" id="vf-albumUrl-hint">Acepta canciones y álbumes de Spotify o Apple Music, y videos de YouTube. Se muestra un reproductor y un enlace en el detalle. Si ya cargaste una preview, se reproduce esa muestra.</p>
              {visibleErrors.albumUrl && <p className="field-error" id="vf-albumUrl-error" role="alert">{visibleErrors.albumUrl}</p>}
              {getAlbumUrl(values.albumUrl) && <a className="link-button" href={getAlbumUrl(values.albumUrl)} target="_blank" rel="noopener noreferrer">Abrir enlace para comprobarlo ↗</a>}
            </div>
          </fieldset>
        </div>

        <aside className="vinyl-form-side">
          <fieldset className="vf-section">
            <legend><span className="vf-step">04</span> Portada</legend>
            <CoverUploader value={values.image} onChange={handleChange} onBlur={handleBlur} error={visibleErrors.image} onStatusChange={setCoverStatus} />
          </fieldset>
          <fieldset className="vf-section">
            <legend><span className="vf-step">07</span> Publicación</legend>
            <PublicationToggle checked={values.enabled} onChange={handleChange} stock={values.stock} />
          </fieldset>
        </aside>
      </div>

      <VinylFormActions mode={mode} submitting={submitting} dirty={dirty} onCancel={handleCancel} onReset={handleReset} />
    </form>;
};
export default VinylForm;
