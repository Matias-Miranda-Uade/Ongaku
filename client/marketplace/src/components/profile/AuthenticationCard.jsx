import { useState } from "react"

const emptyForm = { currentPassword: '', newPassword: '', confirmPassword: '' }

const AuthenticationCard = ({ email }) => {

    const [form, setForm] = useState(emptyForm)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSuccess('')

        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            setError('Completá todos los campos')
            return
        }
        if (form.newPassword.length < 8) {
            setError('La nueva contraseña debe tener al menos 8 caracteres')
            return
        }
        if (form.newPassword === form.currentPassword) {
            setError('La nueva contraseña debe ser distinta a la actual')
            return
        }
        if (form.newPassword !== form.confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        setError('')
        setSuccess('Contraseña actualizada')
        setForm(emptyForm)
    }

    return (
        <>
        <h2>Cambiar contraseña</h2>
        <p>Cuenta: {email}</p>
        <form onSubmit={handleSubmit}>
            <label>Contraseña actual</label> <br />
            <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} /> <br />
            <label>Nueva contraseña</label> <br />
            <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} /> <br />
            <label>Repetir nueva contraseña</label> <br />
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} /> <br />
            <button type="submit">Guardar</button>
        </form>
        {error && <p role="alert">{error}</p>}
        {success && <p>{success}</p>}
        </>
    )
}

export default AuthenticationCard
