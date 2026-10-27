import assert from 'node:assert/strict'
import { after, beforeEach, test } from 'node:test'
import { createArtist, deleteArtist, createCategory, getCatalogLookups, uploadCover } from '../src/services/adminService.js'
import {
  ApiError, createFavorite, createOrder, createPayment, createReview, deleteAddress, deleteCard, deleteFavorite, deleteReview, getAddresses, getAudioPreview, getFavorites, getOrder, getOrders, getSavedCards, saveAddress, saveCard,
  getReviewEligibility, getReviews, getReviewsByVinyl, getVinylById, getVinyls, request, updateReview, login, logout, getAccessToken,
} from '../src/services/api.js'

const originalFetch = globalThis.fetch
const originalWindow = globalThis.window
let calls
let routes

beforeEach(() => {
  calls = []
  routes = {
    '/artists': [{ id: 2, name: 'Artista real' }],
    '/genres': [{ id: 3, name: 'Jazz' }],
    '/categories': [{ id: 4, description: 'Clásicos' }],
  }
  let token = 'session-token'
  globalThis.window = { localStorage: {
    getItem: () => token,
    setItem: (key, value) => { token = value },
    removeItem: () => { token = null },
  } }
  globalThis.fetch = async (url, options) => {
    calls.push({ url, ...options })
    assert.ok(Object.hasOwn(routes, url), `Solicitud inesperada: ${url}`)
    const route = routes[url]
    if (route instanceof Error) throw route
    if (route instanceof Response) return route
    return Response.json({ success: true, data: route })
  }
})

after(() => {
  globalThis.fetch = originalFetch
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
})

test('iniciar sesión guarda el token y lo utiliza al recuperar el perfil', () => {
  routes['/api/v1/auth/authenticate'] = { accessToken: 'new-session-token' }
  routes['/users/me'] = { id: 1, firstName: 'Test' }
  return login({ email: 'test@example.com', password: 'test-password' }).then((profile) => {
    assert.equal(profile.id, 1)
    assert.equal(getAccessToken(), 'new-session-token')
    assert.equal(calls[1].headers.Authorization, 'Bearer new-session-token')
  })
})

test('si falla la recuperación del perfil se elimina el token recién recibido', () => {
  routes['/api/v1/auth/authenticate'] = { accessToken: 'new-session-token' }
  routes['/users/me'] = Response.json({ message: 'Sesión inválida' }, { status: 401 })
  return assert.rejects(login({ email: 'test@example.com', password: 'test-password' }), (error) => error.status === 401)
    .then(() => assert.equal(getAccessToken(), null))
})

test('cerrar sesión elimina el token aunque el servidor no responda', () => {
  routes['/api/v1/auth/logout'] = new Error('offline')
  return assert.rejects(logout(), (error) => error.status === 0)
    .then(() => assert.equal(getAccessToken(), null))
})

test('crear artistas envía el nombre al backend y devuelve su identificador', async () => {
  routes['/artists'] = { id: 80, name: 'Lana Del Rey' }
  assert.equal((await createArtist('Lana Del Rey')).id, 80)
  assert.equal(calls[0].method, 'POST')
  assert.deepEqual(JSON.parse(calls[0].body), { name: 'Lana Del Rey' })
})

test('eliminar un artista envía DELETE con la sesión y conserva los errores de permisos', () => {
  routes['/artists/80'] = new Response(null, { status: 204 })
  return deleteArtist(80).then((result) => {
    assert.equal(result, null)
    assert.equal(calls[0].method, 'DELETE')
    assert.equal(calls[0].url, '/artists/80')
    assert.equal(calls[0].headers.Authorization, 'Bearer session-token')
    routes['/artists/80'] = Response.json({ message: 'Sin permisos' }, { status: 403 })
    return assert.rejects(deleteArtist(80), (error) => error.isForbidden)
  })
})

test('las categorías se cargan y se crean sin ocultar los errores del servidor', async () => {
  routes['/categories'] = [{ id: 4, description: 'En vivo' }]
  assert.deepEqual((await getCatalogLookups()).categories, routes['/categories'])
  routes['/categories'] = { id: 5, description: 'EP' }
  assert.equal((await createCategory('EP')).description, 'EP')
  assert.deepEqual(JSON.parse(calls.at(-1).body), { description: 'EP' })
  routes['/categories'] = new Error('offline')
  await assert.rejects(getCatalogLookups(), (error) => error.status === 0)
})

test('subir una portada envía el archivo multipart con autenticación y sin forzar JSON', async () => {
  routes['/admin/vinyls/covers'] = { url: '/media/covers/cover.png' }
  const result = await uploadCover(new Blob(['image'], { type: 'image/png' }))
  assert.equal(result.url, '/media/covers/cover.png')
  assert.equal(calls[0].method, 'POST')
  assert.ok(calls[0].body instanceof FormData)
  assert.ok(calls[0].body.get('file') instanceof Blob)
  assert.equal(calls[0].headers['Content-Type'], undefined)
  assert.equal(calls[0].headers.Authorization, 'Bearer session-token')
})

test('el catálogo resuelve nombres y conserva precio final cero y stock agotado', async () => {
  routes['/vinyls'] = [{ id: 1, artistId: 2, genreId: 3, categoryId: 4, finalPrice: 0, price: 100, stock: 0 }]
  const [vinyl] = await getVinyls()
  assert.equal(vinyl.artistName, 'Artista real')
  assert.equal(vinyl.genreName, 'Jazz')
  assert.equal(vinyl.categoryDescription, 'Clásicos')
  assert.equal(vinyl.finalPrice, 0)
  assert.equal(vinyl.stock, 0)
  assert.ok(calls.every((call) => call.headers.Authorization === 'Bearer session-token'))
})

test('un catálogo vacío no se reemplaza por ejemplos', async () => {
  routes['/vinyls'] = []
  assert.deepEqual(await getVinyls(), [])
})

test('una caída del servidor se informa sin devolver vinilos de prueba', async () => {
  routes['/vinyls'] = new Error('offline')
  await assert.rejects(getVinyls(), (error) => error instanceof ApiError && error.status === 0)
})

test('el detalle conserva el error de autenticación del backend', async () => {
  routes['/vinyls/7'] = Response.json({ message: 'Iniciá sesión' }, { status: 401 })
  await assert.rejects(getVinylById(7), (error) => error.isUnauthorized)
})

test('el detalle carga el vinilo solicitado con sus relaciones', async () => {
  routes['/vinyls/7'] = { id: 7, artistId: 2, genreId: 3, categoryId: 4, albumUrl: 'https://music.apple.com/us/album/animals/1065974284' }
  const vinyl = await getVinylById(7)
  assert.equal(vinyl.id, 7)
  assert.equal(vinyl.albumUrl, routes['/vinyls/7'].albumUrl)
  assert.equal(vinyl.artistName, 'Artista real')
})

test('las reseñas usan el filtro y el promedio devuelto por el backend', async () => {
  const reviews = [{ id: 8, vinylId: 7, score: 4 }]
  routes['/reviews?vinylId=7'] = reviews
  routes['/reviews/vinyl/7'] = { reviews, averageScore: 4, totalReviews: 1 }
  assert.deepEqual(await getReviews(7), reviews)
  assert.deepEqual(await getReviewsByVinyl(7), { reviews, averageScore: 4, totalReviews: 1 })
})

test('crear, editar y borrar reseñas envía los métodos y cuerpos correctos', async () => {
  const review = { vinylId: 7, score: 5, comment: 'Excelente' }
  routes['/reviews'] = { id: 8, ...review }
  routes['/reviews/8'] = { id: 8, ...review }
  await createReview(review)
  await updateReview(8, { score: 4, comment: 'Muy bueno' })
  routes['/reviews/8'] = new Response(null, { status: 204 })
  assert.equal(await deleteReview(8), null)
  assert.deepEqual(calls.map((call) => call.method), ['POST', 'PATCH', 'DELETE'])
  assert.deepEqual(JSON.parse(calls[0].body), review)
  assert.deepEqual(JSON.parse(calls[1].body), { score: 4, comment: 'Muy bueno' })
})

test('la API conserva los conflictos y errores de permisos en las reseñas', async () => {
  routes['/reviews'] = Response.json({ message: 'Ya existe una reseña' }, { status: 409 })
  await assert.rejects(createReview({ vinylId: 7, score: 5, comment: 'Bien' }), (error) => error.isConflict)
  routes['/reviews/8'] = Response.json({ message: 'No sos el autor' }, { status: 403 })
  await assert.rejects(updateReview(8, { score: 4, comment: 'Bien' }), (error) => error.isForbidden)
})

test('el audio usa la URL real y comunica los recursos inexistentes', async () => {
  assert.equal(await getAudioPreview(null), null)
  assert.equal(calls.length, 0)
  routes['/audio-previews/3'] = { id: 3, url: '/audio/real.mp3', durationSeconds: 15 }
  assert.equal((await getAudioPreview(3)).url, '/audio/real.mp3')
  routes['/audio-previews/4'] = Response.json({ message: 'No existe' }, { status: 404 })
  await assert.rejects(getAudioPreview(4), (error) => error.isNotFound)
})

test('un error de proxy vacío informa que hay que revisar el backend', async () => {
  routes['/vinyls'] = new Response('', { status: 500 })
  await assert.rejects(request('/vinyls'), (error) => error.status === 500 && /backend/.test(error.message))
})

test('una página HTML no se interpreta como datos válidos de la API', async () => {
  routes['/vinyls'] = new Response('<html>Frontend</html>', { headers: { 'Content-Type': 'text/html' } })
  await assert.rejects(request('/vinyls'), (error) => error.status === 502 && /respuesta inválida/.test(error.message))
})

test('un sobre con data null devuelve null y no el sobre completo', async () => {
  routes['/empty'] = null
  assert.equal(await request('/empty'), null)
})

test('la posibilidad de reseñar se consulta para el usuario autenticado y el vinilo concreto', async () => {
  routes['/reviews/vinyl/7/eligibility'] = { purchased: true, canReview: true, review: null }
  assert.deepEqual(await getReviewEligibility(7), { purchased: true, canReview: true, review: null })
  assert.equal(calls[0].headers.Authorization, 'Bearer session-token')
})

test('pagar envía el total de la orden y no envía un estado aprobado inventado', async () => {
  routes['/payments'] = { id: 10, orderId: 9, amount: 25600, method: 'SIMULADO', status: 'APROBADO' }
  const payment = await createPayment({ orderId: 9, amount: 25600 })
  assert.equal(payment.status, 'APROBADO')
  assert.equal(calls[0].method, 'POST')
  assert.equal(calls[0].headers.Authorization, 'Bearer session-token')
  assert.deepEqual(JSON.parse(calls[0].body), { orderId: 9, amount: 25600, method: 'SIMULADO' })
})

test('las órdenes muestran el pago registrado también después de recargar', async () => {
  const order = { id: 9, orderStatus: { name: 'PAGADA' }, total: 25600, items: [] }
  const payment = { id: 10, orderId: 9, amount: 25600, status: 'APROBADO' }
  routes['/orders'] = [order]
  routes['/orders/9'] = order
  routes['/payments'] = [payment, { id: 11, orderId: 99 }]
  assert.deepEqual((await getOrders())[0].payment, payment)
  assert.deepEqual((await getOrder(9)).payment, payment)
})

test('un pago duplicado conserva el conflicto enviado por el backend', async () => {
  routes['/payments'] = Response.json({ message: 'Orden ya pagada' }, { status: 409 })
  await assert.rejects(createPayment({ orderId: 9, amount: 25600 }), (error) => error.isConflict)
})

test('las direcciones se guardan, editan y seleccionan en el checkout', async () => {
  const address = { street: 'Calle 123', recipient: 'Test', city: 'CABA', province: 'CABA', zipCode: '1000', country: 'Argentina', phone: '1234' }
  routes['/users/me/addresses'] = { id: 5, details: address }
  assert.equal((await saveAddress(address)).id, 5)
  assert.deepEqual(JSON.parse(calls[0].body), address)
  routes['/users/me/addresses/5'] = { id: 5, details: address }
  await saveAddress(address, 5)
  assert.equal(calls[1].method, 'PATCH')
  routes['/users/me/addresses'] = [{ id: 5, details: address }]
  assert.equal((await getAddresses())[0].id, 5)
  routes['/orders'] = { id: 9, items: [], status: 'PENDIENTE' }
  assert.equal((await createOrder()).shippingAddress, undefined)
  assert.equal(calls[3].body, undefined)
  routes['/users/me/addresses/5'] = new Response(null, { status: 204 })
  await deleteAddress(5)
  assert.equal(calls[4].method, 'DELETE')
})

test('los favoritos conservan el id de la relación al recuperar y eliminar', async () => {
  routes['/vinyls'] = [{ id: 7, artistId: 2, genreId: 3, categoryId: 4, price: 100, finalPrice: 80 }]
  routes['/favorites'] = [{ id: 99, vinylId: 7 }]
  const [favorite] = await getFavorites()
  assert.equal(favorite.id, 7)
  assert.equal(favorite.favoriteId, 99)
  assert.equal(favorite.price, 80)
  routes['/favorites'] = { id: 99, vinylId: 7 }
  await createFavorite(7)
  assert.deepEqual(JSON.parse(calls.at(-1).body), { vinylId: 7 })
  routes['/favorites/99'] = new Response(null, { status: 204 })
  await deleteFavorite(99)
  assert.equal(calls.at(-1).url, '/favorites/99')
})

test('crear un favorito solo necesita el id del vinilo autenticado', async () => {
  routes['/favorites'] = { id: 99, vinylId: 7 }
  await createFavorite(7)
  assert.deepEqual(JSON.parse(calls[0].body), { vinylId: 7 })
})

test('el carrito crea la orden sin datos de checkout y el pago envía dirección y tarjeta', async () => {
  const card = { holder: 'Test User', brand: 'VISA', lastFour: '4242', expiryMonth: 12, expiryYear: 2030 }
  routes['/users/me/cards'] = { id: 6, ...card }
  assert.equal((await saveCard(card)).id, 6)
  assert.deepEqual(JSON.parse(calls.at(-1).body), card)
  routes['/users/me/cards'] = [{ id: 6, ...card }]
  assert.equal((await getSavedCards())[0].id, 6)
  routes['/orders'] = { id: 9, items: [], status: 'PENDIENTE' }
  await createOrder()
  assert.equal(calls.at(-1).body, undefined)
  routes['/payments'] = { id: 10, cardBrand: 'VISA', cardLastFour: '4242' }
  await createPayment({ orderId: 9, amount: 100, savedCardId: 6, addressId: 5 })
  assert.deepEqual(JSON.parse(calls.at(-1).body), { orderId: 9, amount: 100, method: 'SIMULADO', savedCardId: 6, addressId: 5 })
  routes['/users/me/cards/6'] = new Response(null, { status: 204 })
  await deleteCard(6)
  assert.equal(calls.at(-1).method, 'DELETE')
})
