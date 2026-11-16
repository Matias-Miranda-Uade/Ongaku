import ShowcaseModeSelect from './ShowcaseModeSelect'

const ShowcaseHeader = ({
  publishedCount,
  hiddenCount,
  soldOutPublished = 0,
  mode,
  onModeChange,
  pendingCount = 0,
  applying = false,
  loading = false,
  onApply,
  onDiscard,
  onRefresh,
  onHideSoldOut,
}) => (
  <header className="showcase-header">
    <div className="admin-page-header">
      <div>
        <p className="eyebrow">展示 · DISPONIBILIDAD EN VITRINA</p>
        <h1 id="showcase-title">Vitrina</h1>
        <p className="admin-panel-sub">Decidí qué vinilos ven los clientes en el catálogo público.</p>
      </div>
      <div className="admin-page-actions">
        <button type="button" className="secondary-button" onClick={onRefresh} disabled={loading || applying}>
          {loading ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>
    </div>

    <div className="showcase-summary">
      <dl className="inventory-stats showcase-counts">
        <div><dt>Publicados</dt><dd>{publishedCount}</dd></div>
        <div><dt>Ocultos</dt><dd>{hiddenCount}</dd></div>
        <div className={soldOutPublished ? 'is-warning' : undefined}><dt>Publicados sin stock</dt><dd>{soldOutPublished}</dd></div>
      </dl>
      <ShowcaseModeSelect mode={mode} onChange={onModeChange} pendingCount={pendingCount} disabled={applying} />
    </div>

    {soldOutPublished > 0 && (
      <div className="admin-alert admin-alert-warning">
        <p>{soldOutPublished} vinilo{soldOutPublished === 1 ? ' está publicado' : 's están publicados'} sin stock y figuran como agotados.</p>
        <button type="button" className="link-button" onClick={onHideSoldOut} disabled={applying}>
          {mode === 'batch' ? 'Marcar para ocultar' : 'Ocultarlos'}
        </button>
      </div>
    )}

    {mode === 'batch' && (
      <div className={`showcase-pending${pendingCount ? ' has-pending' : ''}`} role="status" aria-live="polite">
        <p>
          {pendingCount
            ? <><strong>{pendingCount}</strong> cambio{pendingCount === 1 ? '' : 's'} sin aplicar</>
            : 'No hay cambios pendientes.'}
        </p>
        <div>
          <button type="button" className="link-button" onClick={onDiscard} disabled={!pendingCount || applying}>Descartar</button>
          <button type="button" className="primary-button" onClick={onApply} disabled={!pendingCount || applying}>
            {applying ? 'Aplicando…' : 'Aplicar cambios'}
          </button>
        </div>
      </div>
    )}
  </header>
)

export default ShowcaseHeader
