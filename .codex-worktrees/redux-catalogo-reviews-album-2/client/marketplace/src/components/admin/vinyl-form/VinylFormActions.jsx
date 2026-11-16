const VinylFormActions = ({ mode, submitting = false, dirty = false, onCancel, onReset }) => (
  <div className="vf-actions">
    <p className="vf-dirty" aria-live="polite">
      {submitting ? 'Guardando…' : dirty ? 'Hay cambios sin guardar' : mode === 'edit' ? 'Sin cambios' : ''}
    </p>
    <div className="vf-actions-buttons">
      <button type="button" className="link-button" onClick={onReset} disabled={!dirty || submitting}>
        {mode === 'edit' ? 'Deshacer cambios' : 'Limpiar'}
      </button>
      <button type="button" className="secondary-button" onClick={onCancel} disabled={submitting}>Cancelar</button>
      <button type="submit" className="primary-button" disabled={submitting || (mode === 'edit' && !dirty)}>
        {submitting ? 'Guardando…' : mode === 'edit' ? 'Guardar cambios' : 'Crear vinilo'}
      </button>
    </div>
  </div>
)

export default VinylFormActions
