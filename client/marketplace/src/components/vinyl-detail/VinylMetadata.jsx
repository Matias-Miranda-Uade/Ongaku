const VinylMetadata = ({ vinyl }) => (
  <dl className="metadata-grid">
    <div><dt>AÑO</dt><dd>{vinyl.year || '—'}</dd></div>
    <div><dt>ARTISTA</dt><dd>{vinyl.artistName || `#${vinyl.artistId ?? '—'}`}</dd></div>
    <div><dt>GÉNERO</dt><dd>{vinyl.genreName || `#${vinyl.genreId ?? '—'}`}</dd></div>
    <div><dt>CATEGORÍA</dt><dd>{vinyl.categoryDescription || `#${vinyl.categoryId ?? '—'}`}</dd></div>
  </dl>
)
export default VinylMetadata
