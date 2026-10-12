import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/home/HeroSection'
import ArchiveStrip from '../components/home/ArchiveStrip'
import ArchiveCategoryGrid from '../components/home/ArchiveCategoryGrid'
import ArchiveQuote from '../components/home/ArchiveQuote'
import SectionTitle from '../components/ui/SectionTitle'
import { collections as categories } from '../data/collections'

const HomePage = ({ user, onNavigate }) => {
  const navigate = useNavigate()
  const handleSelect = (id) => navigate(`/app/catalog?collection=${encodeURIComponent(id)}`)

  return (
    <>
      {user && <p className="welcome-notice" role="status">Qué bueno verte, {user.firstName || user.name}.</p>}
      <HeroSection onExplore={() => onNavigate('catalog')} />
      <div className="archive-promise">ENVÍOS CUIDADOS · PRENSADOS SELECCIONADOS · HISTORIAS PARA VOLVER A ESCUCHAR</div>
      <section className="home-archive" aria-labelledby="archive-heading">
        <div className="archive-section-heading">
          <div>
            <p className="eyebrow">COLECCIONES PRINCIPALES</p>
            <SectionTitle id="archive-heading">Una bóveda por descubrir</SectionTitle>
          </div>
          <span>04 DIVISIONES DE ARCHIVO</span>
        </div>
        <ArchiveStrip categoryCount={categories.length} />
        <ArchiveCategoryGrid categories={categories} onSelect={handleSelect} />
      </section>
      <ArchiveQuote quote="La pureza de la cinta máster preservada en surcos de cera virgen." author="BÓVEDA ONGAKU" />
    </>
  )
}
export default HomePage
