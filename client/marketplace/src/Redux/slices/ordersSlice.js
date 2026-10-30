import { createSlice } from '@reduxjs/toolkit';
import {
  cancelOrder,
  createOrder,
  fetchOrderById,
  fetchOrders,
  payOrder
} from '../actions/ordersActions';

const initialState = {
  items: [],
  status: 'idle',
  fetchRequestId: null,
  error: '',
  detailId: null,
  detailRequestId: null,
  detailError: '',
  detailStatus: 'idle',
  pendingAction: null,
  pendingRequestId: null,
  checkoutError: '',
  actionError: '',
  notice: '',
  statusFilter: 'TODAS',
  trackingOpen: {},
  checkoutForm: {
    addressId: null,
    selectedCardId: null,
    card: { holder: '', number: '', expiry: '', securityCode: '' },
    cardErrors: {}
  }
};

const sameId = (left, right) => String(left) === String(right);
const replaceOrder = (state, order) => {
  const index = state.items.findIndex(item => sameId(item.id, order.id));
  if (index === -1) state.items.unshift(order);
  else state.items[index] = order;
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrders: () => initialState,
    clearOrdersNotice(state) {
      state.notice = '';
    },
    clearCheckoutError(state) {
      state.checkoutError = '';
    },
    setCheckoutError(state, action) {
      state.checkoutError = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    toggleTracking(state, action) {
      const id = action.payload;
      state.trackingOpen[id] = !state.trackingOpen[id];
    },
    setCheckoutAddress(state, action) {
      state.checkoutForm.addressId = action.payload;
    },
    setCheckoutCardField(state, action) {
      const { field, value } = action.payload;
      state.checkoutForm.card[field] = value;
      delete state.checkoutForm.cardErrors[field];
    },
    setCheckoutCardErrors(state, action) {
      state.checkoutForm.cardErrors = action.payload;
    },
    setCheckoutSelectedCard(state, action) {
      state.checkoutForm.selectedCardId = action.payload;
    },
    resetCheckoutForm(state) {
      state.checkoutForm = initialState.checkoutForm;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, (state, action) => {
        state.status = 'loading';
        state.fetchRequestId = action.meta.requestId;
        state.error = '';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;
        const currentById = new Map(state.items.map(order => [String(order.id), order]));
        const fetchedIds = new Set(action.payload.map(order => String(order.id)));
        state.items = [
          ...action.payload.map(order => currentById.get(String(order.id)) ?? order),
          ...state.items.filter(order => !fetchedIds.has(String(order.id)))
        ];
        state.status = 'succeeded';
        state.fetchRequestId = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? '';
        state.fetchRequestId = null;
      })
      .addCase(fetchOrderById.pending, (state, action) => {
        state.detailStatus = 'loading';
        state.detailId = action.meta.arg;
        state.detailRequestId = action.meta.requestId;
        state.detailError = '';
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return;
        replaceOrder(state, action.payload);
        state.detailStatus = 'succeeded';
        state.detailRequestId = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        if (action.meta.condition || state.detailRequestId !== action.meta.requestId) return;
        state.detailStatus = 'failed';
        state.detailError = action.payload ?? action.error.message ?? '';
        state.detailRequestId = null;
      })
      .addCase(createOrder.pending, (state, action) => {
        state.pendingAction = 'creating';
        state.pendingRequestId = action.meta.requestId;
        state.checkoutError = '';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        if (state.pendingRequestId !== action.meta.requestId) return;
        replaceOrder(state, action.payload);
        state.pendingAction = null;
        state.pendingRequestId = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        if (action.meta.condition || state.pendingRequestId !== action.meta.requestId) return;
        state.pendingAction = null;
        state.pendingRequestId = null;
        state.checkoutError = action.payload ?? action.error.message ?? '';
      })
      .addCase(cancelOrder.pending, (state, action) => {
        state.pendingAction = 'cancelling';
        state.pendingRequestId = action.meta.requestId;
        state.actionError = '';
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        if (state.pendingRequestId !== action.meta.requestId) return;
        replaceOrder(state, action.payload);
        state.pendingAction = null;
        state.pendingRequestId = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        if (action.meta.condition || state.pendingRequestId !== action.meta.requestId) return;
        state.pendingAction = null;
        state.pendingRequestId = null;
        state.actionError = action.payload ?? action.error.message ?? '';
      })
      .addCase(payOrder.pending, (state, action) => {
        state.pendingAction = 'paying';
        state.pendingRequestId = action.meta.requestId;
        state.actionError = '';
        state.notice = '';
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        if (state.pendingRequestId !== action.meta.requestId) return;
        replaceOrder(state, action.payload.order);
        state.pendingAction = null;
        state.pendingRequestId = null;
        state.notice = action.payload.notice;
        state.checkoutForm = initialState.checkoutForm;
      })
      .addCase(payOrder.rejected, (state, action) => {
        if (action.meta.condition || state.pendingRequestId !== action.meta.requestId) return;
        state.pendingAction = null;
        state.pendingRequestId = null;
        const message = action.payload ?? action.error.message ?? '';
        state.actionError = message === 'Elegí una dirección de envío antes de pagar.'
          ? message
          : `No se pudo pagar la orden: ${message}`;
      });
  }
});

export const {
  resetOrders,
  clearOrdersNotice,
  clearCheckoutError,
  setCheckoutError,
  setStatusFilter,
  toggleTracking,
  setCheckoutAddress,
  setCheckoutCardField,
  setCheckoutCardErrors,
  setCheckoutSelectedCard,
  resetCheckoutForm
} = ordersSlice.actions;
export const selectOrders = state => state.orders.items;
export const selectOrderById = id => state => state.orders.items.find(order => sameId(order.id, id));
export const selectOrdersStatus = state => state.orders.status;
export const selectOrdersError = state => state.orders.error;
export const selectOrdersCount = state => state.orders.items.length;
export const selectPendingAction = state => state.orders.pendingAction;
export const selectCheckoutError = state => state.orders.checkoutError;
export const selectOrdersActionError = state => state.orders.actionError;
export const selectOrdersNotice = state => state.orders.notice;
export const selectStatusFilter = state => state.orders.statusFilter;
export const selectFilteredOrders = state => state.orders.statusFilter === 'TODAS'
  ? state.orders.items
  : state.orders.items.filter(order => order.status === state.orders.statusFilter);
export const selectCheckoutForm = state => state.orders.checkoutForm;
export const selectIsTrackingOpen = orderId => state => Boolean(state.orders.trackingOpen[orderId]);

export default ordersSlice.reducer;
