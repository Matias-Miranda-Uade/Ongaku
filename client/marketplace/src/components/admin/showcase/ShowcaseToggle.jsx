const ShowcaseToggle = ({ checked, onChange, disabled = false, pending = false, saving = false, label }) => (
  <label className={`switch switch-compact${pending ? ' is-pending' : ''}`}>
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      disabled={disabled || saving}
      aria-label={label}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
    <span className="switch-label">
      {saving ? 'Guardando…' : checked ? 'Visible' : 'Oculto'}
      {pending && !saving && <span className="pending-dot" title="Cambio sin aplicar"> · sin aplicar</span>}
    </span>
  </label>
)

export default ShowcaseToggle
