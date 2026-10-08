import Tag from '../ui/Tag'

const VinylTags = ({ vinyl }) => (
  <div className="vinyl-tags">
    {vinyl.categoryDescription && <Tag>{vinyl.categoryDescription}</Tag>}
    {vinyl.genreName && <Tag>{vinyl.genreName}</Tag>}
    {vinyl.year && <Tag>{vinyl.year}</Tag>}
  </div>
)
export default VinylTags
