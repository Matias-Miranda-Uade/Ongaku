import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/home/HeroSection'
import ArchiveStrip from '../components/home/ArchiveStrip'
import ArchiveCategoryGrid from '../components/home/ArchiveCategoryGrid'
import SectionTitle from '../components/ui/SectionTitle'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVinyls, selectCuratedCollections } from '../Redux/slices/catalogSlice';

const HomePage = ({ user, onNavigate }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const categories = useSelector(selectCuratedCollections)
  const { status, error } = useSelector(state => state.catalog.list)
  useEffect(() => { dispatch(fetchVinyls()) }, [dispatch])
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
        {error && <div role="alert"><p>{error}</p><button type="button" onClick={() => dispatch(fetchVinyls({ force: true }))}>Reintentar</button></div>}
        <ArchiveCategoryGrid categories={categories} loaded={status === 'succeeded'} onSelect={handleSelect} />
      </section>
    </>
  )
}
export default HomePage
