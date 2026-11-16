const VinylMetadata = ({ vinyl }) => (
  <dl className="metadata-grid">
    <div><dt>AÑO</dt><dd>{vinyl.year || '—'}</dd></div>
    <div><dt>ARTISTA</dt><dd>{vinyl.artistName || `#${vinyl.artistId ?? '—'}`}</dd></div>
    <div><dt>GÉNEROS</dt><dd>{vinyl.genreNames?.length ? vinyl.genreNames.join(' · ') : vinyl.genreName || 'Sin género'}</dd></div>
    <div><dt>CATEGORÍA</dt><dd>{vinyl.categoryDescription || `#${vinyl.categoryId ?? '—'}`}</dd></div>
  </dl>
)
export default VinylMetadata
