import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  cancelOrder as cancelOrderRequest,
  createOrder as createOrderRequest,
  createPayment,
  getOrder,
  getOrders
} from '../../services/api';

const sameId = (left, right) => String(left) === String(right);

const initialState = {
  items: [],
  status: 'idle',
  error: '',
  detailStatus: 'idle',
  detailError: '',
  pendingAction: null,
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

const replaceOrder = (state, order) => {
  const index = state.items.findIndex(item => sameId(item.id, order.id));
  if (index === -1) {
    state.items.unshift(order);
  } else {
    state.items[index] = order;
  }
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => getOrders());

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async id => getOrder(id));

export const createOrder = createAsyncThunk('orders/createOrder', async () => createOrderRequest());

export const cancelOrder = createAsyncThunk('orders/cancelOrder', async id => cancelOrderRequest(id));

export const payOrder = createAsyncThunk('orders/payOrder', async ({ order, savedCardId, addressId }) => {
  if (!addressId) {
    throw new Error('Elegí una dirección de envío antes de pagar.');
  }
  const payment = await createPayment({
    orderId: order.id,
    amount: order.total,
    savedCardId,
    addressId
  });
  const fallbackOrder = {
    ...order,
    payment,
    status: 'PAGADA',
    orderStatus: {
      ...order.orderStatus,
      name: 'PAGADA'
    }
  };
  try {
    return {
      order: await getOrder(order.id),
      notice: 'Pago registrado.'
    };
  } catch {
    return {
      order: fallbackOrder,
      notice: 'El pago se registró. Recargá la orden para ver los datos de envío actualizados.'
    };
  }
});

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
      .addCase(fetchOrders.pending, state => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrderById.pending, state => {
        state.detailStatus = 'loading';
        state.detailError = '';
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        replaceOrder(state, action.payload);
        state.detailStatus = 'succeeded';
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.error.message;
      })
      .addCase(createOrder.pending, state => {
        state.pendingAction = 'creating';
        state.checkoutError = '';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        replaceOrder(state, action.payload);
        state.pendingAction = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.pendingAction = null;
        state.checkoutError = action.error.message;
      })
      .addCase(cancelOrder.pending, state => {
        state.pendingAction = 'cancelling';
        state.actionError = '';
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        replaceOrder(state, action.payload);
        state.pendingAction = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.pendingAction = null;
        state.actionError = action.error.message;
      })
      .addCase(payOrder.pending, state => {
        state.pendingAction = 'paying';
        state.actionError = '';
        state.notice = '';
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        replaceOrder(state, action.payload.order);
        state.pendingAction = null;
        state.notice = action.payload.notice;
        state.checkoutForm = initialState.checkoutForm;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.pendingAction = null;
        const message = action.error.message;
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

export default ordersSlice.reducer;
