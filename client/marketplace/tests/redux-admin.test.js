import assert from 'node:assert/strict';
import { after, beforeEach, test } from 'node:test';
import { configureStore } from '@reduxjs/toolkit';
import { http } from '../src/services/api.js';
import catalog, { fetchVinyls } from '../src/Redux/slices/catalogSlice.js';
import { logout } from '../src/Redux/slices/authSlice.js';
import adminCatalog, {
  adjustAdminVinylStock, deleteAdminArtist, deleteAdminCategory, deleteAdminGenre, deleteAdminVinyl, fetchAdminLookups, fetchAdminVinylById, fetchAdminVinyls,
  saveAdminVinyl, selectAdminVinylDetail, selectAdminVinylRows, selectAdminVinyls, selectBusyVinylIds,
  selectInventoryRows, selectInventoryTotals, selectUsedPreviewIds, setAdminVinylEnabled
} from '../src/Redux/slices/adminCatalogSlice.js';
import adminOrders, {
  fetchAdminOrders, fetchDashboardSummary, selectAdminOrders, selectDashboardSummary, updateAdminOrderStatus
} from '../src/Redux/slices/adminOrdersSlice.js';

const originalAdapter = http.defaults.adapter;
const originalWindow = globalThis.window;
let store, calls, routes;
const vinyl = { id: 7, name: 'Kind of Blue', artistId: 2, genreIds: [3], categoryId: 1, price: 200, finalPrice: 150, stock: 2, enabled: true, audioPreviewId: 9 };
const other = { id: 8, name: 'Abbey Road', artistId: 5, genreIds: [], categoryId: 1, price: 300, stock: 0, enabled: false };
const filters = { search: '', genreId: '', categoryId: '', stock: 'all', visibility: 'all' };
const sort = { key: 'name', direction: 'asc' };
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};
const response = (data, status = 200) => ({ data: status >= 400 ? data : { data }, status, statusText: '', headers: {}, config: {}, request: {} });
const count = key => calls.filter(call => call.key === key).length;

beforeEach(() => {
  store = configureStore({ reducer: { catalog, adminCatalog, adminOrders } });
  calls = [];
  routes = {
    'GET /admin/vinyls': [vinyl, other],
    'GET /admin/vinyls/7': vinyl,
    'GET /artists': [{ id: 2, name: 'Miles Davis' }, { id: 5, name: 'The Beatles' }],
    'GET /genres': [{ id: 3, name: 'Jazz' }],
    'GET /categories': [{ id: 1, description: 'Clásicos' }],
    'GET /orders': [
      { id: 1, createdAt: '2026-01-01T10:00:00', orderStatus: { name: 'PENDIENTE' }, total: 100 },
      { id: 2, createdAt: '2026-02-01T10:00:00', orderStatus: { name: 'PAGADA' }, total: 200 }
    ],
    'GET /dashboard': { totalOrders: 2, pendingOrders: 1 }
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

test('admin: listado cacheado, filas con nombres resueltos, filtros y totales derivados', async () => {
  await Promise.all([store.dispatch(fetchAdminVinyls()), store.dispatch(fetchAdminLookups())]);
  await store.dispatch(fetchAdminVinyls());
  assert.equal(count('GET /admin/vinyls'), 1);
  await store.dispatch(fetchAdminVinyls({ force: true }));
  assert.equal(count('GET /admin/vinyls'), 2);

  const rows = selectAdminVinylRows(store.getState());
  assert.equal(rows.find(row => row.id === 7).artistName, 'Miles Davis');
  assert.equal(rows.find(row => row.id === 7).genreName, 'Jazz');
  assert.equal(rows.find(row => row.id === 8).finalPrice, 300);
  assert.deepEqual(selectInventoryRows(store.getState(), { ...filters, search: 'beatles' }, sort).map(row => row.id), [8]);
  assert.deepEqual(selectInventoryRows(store.getState(), { ...filters, stock: 'low' }, sort).map(row => row.id), [7]);
  assert.deepEqual(selectInventoryRows(store.getState(), filters, { key: 'price', direction: 'desc' }).map(row => row.id), [8, 7]);
  assert.deepEqual(selectInventoryTotals(store.getState()), { titles: 2, units: 2, out: 1, low: 1, published: 1 });
  assert.ok(selectUsedPreviewIds(store.getState()).has('9'));
});

test('admin: una recarga idéntica conserva la referencia y una respuesta vieja no pisa una escritura', async () => {
  await store.dispatch(fetchAdminVinyls());
  const before = selectAdminVinyls(store.getState())[0];
  await store.dispatch(fetchAdminVinyls({ force: true }));
  assert.equal(selectAdminVinyls(store.getState())[0], before);

  const slowList = deferred();
  routes['GET /admin/vinyls'] = () => slowList.promise;
  routes['PATCH /admin/vinyls/7/enabled?enabled=false'] = { ...vinyl, enabled: false };
  const reload = store.dispatch(fetchAdminVinyls({ force: true }));
  const hide = store.dispatch(setAdminVinylEnabled({ vinylId: 7, enabled: false }));
  assert.ok(selectBusyVinylIds(store.getState()).has(7));
  await hide;
  slowList.resolve([vinyl, other]);
  await reload;
  assert.equal(store.getState().adminCatalog.entities[7].enabled, false);
  assert.equal(selectBusyVinylIds(store.getState()).size, 0);
});

test('admin: stock, borrado con conflicto y borrado exitoso', async () => {
  await store.dispatch(fetchAdminVinyls());
  routes['PATCH /admin/vinyls/7/stock?quantity=3'] = { ...vinyl, stock: 5 };
  await store.dispatch(adjustAdminVinylStock({ vinylId: 7, quantity: 3 })).unwrap();
  assert.equal(store.getState().adminCatalog.entities[7].stock, 5);

  routes['DELETE /admin/vinyls/7'] = response({ message: 'El vinilo tiene órdenes' }, 409);
  await assert.rejects(store.dispatch(deleteAdminVinyl({ vinylId: 7 })).unwrap(), error => error.isConflict === true);
  assert.ok(store.getState().adminCatalog.entities[7]);

  routes['DELETE /admin/vinyls/8'] = response(null, 204);
  await store.dispatch(deleteAdminVinyl({ vinylId: 8 })).unwrap();
  assert.deepEqual(selectAdminVinyls(store.getState()).map(item => item.id), [7]);
});

test('admin: alta ajusta la publicación, se suma al listado y renueva la tienda ya cargada', async () => {
  routes['GET /vinyls'] = [vinyl];
  await Promise.all([store.dispatch(fetchVinyls()), store.dispatch(fetchAdminVinyls())]);
  const created = { id: 20, name: 'Nuevo', stock: 1, enabled: true };
  routes['POST /admin/vinyls'] = created;
  routes['PATCH /admin/vinyls/20/enabled?enabled=false'] = { ...created, enabled: false };
  const saved = await store.dispatch(saveAdminVinyl({ payload: { name: 'Nuevo' }, enabled: false })).unwrap();
  assert.equal(saved.enabled, false);
  assert.equal(selectAdminVinyls(store.getState())[0].id, 20);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(count('GET /vinyls'), 2);

  routes['POST /admin/vinyls'] = response({ message: 'Datos inválidos', errors: ['name: no puede estar vacío'] }, 400);
  await assert.rejects(store.dispatch(saveAdminVinyl({ payload: {}, enabled: true })).unwrap(),
    error => error.fieldErrors.name === 'no puede estar vacío');
});

test('admin: detalle con 404 y borrar artista, género o categoría conserva los vinilos', async () => {
  routes['GET /admin/vinyls/99'] = response({ message: 'No existe' }, 404);
  await store.dispatch(fetchAdminVinylById({ vinylId: '99' }));
  assert.equal(selectAdminVinylDetail(store.getState(), '99').notFound, true);
  await store.dispatch(fetchAdminVinylById({ vinylId: '7' }));
  assert.equal(selectAdminVinylDetail(store.getState(), '7').vinyl.name, 'Kind of Blue');

  await store.dispatch(fetchAdminLookups());
  routes['DELETE /artists/2'] = response(null, 204);
  await store.dispatch(deleteAdminArtist({ artistId: 2 })).unwrap();
  assert.equal(store.getState().adminCatalog.entities[7].artistId, null);
  assert.ok(!store.getState().adminCatalog.lookups.artists.some(artist => artist.id === 2));

  routes['GET /admin/vinyls'] = [{ ...vinyl, genreId: 3, genreIds: [3, 4] }];
  await store.dispatch(fetchAdminVinyls({ force: true }));
  routes['DELETE /genres/3'] = response(null, 204);
  await store.dispatch(deleteAdminGenre({ genreId: 3 })).unwrap();
  assert.deepEqual(store.getState().adminCatalog.entities[7].genreIds, [4]);
  assert.equal(store.getState().adminCatalog.entities[7].genreId, 4);
  assert.ok(!store.getState().adminCatalog.lookups.genres.some(genre => genre.id === 3));

  routes['DELETE /categories/1'] = response(null, 204);
  await store.dispatch(deleteAdminCategory({ categoryId: 1 })).unwrap();
  assert.equal(store.getState().adminCatalog.entities[7].categoryId, null);
  assert.equal(store.getState().adminCatalog.lookups.categories.length, 0);
});

test('admin: órdenes ordenadas, cambio de estado con resumen renovado y limpieza al cerrar sesión', async () => {
  await Promise.all([store.dispatch(fetchAdminOrders()), store.dispatch(fetchDashboardSummary())]);
  assert.deepEqual(selectAdminOrders(store.getState()).map(order => order.id), [2, 1]);

  routes['PATCH /orders/1/status'] = { id: 1, total: 100 };
  routes['GET /dashboard'] = { totalOrders: 2, pendingOrders: 0 };
  await store.dispatch(updateAdminOrderStatus({ orderId: 1, status: 'PAGADA' })).unwrap();
  assert.equal(store.getState().adminOrders.entities[1].orderStatus.name, 'PAGADA');
  assert.equal(selectDashboardSummary(store.getState()).data.pendingOrders, 0);

  await store.dispatch(fetchAdminVinyls());
  store.dispatch({ type: logout.pending.type, meta: { requestId: 'x' } });
  assert.equal(selectAdminOrders(store.getState()).length, 0);
  assert.equal(selectAdminVinyls(store.getState()).length, 0);
  assert.equal(store.getState().adminOrders.summary.data, null);
});
