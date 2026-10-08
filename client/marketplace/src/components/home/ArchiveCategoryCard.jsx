import Button from '../ui/Button'

const ArchiveCategoryCard = ({ category, selected, onSelect }) => (
  <article className="archive-category-card" style={{ '--category-image': `url("${category.image}")` }}>
    <span className="archive-category-index">{category.number} / 音楽</span>
    <span className="archive-category-caption">{category.subtitle}</span>
    <h3>{category.name}</h3>
    <Button aria-pressed={selected} onClick={() => onSelect(category.id)} aria-label={`${selected ? 'Quitar selección de' : 'Explorar'} ${category.name}`}>
      {selected ? '−' : '↗'}
    </Button>
  </article>
)
export default ArchiveCategoryCard
