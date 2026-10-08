const VinylGallery = ({ vinyl }) => (
  <section className="detail-gallery">
    <div className="gallery-number">0{String(vinyl.id).slice(-1)}</div>
    <img src={vinyl.image} alt={vinyl.name} />
    <p>EDICIÓN ANALÓGICA · {vinyl.year}</p>
  </section>
)
export default VinylGallery
