import assert from 'node:assert/strict';
import { after, beforeEach, test } from 'node:test';
import { configureStore } from '@reduxjs/toolkit';
import { http } from '../src/services/api.js';
import cart, { addItem, clearCart, removeItem, syncCart, updateQuantity } from '../src/Redux/slices/cartSlice.js';
import orders, { cancelOrder, createOrder, payOrder } from '../src/Redux/slices/ordersSlice.js';

const originalAdapter = http.defaults.adapter;
const originalWindow = globalThis.window;
let calls;
let routes;

const createStore = () => configureStore({ reducer: { cart, orders } });
const getRequestData = config => typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

beforeEach(() => {
  calls = [];
  routes = {};
  globalThis.window = { localStorage: { getItem: () => null } };
  http.defaults.adapter = async config => {
    const method = config.method.toUpperCase();
    const key = `${method} ${config.url}`;
    const data = getRequestData(config);
    calls.push({ key, data });
    assert.ok(Object.hasOwn(routes, key), `Solicitud inesperada: ${key}`);
    const result = typeof routes[key] === 'function' ? routes[key](data) : routes[key];
    return {
      status: 200,
      data: { data: result },
      statusText: '',
      headers: {},
      config,
      request: {}
    };
  };
});

after(() => {
  http.defaults.adapter = originalAdapter;
  if (originalWindow === undefined) delete globalThis.window;
  else globalThis.window = originalWindow;
});

test('el carrito invitado se fusiona al iniciar sesión y permite agregar, cambiar, quitar y vaciar', async () => {
  const store = createStore();
  const product = { id: 1, name: 'Disco', artist: 'Artista', price: 100, stock: 5 };
  await store.dispatch(addItem({ product }));
  assert.equal(store.getState().cart.items[0].quantity, 1);

  let serverItems = [];
  const readCart = () => ({ items: serverItems.map(item => ({ ...item })) });
  routes['GET /carts'] = readCart;
  routes['POST /carts/items'] = data => {
    const existing = serverItems.find(item => item.vinylId === data.vinylId);
    if (existing) existing.quantity += data.quantity;
    else serverItems.push({ vinylId: data.vinylId, quantity: data.quantity, unitPrice: 100, artistName: 'Artista' });
    return readCart();
  };
  routes['PATCH /carts/items/1'] = data => {
    serverItems[0].quantity = data.quantity;
    return readCart();
  };
  routes['DELETE /carts/items/1'] = () => {
    serverItems = [];
    return readCart();
  };
  routes['DELETE /carts/items'] = () => {
    serverItems = [];
    return readCart();
  };

  await store.dispatch(syncCart(22));
  assert.equal(store.getState().cart.ownerId, 22);
  assert.equal(store.getState().cart.items[0].quantity, 1);
  await store.dispatch(addItem({ product }));
  await store.dispatch(updateQuantity({ id: 1, quantity: 4 }));
  assert.equal(store.getState().cart.items[0].quantity, 4);
  await store.dispatch(removeItem(1));
  assert.deepEqual(store.getState().cart.items, []);
  await store.dispatch(addItem({ product }));
  await store.dispatch(clearCart());
  assert.deepEqual(store.getState().cart.items, []);
  assert.equal(calls.filter(call => call.key === 'GET /carts').length, 1);
});

test('crear una orden vacía el carrito sin GET extra y pago/cancelación reemplazan la orden correspondiente', async () => {
  const store = createStore();
  const product = { id: 1, name: 'Disco', artist: 'Artista', price: 100, stock: 5 };
  await store.dispatch(addItem({ product }));
  routes['POST /orders'] = { id: 9, total: 100, status: 'PENDIENTE', items: [] };
  const created = await store.dispatch(createOrder());
  assert.equal(created.payload.id, 9);
  assert.deepEqual(store.getState().cart.items, []);
  assert.equal(calls.some(call => call.key === 'GET /carts' || call.key === 'GET /orders'), false);

  const ordersStore = configureStore({
    reducer: { cart, orders },
    preloadedState: {
      cart: store.getState().cart,
      orders: {
        items: [
          { id: 8, total: 50, status: 'PENDIENTE', items: [] },
          created.payload
        ],
        loading: false,
        error: ''
      }
    }
  });
  routes['POST /payments'] = { id: 17, orderId: 9, amount: 100, status: 'APROBADO' };
  routes['GET /orders/9'] = { id: 9, total: 100, status: 'PAGADA', items: [] };
  const paid = await ordersStore.dispatch(payOrder({ order: created.payload, addressId: 3 }));
  assert.equal(paid.payload.payment.id, 17);
  assert.equal(ordersStore.getState().orders.items.find(order => order.id === 9).status, 'PAGADA');

  routes['PATCH /orders/8/status'] = { id: 8, total: 50, status: 'CANCELADA', items: [] };
  const cancelled = await ordersStore.dispatch(cancelOrder(8));
  assert.equal(cancelled.payload.status, 'CANCELADA');
  assert.equal(ordersStore.getState().orders.items.length, 2);
  assert.equal(ordersStore.getState().orders.items.find(order => order.id === 8).status, 'CANCELADA');
});
