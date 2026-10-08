import { useState } from 'react'
import AuthInput from './AuthInput'
import IconButton from '../ui/IconButton'

const PasswordInput = (props) => {
  const [visible, setVisible] = useState(false)
  return (
    <div className="password-field">
      <AuthInput {...props} type={visible ? 'text' : 'password'} />
      <IconButton label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={visible} onClick={() => setVisible(!visible)}>
        {visible ? 'Ocultar' : 'Mostrar'}
      </IconButton>
    </div>
  )
}
export default PasswordInput
