const PublicationToggle = ({ checked, onChange, stock }) => {
  const outOfStock = /^\d+$/.test(String(stock)) && Number(stock) === 0
  return (
    <div className="publication-toggle">
      <label className="switch">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          aria-describedby="vf-publication-hint"
          onChange={(event) => onChange('enabled', event.target.checked)}
        />
        <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
        <span className="switch-label">{checked ? 'Publicado en la vitrina' : 'Oculto (borrador)'}</span>
      </label>
      <p className="vf-hint" id="vf-publication-hint">
        {checked
          ? 'Los clientes lo verán en el catálogo apenas guardes.'
          : 'Queda en el inventario pero no aparece en el catálogo público.'}
        {checked && outOfStock && <strong className="vf-warning"> Ojo: se publica sin stock y figurará como agotado.</strong>}
      </p>
    </div>
  )
}

export default PublicationToggle
