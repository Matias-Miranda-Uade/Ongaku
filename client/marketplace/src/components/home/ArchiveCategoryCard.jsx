import Button from '../ui/Button'

const ArchiveCategoryCard = ({ category, selected, onSelect }) => (
  <article>
    <h3>{category.name}</h3>
    <Button aria-pressed={selected} onClick={() => onSelect(category.id)}>
      {selected ? 'Quitar selección' : 'Seleccionar categoría'}
    </Button>
  </article>
)
export default ArchiveCategoryCard
