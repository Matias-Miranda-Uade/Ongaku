const ArchiveCategoryCard = ({ category, onSelect }) => (
  <button type="button" className="archive-category-card" aria-label={`Explorar ${category.name}`} onClick={() => onSelect(category.id)} style={{ '--category-image': `url("${category.image}")` }}>
    <span className="archive-category-index">{category.number} / 音楽</span>
    <span className="archive-category-caption">{category.subtitle}</span>
    <h3>{category.name}</h3>
    <span className="archive-category-action" aria-hidden="true">↗</span>
  </button>
)
export default ArchiveCategoryCard
