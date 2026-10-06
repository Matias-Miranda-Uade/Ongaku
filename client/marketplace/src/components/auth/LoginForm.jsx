import { useState } from 'react'
import AuthInput from './AuthInput'
import PasswordInput from './PasswordInput'
import Button from '../ui/Button'
import SectionTitle from '../ui/SectionTitle'

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Completá el email y la contraseña.')
      return
    }
    setError('')
    onLogin({ name: email.trim().split('@')[0] })
  }

  return (
    <form onSubmit={handleSubmit}>
      <SectionTitle>Ingresar</SectionTitle>
      <AuthInput label="Email" name="login-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
      <PasswordInput label="Contraseña" name="login-password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} />
      {error && <p role="alert">{error}</p>}
      <Button type="submit">Ingresar</Button>
    </form>
  )
}
export default LoginForm
