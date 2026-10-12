import { useState } from 'react'
import AuthInput from './AuthInput'
import PasswordInput from './PasswordInput'
import Checkbox from '../ui/Checkbox'
import Button from '../ui/Button'
import SectionTitle from '../ui/SectionTitle'

const RegisterForm = ({ onRegister }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Completá todos los campos.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirmation) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (!accepted) {
      setError('Aceptá las condiciones para crear tu cuenta.')
      return
    }
    setError('')
    const [firstName, ...lastNames] = name.trim().split(/\s+/)
    setSubmitting(true)
    try {
      await onRegister({
        firstName,
        lastName: lastNames.join(' '),
        email: email.trim().toLowerCase(),
        password,
      })
    } catch (registerError) {
      setError(registerError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <SectionTitle>Crear tu cuenta</SectionTitle>
      <AuthInput label="Nombre" name="register-name" autoComplete="name" required value={name} onChange={event => setName(event.target.value)} />
      <AuthInput label="Email" name="register-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
      <PasswordInput label="Contraseña" name="register-password" autoComplete="new-password" required value={password} onChange={event => setPassword(event.target.value)} />
      <PasswordInput label="Confirmar contraseña" name="register-confirmation" autoComplete="new-password" required value={confirmation} onChange={event => setConfirmation(event.target.value)} />
      <Checkbox label="Acepto crear mi cuenta en Ongaku" name="register-accepted" required checked={accepted} onChange={event => setAccepted(event.target.checked)} />
      {error && <p role="alert">{error}</p>}
      <Button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>
    </form>
  )
}
export default RegisterForm
