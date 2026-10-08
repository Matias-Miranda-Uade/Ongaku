import { useState } from 'react'

const Footer = ({ onNavigate }) => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubscribe = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setMessage('Gracias. Esta versión de prueba no envía correos.')
  }

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <section className="footer-about">
          <strong>ONGAKU 音楽</strong>
          <p>Santuario editorial y bóveda de vinilos curados. Cada edición, elegida para escuchar sin apuro.</p>
          <span>✳ PRENSADOS SELECCIONADOS · EDICIONES DE ARCHIVO</span>
        </section>

        <nav className="footer-links" aria-label="Navegación del pie">
          <strong>NAVEGACIÓN</strong>
          <button onClick={() => onNavigate('catalog')}>Catálogo</button>
          <button onClick={() => onNavigate('reviews')}>Novedades y reseñas</button>
          <button onClick={() => onNavigate('favorites')}>Favoritos</button>
          <button onClick={() => onNavigate('orders')}>Mis órdenes</button>
        </nav>

        <section className="footer-links">
          <strong>ONGAKU</strong>
          <span>Curaduría musical</span>
          <span>Colección de vinilos</span>
          <span>Comunidad de escucha</span>
          <span>Archivo analógico</span>
        </section>

        <form className="footer-newsletter" onSubmit={handleSubscribe}>
          <label htmlFor="newsletter-email">BOLETÍN DE LANZAMIENTOS</label>
          <p>Novedades de la bóveda y nuevos prensados, en un solo lugar.</p>
          <div>
            <input
              id="newsletter-email"
              type="email"
              placeholder="tu.correo@ejemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button className="primary-button" type="submit">Unirme</button>
          </div>
          <span role="status">{message || 'Suscripción de demostración, sin envío de correos.'}</span>
        </form>
      </div>

      <div className="footer-bottom">
        <span>● ONGAKU Archive · Buenos Aires</span>
        <span>© 2026 ONGAKU Records &amp; Archive Editions</span>
      </div>
    </footer>
  )
}

export default Footer
