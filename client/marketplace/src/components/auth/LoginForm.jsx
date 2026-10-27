import { useState } from 'react';
import AuthInput from './AuthInput';
import PasswordInput from './PasswordInput';
import Button from '../ui/Button';
import SectionTitle from '../ui/SectionTitle';
const LoginForm = ({
  onLogin
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = event => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Completá el email y la contraseña.');
      return Promise.resolve();
    }
    setError('');
    const normalizedEmail = email.trim().toLowerCase();
    setSubmitting(true);
    return Promise.resolve(onLogin({
      email: normalizedEmail,
      password
    })).then(() => {}).catch(loginError => {
      setError(loginError.message);
    }).finally(() => {
      setSubmitting(false);
    });
  };
  return <form onSubmit={handleSubmit}>
      <SectionTitle>Ingresar</SectionTitle>
      <AuthInput label="Email" name="login-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
      <PasswordInput label="Contraseña" name="login-password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} />
      {error && <p role="alert">{error}</p>}
      <Button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Ingresando…' : 'Ingresar'}
      </Button>
    </form>;
};
export default LoginForm;
