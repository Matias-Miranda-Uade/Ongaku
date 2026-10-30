import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  addCartItem,
  clearServerCart,
  getCart,
  getVinyls,
  removeCartItem,
  updateCartItem
} from '../../services/api';

const getMessage = error => error?.message ?? String(error);
const sameId = (left, right) => String(left) === String(right);

export const syncCart = createAsyncThunk('cart/sync', async (userId, { getState, rejectWithValue }) => {
  const guestItems = getState().cart.syncGuestItems;
  try {
    let cart = await getCart();
    // Cada alta usa el carrito devuelto por la anterior para conservar el orden de fusión.
    for (const item of guestItems) {
      cart = await addCartItem(item.id, item.quantity);
    }
    return { items: cart.items, ownerId: userId };
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
}, {
  condition: (userId, { getState }) => {
    const cart = getState().cart;
    const alreadySyncing = sameId(cart.syncTargetId, userId) && cart.status === 'loading';
    const alreadyLoaded = sameId(cart.ownerId, userId) && cart.status === 'succeeded';
    return !alreadySyncing && !alreadyLoaded;
  }
});

export const addItem = createAsyncThunk('cart/addItem', async ({ product, quantity = 1 }, { getState, rejectWithValue }) => {
  const cart = getState().cart;
  const ownerId = cart.ownerId;
  try {
    if (product.stock <= 0) return { items: cart.items, ownerId };
    if (ownerId !== null) {
      const result = await addCartItem(product.id, quantity);
      return { items: result.items, ownerId };
    }
    const existing = cart.items.find(item => sameId(item.id, product.id));
    const items = existing
      ? cart.items.map(item => sameId(item.id, product.id) ? {
        ...item,
        quantity: Math.min(item.quantity + quantity, item.stock)
      } : item)
      : [...cart.items, { ...product, quantity: Math.min(quantity, product.stock) }];
    return { items, ownerId };
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ id, quantity }, { getState, rejectWithValue }) => {
  const cart = getState().cart;
  const ownerId = cart.ownerId;
  try {
    if (ownerId !== null) {
      const result = await updateCartItem(id, quantity);
      return { items: result.items, ownerId };
    }
    const items = cart.items.map(item => sameId(item.id, id) ? {
      ...item,
      quantity: Math.max(1, Math.min(quantity, item.stock))
    } : item);
    return { items, ownerId };
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
});

export const removeItem = createAsyncThunk('cart/removeItem', async (id, { getState, rejectWithValue }) => {
  const cart = getState().cart;
  const ownerId = cart.ownerId;
  try {
    if (ownerId !== null) {
      const result = await removeCartItem(id);
      return { items: result.items, ownerId };
    }
    return { items: cart.items.filter(item => !sameId(item.id, id)), ownerId };
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { getState, rejectWithValue }) => {
  const ownerId = getState().cart.ownerId;
  try {
    if (ownerId !== null) {
      const result = await clearServerCart();
      return { items: result.items, ownerId };
    }
    return { items: [], ownerId };
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
});

export const fetchSuggestions = createAsyncThunk('cart/fetchSuggestions', async (_, { rejectWithValue }) => {
  try {
    const products = await getVinyls();
    return products.map(product => ({
      ...product,
      artist: product.artistName,
      price: product.finalPrice ?? product.price
    }));
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
}, {
  condition: (_, { getState }) => !['loading', 'succeeded'].includes(getState().cart.suggestions.status)
});
