import { useDispatch, useSelector } from 'react-redux';
import { clearAuthErrors, selectAuth } from '../../Redux/slices/authSlice';
import { useEffect, useState } from 'react';
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
  const dispatch = useDispatch();
  const { sessionStatus, loginError } = useSelector(selectAuth);
  const submitting = sessionStatus === 'loading';
  useEffect(() => { dispatch(clearAuthErrors()); }, [dispatch]);
  const handleSubmit = event => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Completá el email y la contraseña.');
      return Promise.resolve();
    }
    setError('');
    const normalizedEmail = email.trim().toLowerCase();
    return Promise.resolve(onLogin({
      email: normalizedEmail,
      password
    })).catch(() => {});
  };
  return <form onSubmit={handleSubmit}>
      <SectionTitle>Ingresar</SectionTitle>
      <AuthInput label="Email" name="login-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
      <PasswordInput label="Contraseña" name="login-password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} />
      {(error || loginError) && <p role="alert">{error || loginError}</p>}
      <Button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Ingresando…' : 'Ingresar'}
      </Button>
    </form>;
};
export default LoginForm;
