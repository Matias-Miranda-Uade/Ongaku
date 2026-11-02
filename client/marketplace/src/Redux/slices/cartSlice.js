import { createSlice } from '@reduxjs/toolkit';
import { createOrder } from '../actions/ordersActions';
import {
  addItem,
  clearCart,
  fetchSuggestions,
  removeItem,
  syncCart,
  updateQuantity
} from '../actions/cartActions';

const initialState = {
  items: [],
  ownerId: null,
  syncRequestId: null,
  syncTargetId: null,
  syncPreviousOwnerId: null,
  syncGuestItems: [],
  checkoutOwnerId: null,
  checkoutRequestId: null,
  status: 'idle',
  error: '',
  pendingIds: [],
  requestOwners: {},
  lastAddedId: null,
  suggestions: { items: [], status: 'idle', error: '' }
};

const sameId = (left, right) => String(left) === String(right);
const applyCartResult = (state, action) => {
  if (action.payload.ownerId === state.ownerId) state.items = action.payload.items;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart(state) {
      state.items = [];
      state.ownerId = null;
      state.syncRequestId = null;
      state.syncTargetId = null;
      state.syncPreviousOwnerId = null;
      state.syncGuestItems = [];
      state.checkoutOwnerId = null;
      state.checkoutRequestId = null;
      state.status = 'idle';
      state.error = '';
      state.pendingIds = [];
      state.requestOwners = {};
      state.lastAddedId = null;
    },
    clearLastAdded(state) {
      state.lastAddedId = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(syncCart.pending, (state, action) => {
        state.syncRequestId = action.meta.requestId;
        state.syncTargetId = action.meta.arg;
        state.syncPreviousOwnerId = state.ownerId;
        state.syncGuestItems = state.ownerId === null ? state.items : [];
        if (state.ownerId !== null && !sameId(state.ownerId, action.meta.arg)) state.items = [];
        state.ownerId = action.meta.arg;
        state.status = 'loading';
        state.error = '';
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        if (state.syncRequestId !== action.meta.requestId) return;
        state.ownerId = action.payload.ownerId;
        state.syncRequestId = null;
        state.syncTargetId = null;
        state.syncPreviousOwnerId = null;
        state.syncGuestItems = [];
        state.items = action.payload.items;
        state.status = 'succeeded';
      })
      .addCase(syncCart.rejected, (state, action) => {
        if (state.syncRequestId !== action.meta.requestId) return;
        state.syncRequestId = null;
        state.syncTargetId = null;
        if (state.syncPreviousOwnerId === null) state.ownerId = null;
        state.syncPreviousOwnerId = null;
        state.syncGuestItems = [];
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? '';
      })
      .addCase(addItem.pending, (state, action) => {
        const id = action.meta.arg.product.id;
        state.requestOwners[action.meta.requestId] = state.ownerId;
        if (!state.pendingIds.some(item => sameId(item, id))) state.pendingIds.push(id);
        state.lastAddedId = null;
        state.error = '';
      })
      .addCase(addItem.fulfilled, (state, action) => {
        const isCurrent = Object.hasOwn(state.requestOwners, action.meta.requestId);
        delete state.requestOwners[action.meta.requestId];
        if (isCurrent) state.pendingIds = state.pendingIds.filter(id => !sameId(id, action.meta.arg.product.id));
        if (isCurrent && action.payload.ownerId === state.ownerId) {
          state.items = action.payload.items;
          state.lastAddedId = action.meta.arg.product.id;
        }
      })
      .addCase(addItem.rejected, (state, action) => {
        const requestOwner = state.requestOwners[action.meta.requestId];
        const isCurrent = Object.hasOwn(state.requestOwners, action.meta.requestId) && requestOwner === state.ownerId;
        delete state.requestOwners[action.meta.requestId];
        if (isCurrent) state.pendingIds = state.pendingIds.filter(id => !sameId(id, action.meta.arg.product.id));
        if (isCurrent) state.error = action.payload ?? action.error.message ?? '';
      })
      .addCase(updateQuantity.pending, (state, action) => {
        state.requestOwners[action.meta.requestId] = state.ownerId;
        state.error = '';
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const isCurrent = Object.hasOwn(state.requestOwners, action.meta.requestId);
        delete state.requestOwners[action.meta.requestId];
        if (isCurrent) applyCartResult(state, action);
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        const isCurrent = Object.hasOwn(state.requestOwners, action.meta.requestId) && state.requestOwners[action.meta.requestId] === state.ownerId;
        delete state.requestOwners[action.meta.requestId];
        if (isCurrent) state.error = action.payload ?? action.error.message ?? '';
      })
      .addCase(removeItem.pending, (state, action) => {
        state.requestOwners[action.meta.requestId] = state.ownerId;
        state.error = '';
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        const isCurrent = Object.hasOwn(state.requestOwners, action.meta.requestId);
        delete state.requestOwners[action.meta.requestId];
        if (isCurrent) applyCartResult(state, action);
      })
      .addCase(removeItem.rejected, (state, action) => {
        const isCurrent = Object.hasOwn(state.requestOwners, action.meta.requestId) && state.requestOwners[action.meta.requestId] === state.ownerId;
        delete state.requestOwners[action.meta.requestId];
        if (isCurrent) state.error = action.payload ?? action.error.message ?? '';
      })
      .addCase(clearCart.pending, (state, action) => {
        state.requestOwners[action.meta.requestId] = state.ownerId;
        state.error = '';
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        const isCurrent = Object.hasOwn(state.requestOwners, action.meta.requestId);
        delete state.requestOwners[action.meta.requestId];
        if (isCurrent) applyCartResult(state, action);
      })
      .addCase(clearCart.rejected, (state, action) => {
        const isCurrent = Object.hasOwn(state.requestOwners, action.meta.requestId) && state.requestOwners[action.meta.requestId] === state.ownerId;
        delete state.requestOwners[action.meta.requestId];
        if (isCurrent) state.error = action.payload ?? action.error.message ?? '';
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
        state.suggestions.error = action.payload ?? action.error.message ?? '';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        if (state.checkoutRequestId === action.meta.requestId && state.checkoutOwnerId === state.ownerId) {
          state.items = [];
          state.error = '';
        }
        if (state.checkoutRequestId === action.meta.requestId) {
          state.checkoutRequestId = null;
          state.checkoutOwnerId = null;
        }
      })
      .addCase(createOrder.pending, (state, action) => {
        state.checkoutRequestId = action.meta.requestId;
        state.checkoutOwnerId = state.ownerId;
      })
      .addCase(createOrder.rejected, (state, action) => {
        if (state.checkoutRequestId !== action.meta.requestId) return;
        state.checkoutRequestId = null;
        state.checkoutOwnerId = null;
      });
  }
});

export const { resetCart, clearLastAdded } = cartSlice.actions;
export const selectCartItems = state => state.cart.items;
export const selectCartError = state => state.cart.error;
export const selectTotalProducts = state => state.cart.items.length;
export const selectTotalUnits = state => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = state => state.cart.items.reduce((total, item) => total + (item.subtotal ?? item.price * item.quantity), 0);
export const selectIsInCart = id => state => state.cart.items.some(item => sameId(item.id, id));

export default cartSlice.reducer;
