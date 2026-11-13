import { useDispatch, useSelector } from 'react-redux';
import { clearAuthErrors, selectAuth } from '../../Redux/slices/authSlice';
import { useEffect, useState } from 'react';
import AuthInput from './AuthInput';
import PasswordInput from './PasswordInput';
import Button from '../ui/Button';
import SectionTitle from '../ui/SectionTitle';
const RegisterForm = ({
  onRegister
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { sessionStatus, registerError } = useSelector(selectAuth);
  const submitting = sessionStatus === 'loading';
  useEffect(() => { dispatch(clearAuthErrors()); }, [dispatch]);
  const handleSubmit = event => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError('Completá todos los campos.');
      return Promise.resolve();
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return Promise.resolve();
    }
    if (new TextEncoder().encode(password).length > 72) {
      setError('La contraseña es demasiado larga.');
      return Promise.resolve();
    }
    if (password !== confirmation) {
      setError('Las contraseñas no coinciden.');
      return Promise.resolve();
    }
    setError('');
    return Promise.resolve(onRegister({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password
    })).catch(() => {});
  };
  return <form onSubmit={handleSubmit}>
      <SectionTitle>Crear tu cuenta</SectionTitle>
      <div className="register-name-grid">
        <AuthInput label="Nombre" name="register-first-name" autoComplete="given-name" required value={firstName} onChange={event => setFirstName(event.target.value)} />
        <AuthInput label="Apellido" name="register-last-name" autoComplete="family-name" required value={lastName} onChange={event => setLastName(event.target.value)} />
      </div>
      <AuthInput label="Email" name="register-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
      <PasswordInput label="Contraseña" name="register-password" autoComplete="new-password" required minLength={8} aria-describedby="register-password-hint" value={password} onChange={event => setPassword(event.target.value)} />
      <p className="password-requirement" id="register-password-hint" aria-live="polite">
        Usá al menos 8 caracteres.
      </p>
      <PasswordInput label="Confirmar contraseña" name="register-confirmation" autoComplete="new-password" required minLength={8} value={confirmation} onChange={event => setConfirmation(event.target.value)} />
      {(error || registerError) && <p role="alert">{error || registerError}</p>}
      <Button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>
    </form>;
};
export default RegisterForm;
