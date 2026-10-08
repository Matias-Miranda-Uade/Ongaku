import ArchiveCategoryCard from './ArchiveCategoryCard'

const ArchiveCategoryGrid = ({ categories, selectedId, onSelect }) => (
  <div className="category-grid">
    {categories.map(category => (
      <ArchiveCategoryCard key={category.id} category={category} selected={selectedId === category.id} onSelect={onSelect} />
    ))}
  </div>
)
export default ArchiveCategoryGrid
