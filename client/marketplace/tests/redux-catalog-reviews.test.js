import assert from 'node:assert/strict';
import { after, beforeEach, test } from 'node:test';
import { configureStore } from '@reduxjs/toolkit';
import { http } from '../src/services/api.js';
import catalog, { selectFilteredVinyls, selectVinyls } from '../src/Redux/slices/catalogSlice.js';
import reviews, { resetReviews, setReviewOwner, selectMyReviews, selectEligibility, selectReviewData } from '../src/Redux/slices/reviewsSlice.js';
import { fetchVinyls, fetchVinylById } from '../src/Redux/actions/catalogActions.js';
import { createReview, updateReview, deleteReview, fetchMyReviews, fetchReviews, fetchReviewEligibility } from '../src/Redux/actions/reviewsActions.js';

const originalAdapter = http.defaults.adapter;
const originalWindow = globalThis.window;
let store, calls, routes;
const filters = { search: '', stock: 'all', sort: 'featured' };
const vinyl = { id: 7, name: 'Kind of Blue', artistId: 2, genreId: 3, price: 200, finalPrice: 150, stock: 4, year: 1959 };
const review = { id: 40, vinylId: 7, userId: 1, score: 4, comment: 'Muy bueno' };
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};
const response = (data, status = 200) => ({ data: status >= 400 ? data : { data }, status, statusText: '', headers: {}, config: {}, request: {} });

beforeEach(() => {
  store = configureStore({ reducer: { catalog, reviews } });
  calls = [];
  routes = {
    'GET /artists': [{ id: 2, name: 'Miles Davis' }],
    'GET /genres': [{ id: 3, name: 'Jazz' }],
    'GET /categories': [],
    'GET /vinyls': [vinyl],
    'GET /vinyls/7': vinyl,
  };
  globalThis.window = { localStorage: { getItem: () => 'test-session' } };
  http.defaults.adapter = config => {
    const key = `${config.method.toUpperCase()} ${config.url}`;
    calls.push({ key, data: config.data });
    assert.ok(Object.hasOwn(routes, key), `Solicitud inesperada: ${key}`);
    const value = typeof routes[key] === 'function' ? routes[key](config) : routes[key];
    return Promise.resolve(value).then(data => data && data.status ? data : response(data));
  };
});

after(() => {
  http.defaults.adapter = originalAdapter;
  if (originalWindow === undefined) delete globalThis.window;
  else globalThis.window = originalWindow;
});

test('catálogo comparte listado/detalle, deduplica GET y conserva filtros sin mutar entidades', async () => {
  const first = store.dispatch(fetchVinyls());
  const duplicate = await store.dispatch(fetchVinyls());
  assert.equal(duplicate.meta.condition, true);
  await first.unwrap();
  await store.dispatch(fetchVinylById({ vinylId: 7 }));
  assert.equal(calls.filter(call => call.key === 'GET /vinyls').length, 1);
  assert.equal(calls.filter(call => call.key === 'GET /vinyls/7').length, 0);
  assert.equal(selectVinyls(store.getState())[0].artistName, 'Miles Davis');
  assert.equal(selectFilteredVinyls(store.getState(), { ...filters, search: 'miles' }, 'jazz').length, 1);
  assert.equal(selectFilteredVinyls(store.getState(), { ...filters, stock: 'unavailable' }).length, 0);
  assert.equal(selectFilteredVinyls(store.getState(), filters, 'rock').length, 0);
  assert.equal(store.getState().catalog.entities[7].stock, 4);
});

test('búsqueda, stock, precios con descuento/cero y año ordenan una copia del catálogo', async () => {
  routes['GET /vinyls'] = [vinyl, { ...vinyl, id: 8, name: 'Otro', stock: 0, finalPrice: 0, year: 2020 }];
  await store.dispatch(fetchVinyls());
  assert.deepEqual(selectFilteredVinyls(store.getState(), { ...filters, sort: 'price-asc' }).map(item => item.id), [8, 7]);
  assert.deepEqual(selectFilteredVinyls(store.getState(), { ...filters, sort: 'price-desc' }).map(item => item.id), [7, 8]);
  assert.deepEqual(selectFilteredVinyls(store.getState(), { ...filters, sort: 'year-desc' }).map(item => item.id), [8, 7]);
  assert.deepEqual(selectFilteredVinyls(store.getState(), { ...filters, stock: 'unavailable' }).map(item => item.id), [8]);
  assert.deepEqual(store.getState().catalog.ids, [7, 8]);
});

test('catálogo permite reintentar errores y renueva su caché vencida', async () => {
  routes['GET /vinyls'] = response({ message: 'No disponible' }, 500);
  await store.dispatch(fetchVinyls());
  assert.equal(store.getState().catalog.list.status, 'failed');
  routes['GET /vinyls'] = [vinyl];
  await store.dispatch(fetchVinyls({ force: true })).unwrap();
  assert.equal(store.getState().catalog.list.error, '');
  const old = store.getState();
  const expired = configureStore({ reducer: { catalog, reviews }, preloadedState: {
    ...old, catalog: { ...old.catalog, list: { ...old.catalog.list, fetchedAt: 0 } }
  } });
  await expired.dispatch(fetchVinyls()).unwrap();
  assert.equal(calls.filter(call => call.key === 'GET /vinyls').length, 3);
});

test('navegar entre detalles conserva respuestas y errores separados por vinilo', async () => {
  const slow = deferred();
  routes['GET /vinyls/7'] = slow.promise;
  routes['GET /vinyls/8'] = response({ message: 'No existe' }, 404);
  const first = store.dispatch(fetchVinylById({ vinylId: 7 }));
  await store.dispatch(fetchVinylById({ vinylId: 8 }));
  slow.resolve(vinyl);
  await first;
  assert.equal(store.getState().catalog.details[7].status, 'succeeded');
  assert.equal(store.getState().catalog.details[8].status, 'failed');
  assert.equal(store.getState().catalog.entities[7].name, vinyl.name);
});

test('detalle y página de reseñas comparten consulta por vinilo y promedio del backend', async () => {
  routes['GET /reviews/vinyl/7'] = { reviews: [review], averageScore: 4, totalReviews: 1 };
  const first = store.dispatch(fetchReviews({ vinylId: 7 }));
  await store.dispatch(fetchReviews({ vinylId: '7' }));
  await first;
  await store.dispatch(fetchReviews({ vinylId: 7 }));
  assert.equal(calls.length, 1);
  const data = selectReviewData(store.getState(), 7);
  assert.equal(data.averageScore, 4);
  assert.equal(data.reviews[0].comment, review.comment);
  assert.equal(selectReviewData(store.getState(), 8).reviews.length, 0);
});

const setupReviews = async () => {
  let current = [];
  routes['GET /reviews'] = () => current;
  routes['GET /reviews/me'] = () => current.filter(item => item.userId === 1);
  routes['GET /reviews/vinyl/7'] = () => ({ reviews: current, totalReviews: current.length,
    averageScore: current.length ? current.reduce((sum, item) => sum + item.score, 0) / current.length : 0 });
  routes['GET /reviews/vinyl/8'] = { reviews: [], totalReviews: 0, averageScore: 0 };
  routes['GET /reviews/vinyl/7/eligibility'] = () => ({ purchased: true, canReview: !current.length, review: current[0] || null });
  routes['POST /reviews'] = config => {
    current = [{ ...review, ...JSON.parse(config.data) }];
    return current[0];
  };
  routes['PATCH /reviews/40'] = config => {
    current = [{ ...current[0], ...JSON.parse(config.data), edited: true }];
    return current[0];
  };
  routes['DELETE /reviews/40'] = () => { current = []; return response(null, 204); };
  store.dispatch(setReviewOwner(1));
  await Promise.all([
    store.dispatch(fetchMyReviews()), store.dispatch(fetchReviews()),
    store.dispatch(fetchReviews({ vinylId: 7 })), store.dispatch(fetchReviews({ vinylId: 8 })),
    store.dispatch(fetchReviewEligibility({ userId: 1, vinylId: 7 }))
  ]);
};

test('crear/editar/eliminar sincroniza estadísticas, mis reseñas y elegibilidad sin recargar otros vinilos', async () => {
  await setupReviews();
  await store.dispatch(createReview({ vinylId: 7, score: 5, comment: 'Excelente' })).unwrap();
  assert.equal(selectReviewData(store.getState(), 7).averageScore, 5);
  assert.equal(selectReviewData(store.getState(), null).totalReviews, 1);
  assert.equal(selectMyReviews(store.getState())[0].score, 5);
  assert.equal(selectEligibility(store.getState(), 1, 7).data.canReview, false);
  await store.dispatch(updateReview({ reviewId: 40, vinylId: 7, score: 2, comment: 'Editada' })).unwrap();
  assert.equal(selectMyReviews(store.getState())[0].comment, 'Editada');
  assert.equal(selectReviewData(store.getState(), 7).averageScore, 2);
  assert.equal(selectEligibility(store.getState(), 1, 7).data.review.score, 2);
  await store.dispatch(deleteReview({ reviewId: 40, vinylId: 7 })).unwrap();
  assert.equal(selectMyReviews(store.getState()).length, 0);
  assert.equal(selectReviewData(store.getState(), 7).totalReviews, 0);
  assert.equal(selectReviewData(store.getState(), null).averageScore, 0);
  assert.equal(selectEligibility(store.getState(), 1, 7).data.canReview, true);
  assert.equal(calls.filter(call => call.key === 'GET /reviews/vinyl/8').length, 1);
});

test('duplicar una publicación en curso no genera dos POST y conserva el envío pendiente', async () => {
  const slow = deferred();
  routes['POST /reviews'] = slow.promise;
  store.dispatch(setReviewOwner(1));
  const first = store.dispatch(createReview({ vinylId: 7, score: 5, comment: 'Mi borrador' }));
  const duplicate = await store.dispatch(createReview({ vinylId: 7, score: 5, comment: 'Mi borrador' }));
  assert.equal(duplicate.meta.condition, true);
  slow.resolve(response({ message: 'Compra no entregada' }, 403));
  await first;
  assert.equal(calls.filter(call => call.key === 'POST /reviews').length, 1);
  assert.match(store.getState().reviews.error, /Compra no entregada/);
});

test('un cambio de usuario descarta elegibilidad y mis reseñas tardías sin borrar las públicas', async () => {
  routes['GET /reviews/vinyl/7'] = { reviews: [review], averageScore: 4, totalReviews: 1 };
  await store.dispatch(fetchReviews({ vinylId: 7 }));
  store.dispatch(setReviewOwner(1));
  const slowMine = deferred(), slowEligibility = deferred();
  routes['GET /reviews/me'] = slowMine.promise;
  routes['GET /reviews/vinyl/7/eligibility'] = slowEligibility.promise;
  const first = store.dispatch(fetchMyReviews());
  const second = store.dispatch(fetchReviewEligibility({ userId: 1, vinylId: 7 }));
  store.dispatch(setReviewOwner(2));
  slowMine.resolve([review]);
  slowEligibility.resolve({ purchased: true, canReview: false, review });
  await Promise.all([first, second]);
  assert.equal(selectMyReviews(store.getState()).length, 0);
  assert.equal(selectEligibility(store.getState(), 1, 7).data, null);
  assert.equal(selectReviewData(store.getState(), 7).reviews.length, 1);
  store.dispatch(resetReviews());
  assert.equal(selectReviewData(store.getState(), 7).reviews.length, 1);
});

test('errores al editar/borrar conservan la reseña y su mensaje de permisos', async () => {
  await setupReviews();
  await store.dispatch(createReview({ vinylId: 7, score: 5, comment: 'Original' }));
  routes['PATCH /reviews/40'] = response({ message: 'Sin permisos' }, 403);
  await assert.rejects(store.dispatch(updateReview({ reviewId: 40, vinylId: 7, score: 1, comment: 'Cambio' })).unwrap(), /Sin permisos/);
  routes['DELETE /reviews/40'] = response({ message: 'Sin permisos' }, 403);
  await store.dispatch(deleteReview({ reviewId: 40, vinylId: 7 }));
  assert.equal(selectReviewData(store.getState(), 7).reviews[0].comment, 'Original');
  assert.match(store.getState().reviews.mutations[40].error, /Sin permisos/);
});

test('recargas fallidas no presentan como fallida una publicación confirmada', async () => {
  await setupReviews();
  routes['GET /reviews'] = response({ message: 'Recarga no disponible' }, 500);
  routes['GET /reviews/vinyl/7'] = response({ message: 'Recarga no disponible' }, 500);
  const result = await store.dispatch(createReview({ vinylId: 7, score: 5, comment: 'Guardada' })).unwrap();
  assert.equal(result.comment, 'Guardada');
  assert.equal(selectMyReviews(store.getState())[0].comment, 'Guardada');
  assert.equal(selectReviewData(store.getState(), 7).status, 'failed');
  assert.match(selectReviewData(store.getState(), 7).error, /Recarga no disponible/);
});

test('una respuesta antigua no pisa la consulta renovada después de crear una reseña', async () => {
  await setupReviews();
  const slow = deferred();
  routes['GET /reviews/vinyl/7'] = slow.promise;
  const oldRequest = store.dispatch(fetchReviews({ vinylId: 7, force: true }));
  await new Promise(resolve => setImmediate(resolve));
  routes['GET /reviews/vinyl/7'] = { reviews: [{ ...review, score: 5, comment: 'Nueva' }], totalReviews: 1, averageScore: 5 };
  await store.dispatch(createReview({ vinylId: 7, score: 5, comment: 'Nueva' }));
  slow.resolve({ reviews: [], totalReviews: 0, averageScore: 0 });
  await oldRequest;
  assert.equal(selectReviewData(store.getState(), 7).reviews[0].comment, 'Nueva');
  assert.equal(selectReviewData(store.getState(), 7).totalReviews, 1);
});

test('renovar el catálogo elimina del detalle los títulos que dejaron de publicarse', async () => {
  await store.dispatch(fetchVinyls());
  routes['GET /vinyls'] = [];
  await store.dispatch(fetchVinyls({ force: true }));
  assert.deepEqual(selectVinyls(store.getState()), []);
  assert.equal(store.getState().catalog.entities[7], undefined);
  assert.equal(store.getState().catalog.details[7], undefined);
});

test('editar una reseña mantiene el orden de publicación devuelto por el backend', async () => {
  await setupReviews();
  await store.dispatch(createReview({ vinylId: 7, score: 4, comment: 'Anterior' }));
  const newer = { ...review, id: 41, userId: 2, score: 3, comment: 'Más reciente' };
  const updated = { ...review, score: 5, comment: 'Editada' };
  routes['GET /reviews'] = [newer, updated];
  routes['GET /reviews/vinyl/7'] = { reviews: [newer, updated], totalReviews: 2, averageScore: 4 };
  routes['PATCH /reviews/40'] = updated;
  await store.dispatch(updateReview({ reviewId: 40, vinylId: 7, score: 5, comment: 'Editada' }));
  assert.deepEqual(selectReviewData(store.getState(), 7).reviews.map(item => item.id), [41, 40]);
});

test('una publicación terminada después de cerrar sesión no repuebla los datos privados', async () => {
  store.dispatch(setReviewOwner(1));
  const slow = deferred();
  routes['POST /reviews'] = slow.promise;
  const writing = store.dispatch(createReview({ vinylId: 7, score: 4, comment: 'Mi opinión' }));
  await new Promise(resolve => setImmediate(resolve));
  store.dispatch(resetReviews());
  slow.resolve(review);
  await writing;
  assert.equal(selectMyReviews(store.getState()).length, 0);
  assert.equal(store.getState().reviews.submittingVinylId, null);
  assert.deepEqual(store.getState().reviews.eligibility, {});
});
