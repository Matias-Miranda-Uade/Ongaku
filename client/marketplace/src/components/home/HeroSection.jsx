import Button from '../ui/Button'

const HeroSection = ({ onExplore }) => (
  <section>
    <h1>Ongaku</h1>
    <p>Explorá el archivo musical.</p>
    <Button onClick={onExplore}>Explorar archivo</Button>
  </section>
)
export default HeroSection
