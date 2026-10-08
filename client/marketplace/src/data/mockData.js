// Datos de prueba. Se reemplazan por los del back cuando se conecte.

export const user = {
    id: 1,
    firstName: 'Usuario',
    lastName: 'Demo',
    email: 'usuario.demo@mail.com',
}

export const products = [
  {
    id: 1,
    name: 'Through the Looking Glass',
    artist: 'Midori Ensemble',
    artistName: 'Midori Ensemble',
    description: 'Una edición seleccionada para escuchar sin apuro: textura analógica, arte cuidado y una presencia física que vuelve especial cada reproducción.',
    price: 42000,
    originalPrice: 48000,
    discountPercentage: 13,
    discountAmount: 6000,
    finalPrice: 42000,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&w=1000&q=80',
    categoryId: 1,
    artistId: 1,
    genreId: 1,
    audioPreviewId: 1,
    year: 2024,
    categoryDescription: 'Edición especial',
    genreName: 'Jazz'
  },
  {
    id: 2,
    name: 'Night Architecture',
    artist: 'Kuroi',
    artistName: 'Kuroi',
    description: 'Sintetizadores, espacios nocturnos y una masterización cálida pensada para vinilo.',
    price: 36500,
    originalPrice: 36500,
    discountPercentage: 0,
    discountAmount: 0,
    finalPrice: 36500,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=1000&q=80',
    categoryId: 2,
    artistId: 2,
    genreId: 2,
    audioPreviewId: 2,
    year: 2022,
    categoryDescription: 'Importado',
    genreName: 'Electronic'
  },
  {
    id: 3,
    name: 'Quiet Motion',
    artist: 'Aoi Fields',
    artistName: 'Aoi Fields',
    description: 'Composiciones minimalistas, silencios amplios y una edición de tirada corta.',
    price: 29800,
    originalPrice: 34000,
    discountPercentage: 12,
    discountAmount: 4200,
    finalPrice: 29800,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&w=900&q=70',
    categoryId: 1,
    artistId: 3,
    genreId: 3,
    audioPreviewId: null,
    year: 2021,
    categoryDescription: 'Colección',
    genreName: 'Ambient'
  },
  {
    id: 4,
    name: 'Sakura Sessions',
    artist: 'Hana Trio',
    artistName: 'Hana Trio',
    description: 'Grabación en vivo con arreglos acústicos y una mezcla íntima.',
    price: 39000,
    originalPrice: 39000,
    discountPercentage: 0,
    discountAmount: 0,
    finalPrice: 39000,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=1000&q=80',
    categoryId: 3,
    artistId: 4,
    genreId: 4,
    audioPreviewId: 3,
    year: 2023,
    categoryDescription: 'Live',
    genreName: 'Acoustic'
  },
  {
    id: 5,
    name: 'Blue Transit',
    artist: 'Sora Unit',
    artistName: 'Sora Unit',
    description: 'Bajos profundos y grooves de ciudad en una edición de 180 gramos.',
    price: 44500,
    originalPrice: 44500,
    discountPercentage: 0,
    discountAmount: 0,
    finalPrice: 44500,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1000&q=80',
    categoryId: 2,
    artistId: 5,
    genreId: 1,
    audioPreviewId: null,
    year: 2020,
    categoryDescription: 'Reedición',
    genreName: 'Jazz'
  },
  {
    id: 6,
    name: 'After Rain',
    artist: 'Nami',
    artistName: 'Nami',
    description: 'Texturas suaves, guitarras limpias y canciones para escuchar de principio a fin.',
    price: 31800,
    originalPrice: 35000,
    discountPercentage: 9,
    discountAmount: 3200,
    finalPrice: 31800,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?auto=format&fit=crop&w=1000&q=80',
    categoryId: 3,
    artistId: 6,
    genreId: 5,
    audioPreviewId: null,
    year: 2024,
    categoryDescription: 'Novedad',
    genreName: 'Indie'
  }
]

export const mockVinyls = products

export const mockReviews = [
  { id: 1, comment: 'Suena increíble. La edición se siente muy cuidada y el prensado llegó impecable.', score: 5, userId: 1, userName: 'Micaela', vinylId: 1, vinylName: 'Through the Looking Glass', createdAt: '2026-09-28T18:10:00', edited: false },
  { id: 2, comment: 'Muy buen disco y excelente presentación. El audio tiene mucha presencia.', score: 4, userId: 2, userName: 'Tomás', vinylId: 1, vinylName: 'Through the Looking Glass', createdAt: '2026-09-22T11:25:00', edited: false },
  { id: 3, comment: 'Me gustó la selección y el envío fue rápido. Volvería a comprar.', score: 5, userId: 3, userName: 'Juana', vinylId: 4, vinylName: 'Sakura Sessions', createdAt: '2026-09-18T08:40:00', edited: true },
  { id: 4, comment: 'El arte es hermoso. Esperaba un poco más de graves, pero la edición está muy bien.', score: 4, userId: 4, userName: 'Lautaro', vinylId: 2, vinylName: 'Night Architecture', createdAt: '2026-09-12T19:00:00', edited: false }
]

export const mockAudio = {
  1: { id: 1, url: '', durationSeconds: 30 },
  2: { id: 2, url: '', durationSeconds: 28 },
  3: { id: 3, url: '', durationSeconds: 32 }
}

export const addresses = [
    { id: 1, street: 'Av. Corrientes 1234', city: 'CABA', province: 'Buenos Aires', zipCode: 'C1043', isDefault: true },
    { id: 2, street: 'San Martín 567', city: 'Rosario', province: 'Santa Fe', zipCode: 'S2000', isDefault: false },
]

export const orders = [
    {
        id: 101,
        createdAt: '2026-09-02T14:30:00',
        status: 'ENTREGADA',
        items: [
            { vinylId: 1, name: 'Through the Looking Glass', artistName: 'Midori Ensemble', unitPrice: 42000, quantity: 1, review: null },
            { vinylId: 2, name: 'Night Architecture', artistName: 'Kuroi', unitPrice: 36500, quantity: 2, review: null },
        ],
        total: 115000,
        shippingAddress: addresses[0],
        payment: { method: 'TARJETA', amount: 115000, status: 'APROBADO' },
        trackingCode: 'AR-000101',
    },
    {
        id: 102,
        createdAt: '2026-09-25T10:15:00',
        status: 'ENVIADA',
        items: [
            { vinylId: 4, name: 'Sakura Sessions', artistName: 'Hana Trio', unitPrice: 39000, quantity: 1, review: null },
        ],
        total: 39000,
        shippingAddress: addresses[1],
        payment: { method: 'TARJETA', amount: 39000, status: 'APROBADO' },
        trackingCode: 'AR-000102',
    },
    {
        id: 103,
        createdAt: '2026-10-02T18:45:00',
        status: 'PENDIENTE',
        items: [
            { vinylId: 5, name: 'Blue Transit', artistName: 'Sora Unit', unitPrice: 44500, quantity: 2, review: null },
        ],
        total: 89000,
        shippingAddress: addresses[0],
        payment: null,
        trackingCode: null,
    },
    {
        id: 104,
        createdAt: '2026-08-14T09:00:00',
        status: 'CANCELADA',
        items: [
            { vinylId: 3, name: 'Quiet Motion', artistName: 'Aoi Fields', unitPrice: 29800, quantity: 1, review: null },
        ],
        total: 29800,
        shippingAddress: addresses[0],
        payment: null,
        trackingCode: null,
    },
]
