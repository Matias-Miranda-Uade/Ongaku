import VinylCard from './VinylCard'

const VinylGrid = ({ vinyls, onOpenVinyl }) => {
  if (!vinyls.length) return <p className="empty-state">No encontramos vinilos con esos filtros.</p>
  return (
    <div className="vinyl-grid">
      {vinyls.map((vinyl) => (
        <VinylCard key={vinyl.id} vinyl={vinyl} onOpen={onOpenVinyl} />
      ))}
    </div>
  )
}
export default VinylGrid
