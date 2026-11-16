import ArchiveCategoryCard from './ArchiveCategoryCard'

const ArchiveCategoryGrid = ({ categories, loaded, onSelect }) => (
  <div className="category-grid">
    {categories.map(category => (
      <ArchiveCategoryCard key={category.id} category={category} loaded={loaded} onSelect={onSelect} />
    ))}
  </div>
)
export default ArchiveCategoryGrid
