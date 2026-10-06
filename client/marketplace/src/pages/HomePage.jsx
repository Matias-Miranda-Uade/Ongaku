import { useState } from 'react'
import HeroSection from '../components/home/HeroSection'
import ArchiveStrip from '../components/home/ArchiveStrip'
import ArchiveCategoryGrid from '../components/home/ArchiveCategoryGrid'
import ArchiveQuote from '../components/home/ArchiveQuote'
import SectionTitle from '../components/ui/SectionTitle'

const categories = [
  { id: 'rock', name: 'Rock', description: 'Explorá la categoría Rock.' },
  { id: 'jazz', name: 'Jazz', description: 'Explorá la categoría Jazz.' },
  { id: 'pop', name: 'Pop', description: 'Explorá la categoría Pop.' },
  { id: 'electronic', name: 'Electrónica', description: 'Explorá la categoría Electrónica.' },
]

const HomePage = ({ user }) => {
  const [selectedId, setSelectedId] = useState(null)
  const selectedCategory = categories.find(category => category.id === selectedId)
  const handleSelect = (id) => setSelectedId(selectedId === id ? null : id)

  return (
    <>
      {user && <p role="status">Hola, {user.name}. Sesión de prueba iniciada.</p>}
      <HeroSection onExplore={() => document.getElementById('archive').scrollIntoView()} />
      <section aria-labelledby="archive">
        <SectionTitle id="archive">Archivo musical</SectionTitle>
        <ArchiveStrip categoryCount={categories.length} />
        <ArchiveCategoryGrid categories={categories} selectedId={selectedId} onSelect={handleSelect} />
        {selectedCategory && <p role="status">{selectedCategory.description}</p>}
      </section>
      <ArchiveQuote quote="Un espacio para descubrir música." />
    </>
  )
}
export default HomePage
