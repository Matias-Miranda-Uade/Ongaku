import { useState } from 'react'
import { changePassword } from '../../services/api'

const AuthenticationCard = ({ email }) => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setMessage('')
        if (newPassword.length < 8) {
            setError('La nueva contraseña debe tener al menos 8 caracteres.')
            return
        }
        if (newPassword !== confirmation) {
            setError('Las contraseñas nuevas no coinciden.')
            return
        }

        setSaving(true)
        try {
            await changePassword({ currentPassword, newPassword })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmation('')
            setMessage('La contraseña se actualizó correctamente.')
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <section className="security-details" aria-labelledby="security-heading">
            <p className="eyebrow">ACCESO</p>
            <h2 id="security-heading">Seguridad de la cuenta</h2>
            <dl>
                <div><dt>Correo asociado</dt><dd>{email}</dd></div>
                <div><dt>Privacidad</dt><dd>Tu contraseña no se guarda en este navegador.</dd></div>
            </dl>
            <form onSubmit={handleSubmit}>
                <label htmlFor="current-password">Contraseña actual</label>
                <input id="current-password" type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                <label htmlFor="new-password">Nueva contraseña</label>
                <input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                <label htmlFor="confirm-new-password">Confirmar contraseña</label>
                <input id="confirm-new-password" type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
                {error && <p role="alert">{error}</p>}
                {message && <p role="status">{message}</p>}
                <button className="primary-button" type="submit" disabled={saving}>
                    {saving ? 'Actualizando…' : 'Cambiar contraseña'}
                </button>
            </form>
        </section>
    )
}

export default AuthenticationCard
