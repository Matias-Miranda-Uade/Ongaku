import { FieldError, fieldA11y } from './VinylFormFields'
import { MAX_TEXT_LENGTH } from './vinylFormModel'

const VinylDescriptionInput = ({ value, onChange, onBlur, error, maxLength = MAX_TEXT_LENGTH }) => {
  const remaining = maxLength - value.length
  return (
    <div className="vf-field vf-span-2">
      <label htmlFor="vf-description">Descripción</label>
      <textarea
        {...fieldA11y('description', error, 'vf-description-count')}
        rows={4}
        value={value}
        placeholder="Prensaje, gramaje, estado de la funda, notas del curador…"
        onChange={(event) => onChange('description', event.target.value)}
        onBlur={() => onBlur('description')}
      />
      <p className={`vf-counter${remaining < 0 ? ' is-over' : remaining < 30 ? ' is-near' : ''}`} id="vf-description-count" aria-live="polite">
        {remaining >= 0 ? `${remaining} caracteres disponibles` : `${Math.abs(remaining)} caracteres de más`}
      </p>
      <FieldError id="vf-description-error" message={error} />
    </div>
  )
}

export default VinylDescriptionInput
