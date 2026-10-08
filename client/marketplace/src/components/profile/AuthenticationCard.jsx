const AuthenticationCard = ({ email }) => (
    <section className="security-details" aria-labelledby="security-heading">
        <p className="eyebrow">ACCESO</p>
        <h2 id="security-heading">Seguridad de la cuenta</h2>
        <p>Esta cuenta funciona en modo de demostración y no tiene una contraseña guardada en Ongaku.</p>
        <dl>
            <div><dt>Correo asociado</dt><dd>{email || 'Sin correo asociado'}</dd></div>
            <div><dt>Privacidad</dt><dd>Tu contraseña nunca se guarda en este navegador.</dd></div>
        </dl>
    </section>
)

export default AuthenticationCard
