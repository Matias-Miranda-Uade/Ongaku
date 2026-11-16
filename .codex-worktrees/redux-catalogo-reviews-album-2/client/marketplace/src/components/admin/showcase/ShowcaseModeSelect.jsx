export const SHOWCASE_MODES = {
  instant: {
    label: 'Inmediato',
    description: 'Cada cambio se publica en el momento.',
  },
  batch: {
    label: 'Por lotes',
    description: 'Prepará varios cambios y aplicalos juntos.',
  },
}

const ShowcaseModeSelect = ({ mode, onChange, pendingCount = 0, disabled = false }) => {
  const handleChange = (nextMode) => {
    if (nextMode === mode) return
    if (mode === 'batch' && pendingCount > 0
      && !window.confirm(`Tenés ${pendingCount} cambio${pendingCount === 1 ? '' : 's'} sin aplicar. Si cambiás de modo se descartan. ¿Continuar?`)) {
      return
    }
    onChange(nextMode)
  }

  return (
    <div className="showcase-mode">
      <label htmlFor="showcase-mode-select" className="vf-label">Modo de edición</label>
      <select
        id="showcase-mode-select"
        value={mode}
        disabled={disabled}
        onChange={(event) => handleChange(event.target.value)}
        aria-describedby="showcase-mode-hint"
      >
        {Object.entries(SHOWCASE_MODES).map(([id, option]) => (
          <option key={id} value={id}>{option.label}</option>
        ))}
      </select>
      <p className="vf-hint" id="showcase-mode-hint">{SHOWCASE_MODES[mode].description}</p>
    </div>
  )
}

export default ShowcaseModeSelect
