import VinylCover from '../vinyl/VinylCover'
import VinylPrice from '../vinyl/VinylPrice'
import './suggestedProducts.css'

const SuggestedProducts = ({ products, onAdd, disabled = false }) => {
  if (!products.length) return null
  return <section className="bag-picks" aria-labelledby="bag-picks-title">
    <header className="bag-picks-heading">
      <div><p className="eyebrow">SEGUÍ EXPLORANDO / 音楽</p><h2 id="bag-picks-title">Un disco más para tu colección.</h2></div>
      <p>También te puede interesar</p>
    </header>
    <ul className="bag-picks-grid">
      {products.map((product, index) => <li className="bag-pick" key={product.id}>
        <div className="bag-pick-art">
          <VinylCover src={product.image} alt={`Portada de ${product.name}`} />
          <span className="bag-pick-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          {product.stock <= 0 && <span className="bag-pick-stock">Sin stock</span>}
        </div>
        <div className="bag-pick-body">
          <p className="bag-pick-artist">{product.artistName || product.artist}</p>
          <h3>{product.name}</h3>
          <div className="bag-pick-footer">
            <VinylPrice vinyl={product} />
            <button type="button" onClick={() => onAdd(product)} disabled={disabled || product.stock <= 0} aria-label={`Agregar ${product.name} al carrito`}>
              <span>{product.stock <= 0 ? 'Sin stock' : 'Agregar'}</span>
              {product.stock > 0 && <span aria-hidden="true">＋</span>}
            </button>
          </div>
        </div>
      </li>)}
    </ul>
  </section>
}
export default SuggestedProducts
