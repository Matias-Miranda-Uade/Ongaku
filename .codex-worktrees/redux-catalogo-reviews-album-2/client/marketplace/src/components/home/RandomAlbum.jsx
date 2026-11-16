import { useState } from 'react';
import { useSelector } from 'react-redux';
import VinylCover from '../vinyl/VinylCover';
import AudioPreview from '../audio/AudioPreview';
import { chooseRandomAlbum } from './chooseRandomAlbum';
import { selectVinyls } from '../../Redux/slices/catalogSlice';

const RandomAlbum = ({ onOpenAlbum, onExplore }) => {
  const catalog = useSelector(state => state.catalog);
  const [selectedId, setSelectedId] = useState(null);
  const vinyls = selectVinyls({ catalog });
  const selected = vinyls.find(vinyl => String(vinyl.id) === String(selectedId));
  const loading = catalog.list.status === 'idle' || catalog.list.status === 'loading';
  const available = vinyls.some(vinyl => vinyl.audioPreviewId);
  const choose = () => setSelectedId(chooseRandomAlbum(vinyls, selectedId)?.id ?? null);

  return <section className="home-discovery" aria-labelledby="discovery-title">
    <div className="discovery-intro">
      <p className="eyebrow">EL AZAR TIENE BUEN OÍDO</p>
      <h2 id="discovery-title">¿No sabés qué escuchar?</h2>
      <p>Descubrí un nuevo sonido. Dejá que Ongaku elija un álbum para vos.</p>
      {loading ? <p role="status">Buscando sonidos en el archivo…</p>
        : catalog.list.error ? <p role="alert">No pudimos cargar las recomendaciones. Reintentá desde las colecciones.</p>
        : !available ? <p>No hay álbumes con preview disponibles por ahora.</p> : null}
      <div className="discovery-actions">
        <button className="primary-button" type="button" disabled={loading || !available || Boolean(catalog.list.error)} onClick={choose}>
          <span aria-hidden="true">⤨</span> {selected ? 'Otro álbum' : 'Sorprendeme'}
        </button>
        <button className="text-link link-button" type="button" onClick={onExplore}>Explorar catálogo →</button>
      </div>
    </div>
    {selected ? <div className="discovery-selection" aria-live="polite">
      <VinylCover className="discovery-cover" src={selected.image} alt={selected.name} />
      <div className="discovery-album">
        <p className="eyebrow">TU PRÓXIMA ESCUCHA</p>
        <h3>{selected.name}</h3>
        {selected.artistName && <p>{selected.artistName}</p>}
        <button className="text-link link-button" type="button" onClick={() => onOpenAlbum(selected.id)}>Ver álbum →</button>
      </div>
      <AudioPreview key={selected.id} audioPreviewId={selected.audioPreviewId} externalUrl={selected.albumUrl} />
    </div> : <div className="discovery-empty" aria-hidden="true"><span>33⅓</span><p>UN DISCO. UN NUEVO COMIENZO.</p></div>}
  </section>;
};

export default RandomAlbum;
