import { useState } from 'react'
import AuthInput from './AuthInput'
import IconButton from '../ui/IconButton'

const PasswordInput = (props) => {
  const [visible, setVisible] = useState(false)
  return (
    <div className="password-field">
      <AuthInput {...props} type={visible ? 'text' : 'password'} />
      <IconButton className="password-visibility-button" label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={visible} onClick={() => setVisible(!visible)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {!visible && <path d="m4 4 16 16" />}
        </svg>
      </IconButton>
    </div>
  )
}
export default PasswordInput
