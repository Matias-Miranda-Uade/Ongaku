const Footer = ({ onNavigate }) => (
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
    </div>

    <div className="footer-bottom">
      <span>● ONGAKU Archive · Buenos Aires</span>
      <span>© 2026 ONGAKU Records &amp; Archive Editions</span>
    </div>
  </footer>
)

export default Footer
