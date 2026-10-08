import Button from '../ui/Button'

const HeroSection = ({ onExplore }) => (
  <section className="home-hero">
    <div className="home-hero-backdrop" aria-hidden="true" />
    <div className="home-hero-content">
      <p className="eyebrow">● BÓVEDA DE ARCHIVO · TOKIO &amp; KYOTO</p>
      <h1>ONGAKU ARCHIVE</h1>
      <p className="home-hero-subtitle">Prensados de época</p>
      <Button className="hero-button" onClick={onExplore}>Explorar catálogo <span aria-hidden="true">→</span></Button>
    </div>
    <span className="home-scroll-cue">DESPLAZAR <i /></span>
  </section>
)
export default HeroSection
