import VinylCover from './VinylCover'

const VinylImage = ({ src, alt }) => (
  <div className="vinyl-image-wrap">
    <VinylCover className="vinyl-image" src={src} alt={alt} />
  </div>
)
export default VinylImage
