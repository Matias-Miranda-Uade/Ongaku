import { useState } from 'react'
import HeroSection from '../components/home/HeroSection'
import ArchiveStrip from '../components/home/ArchiveStrip'
import ArchiveCategoryGrid from '../components/home/ArchiveCategoryGrid'
import ArchiveQuote from '../components/home/ArchiveQuote'
import SectionTitle from '../components/ui/SectionTitle'
import { products } from '../data/mockData'

const categories = [
  { id: 'ambient', name: 'Ambient', number: '01', subtitle: 'TAKADA / MINIMAL', description: 'Explorá prensados ambientales y música para escuchar sin apuro.', image: products[0].image },
  { id: 'city-pop', name: 'City Pop', number: '02', subtitle: 'TOKIO / 1980', description: 'Descubrí sonidos urbanos y pop japonés de archivo.', image: products[1].image },
  { id: 'jazz', name: 'Jazz Fusión', number: '03', subtitle: 'SELECCIÓN ONGAKU', description: 'Explorá sesiones, jazz y cruces de la bóveda.', image: products[3].image },
  { id: 'limited', name: 'Ediciones limitadas', number: '04', subtitle: 'SERIES DE ARCHIVO', description: 'Encontrá primeras ediciones y prensados especiales.', image: products[4].image },
]

const HomePage = ({ user, onNavigate }) => {
  const [selectedId, setSelectedId] = useState(null)
  const selectedCategory = categories.find(category => category.id === selectedId)
  const handleSelect = (id) => setSelectedId(selectedId === id ? null : id)

  return (
    <>
      {user && <p className="welcome-notice" role="status">Qué bueno verte, {user.name}.</p>}
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
        <ArchiveCategoryGrid categories={categories} selectedId={selectedId} onSelect={handleSelect} />
        {selectedCategory && <p role="status">{selectedCategory.description}</p>}
      </section>
      <ArchiveQuote quote="La pureza de la cinta máster preservada en surcos de cera virgen." author="BÓVEDA ONGAKU" />
    </>
  )
}
export default HomePage
