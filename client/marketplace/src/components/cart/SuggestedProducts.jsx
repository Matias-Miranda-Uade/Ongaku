const SuggestedProducts = ({ products, onAdd }) => {
    if (products.length === 0) return null

    return (
        <>
        <h2>También te puede interesar</h2>
        <ul>
            {
                products.map((product) => (
                    <li key={product.id}>
                        <h3>{product.name}</h3>
                        <p>{product.artist}</p>
                        <p>${product.price.toLocaleString('es-AR')}</p>
                        <button onClick={() => onAdd(product)} disabled={product.stock <= 0}>
                            {product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
                        </button>
                    </li>
                ))
            }
        </ul>
        </>
    )
}

export default SuggestedProducts
