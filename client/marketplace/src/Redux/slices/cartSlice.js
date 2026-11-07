import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrder } from './ordersSlice.js';
import { http, normalizeCart, readData } from '../../services/api.js';

const initialState = {
  items: [],
  ownerId: null,
  loading: false,
  error: ''
};

export const syncCart = createAsyncThunk('cart/syncCart', async (userId, { getState }) => {
  const cart = getState().cart;
  const guestItems = cart.ownerId == null ? cart.items : [];
  const { data: cartData } = await http.get('/carts');
  let serverCart = normalizeCart(readData(cartData));
  for (const item of guestItems) {
    const { data } = await http.post('/carts/items', {
      vinylId: item.id,
      quantity: item.quantity
    });
    serverCart = normalizeCart(readData(data));
  }
  return { items: serverCart.items, ownerId: userId };
});

export const addItem = createAsyncThunk('cart/addItem', async ({ product, quantity = 1 }, { getState }) => {
  const cart = getState().cart;
  const ownerId = cart.ownerId;
  if (product.stock <= 0) {
    return { items: cart.items, ownerId };
  }
  if (ownerId !== null) {
    const { data } = await http.post('/carts/items', {
      vinylId: product.id,
      quantity
    });
    const serverCart = normalizeCart(readData(data));
    return { items: serverCart.items, ownerId };
  }
  const existing = cart.items.find(item => String(item.id) === String(product.id));
  const items = existing
    ? cart.items.map(item => String(item.id) === String(product.id)
      ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
      : item)
    : [...cart.items, { ...product, quantity: Math.min(quantity, product.stock) }];
  return { items, ownerId };
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ id, quantity }, { getState }) => {
  const cart = getState().cart;
  const ownerId = cart.ownerId;
  if (ownerId !== null) {
    const { data } = await http.patch(`/carts/items/${id}`, { quantity });
    const serverCart = normalizeCart(readData(data));
    return { items: serverCart.items, ownerId };
  }
  const items = cart.items.map(item => String(item.id) === String(id)
    ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
    : item);
  return { items, ownerId };
});

export const removeItem = createAsyncThunk('cart/removeItem', async (id, { getState }) => {
  const cart = getState().cart;
  const ownerId = cart.ownerId;
  if (ownerId !== null) {
    const { data } = await http.delete(`/carts/items/${id}`);
    const serverCart = normalizeCart(readData(data));
    return { items: serverCart.items, ownerId };
  }
  return { items: cart.items.filter(item => String(item.id) !== String(id)), ownerId };
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { getState }) => {
  const ownerId = getState().cart.ownerId;
  if (ownerId !== null) {
    const { data } = await http.delete('/carts/items');
    const serverCart = normalizeCart(data);
    return { items: serverCart.items, ownerId };
  }
  return { items: [], ownerId };
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(syncCart.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.ownerId = action.payload.ownerId;
        state.loading = false;
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addItem.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.ownerId = action.payload.ownerId;
        state.loading = false;
      })
      .addCase(addItem.rejected, state => {
        state.loading = false;
      })
      .addCase(updateQuantity.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.ownerId = action.payload.ownerId;
        state.loading = false;
      })
      .addCase(updateQuantity.rejected, state => {
        state.loading = false;
      })
      .addCase(removeItem.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.ownerId = action.payload.ownerId;
        state.loading = false;
      })
      .addCase(removeItem.rejected, state => {
        state.loading = false;
      })
      .addCase(clearCart.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.ownerId = action.payload.ownerId;
        state.loading = false;
      })
      .addCase(clearCart.rejected, state => {
        state.loading = false;
      })
      .addCase(createOrder.fulfilled, state => {
        state.items = [];
        state.error = '';
      });
  }
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;
