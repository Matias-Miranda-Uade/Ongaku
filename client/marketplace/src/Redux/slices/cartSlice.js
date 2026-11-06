import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrder } from './ordersSlice';
import {
  addCartItem,
  clearServerCart,
  getCart,
  getVinyls,
  removeCartItem,
  updateCartItem
} from '../../services/api';

const sameId = (left, right) => String(left) === String(right);

const initialState = {
  items: [],
  ownerId: null,
  status: 'idle',
  error: '',
  suggestions: { items: [], status: 'idle', error: '' }
};

export const syncCart = createAsyncThunk('cart/syncCart', async (userId, { getState }) => {
  const guestItems = getState().cart.items;
  let serverCart = await getCart();
  for (const item of guestItems) {
    serverCart = await addCartItem(item.id, item.quantity);
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
    const result = await addCartItem(product.id, quantity);
    return { items: result.items, ownerId };
  }
  const existing = cart.items.find(item => sameId(item.id, product.id));
  const items = existing
    ? cart.items.map(item => sameId(item.id, product.id)
      ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
      : item)
    : [...cart.items, { ...product, quantity: Math.min(quantity, product.stock) }];
  return { items, ownerId };
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ id, quantity }, { getState }) => {
  const cart = getState().cart;
  const ownerId = cart.ownerId;
  if (ownerId !== null) {
    const result = await updateCartItem(id, quantity);
    return { items: result.items, ownerId };
  }
  const items = cart.items.map(item => sameId(item.id, id)
    ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
    : item);
  return { items, ownerId };
});

export const removeItem = createAsyncThunk('cart/removeItem', async (id, { getState }) => {
  const cart = getState().cart;
  const ownerId = cart.ownerId;
  if (ownerId !== null) {
    const result = await removeCartItem(id);
    return { items: result.items, ownerId };
  }
  return { items: cart.items.filter(item => !sameId(item.id, id)), ownerId };
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { getState }) => {
  const ownerId = getState().cart.ownerId;
  if (ownerId !== null) {
    const result = await clearServerCart();
    return { items: result.items, ownerId };
  }
  return { items: [], ownerId };
});

export const fetchSuggestions = createAsyncThunk('cart/fetchSuggestions', async () => {
  const products = await getVinyls();
  return products.map(product => ({
    ...product,
    artist: product.artistName,
    price: product.finalPrice ?? product.price
  }));
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart(state) {
      state.items = [];
      state.ownerId = null;
      state.status = 'idle';
      state.error = '';
      state.suggestions = { items: [], status: 'idle', error: '' };
    },
    clearLastAdded(state) {
      state.error = '';
    }
  },
  extraReducers: builder => {
    builder
      .addCase(syncCart.pending, state => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.ownerId = action.payload.ownerId;
        state.items = action.payload.items;
        state.status = 'succeeded';
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.ownerId = action.payload.ownerId;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.ownerId = action.payload.ownerId;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.ownerId = action.payload.ownerId;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.ownerId = action.payload.ownerId;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchSuggestions.pending, state => {
        state.suggestions.status = 'loading';
        state.suggestions.error = '';
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions.items = action.payload;
        state.suggestions.status = 'succeeded';
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.suggestions.status = 'failed';
        state.suggestions.error = action.error.message;
      })
      .addCase(createOrder.fulfilled, state => {
        state.items = [];
      });
  }
});

export const { resetCart, clearLastAdded } = cartSlice.actions;

export default cartSlice.reducer;
