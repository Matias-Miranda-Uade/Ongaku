import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { http, normalizeOrder } from '../../services/api.js';

const initialState = {
  items: [],
  loading: false,
  error: ''
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const { data: orders } = await http.get('/orders');
  const { data: payments } = await http.get('/payments');
  return Array.isArray(orders)
    ? orders.map(order => normalizeOrder(order, Array.isArray(payments) ? payments : []))
    : [];
});

export const createOrder = createAsyncThunk('orders/createOrder', async () => {
  const { data } = await http.post('/orders');
  return normalizeOrder(data);
});

export const cancelOrder = createAsyncThunk('orders/cancelOrder', async id => {
  const { data } = await http.patch(`/orders/${id}/status`, { status: 'CANCELADA' });
  return normalizeOrder(data);
});

export const payOrder = createAsyncThunk('orders/payOrder', async ({ order, savedCardId, addressId }) => {
  const { data: payment } = await http.post('/payments', {
    orderId: order.id,
    amount: order.total,
    method: 'SIMULADO',
    ...(savedCardId == null ? {} : { savedCardId }),
    addressId
  });
  const { data: orderData } = await http.get(`/orders/${order.id}`);
  return normalizeOrder(orderData, [payment]);
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrders: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createOrder.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
        state.loading = false;
      })
      .addCase(createOrder.rejected, state => {
        state.loading = false;
      })
      .addCase(cancelOrder.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => String(item.id) === String(action.payload.id));
        if (index !== -1) state.items[index] = action.payload;
        state.loading = false;
      })
      .addCase(cancelOrder.rejected, state => {
        state.loading = false;
      })
      .addCase(payOrder.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => String(item.id) === String(action.payload.id));
        if (index !== -1) state.items[index] = action.payload;
        state.loading = false;
      })
      .addCase(payOrder.rejected, state => {
        state.loading = false;
      });
  }
});

export const { resetOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
