const AuthVisualPanel = ({ activeTab }) => (
  <aside className={`auth-visual ${activeTab === 'login' ? 'auth-visual-login' : 'auth-visual-register'}`}>
    <p className="eyebrow">ONGAKU / ARCHIVO ANALÓGICO</p>
    <div className="auth-visual-copy">
      <span className="auth-visual-kicker">{activeTab === 'login' ? 'TU MÚSICA TE ESPERA' : 'SUMATE A LA COMUNIDAD'}</span>
      <h1>{activeTab === 'login' ? 'Qué bueno tenerte de vuelta.' : 'Empezá tu colección.'}</h1>
      <p>{activeTab === 'login' ? 'Entrá a tu gabinete y seguí explorando discos para escuchar sin apuro.' : 'Descubrí ediciones únicas y guardá tus próximos favoritos.'}</p>
    </div>
    <div className="auth-visual-record" aria-hidden="true"><span /></div>
  </aside>
)

export default AuthVisualPanel
