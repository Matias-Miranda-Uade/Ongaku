const ArchiveStrip = ({ categoryCount }) => (
  <p className="archive-strip">{String(categoryCount).padStart(2, '0')} CATEGORÍAS EN EL ARCHIVO</p>
)

export default ArchiveStrip
