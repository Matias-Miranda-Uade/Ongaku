import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  cancelOrder as cancelOrderRequest,
  createOrder as createOrderRequest,
  createPayment,
  getOrder,
  getOrders
} from '../../services/api';

const getMessage = error => error?.message ?? String(error);
const sameId = (left, right) => String(left) === String(right);

export const fetchOrders = createAsyncThunk('orders/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getOrders();
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
}, {
  condition: (_, { getState }) => !['loading', 'succeeded'].includes(getState().orders.status)
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await getOrder(id);
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
}, {
  condition: (id, { getState }) => {
    const state = getState().orders;
    return !state.items.some(order => sameId(order.id, id))
      && !(sameId(state.detailId, id) && state.detailStatus === 'loading');
  }
});

export const createOrder = createAsyncThunk('orders/create', async (_, { rejectWithValue }) => {
  try {
    return await createOrderRequest();
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
}, {
  condition: (_, { getState }) => !getState().orders.pendingAction
});

export const cancelOrder = createAsyncThunk('orders/cancel', async (id, { rejectWithValue }) => {
  try {
    return await cancelOrderRequest(id);
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
}, {
  condition: (_, { getState }) => !getState().orders.pendingAction
});

export const payOrder = createAsyncThunk('orders/pay', async ({ order, savedCardId, addressId }, { rejectWithValue }) => {
  if (!addressId) return rejectWithValue('Elegí una dirección de envío antes de pagar.');
  try {
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
      // El pago ya quedó confirmado; el GET solo completa datos de envío de la orden.
      return {
        order: fallbackOrder,
        notice: 'El pago se registró. Recargá la orden para ver los datos de envío actualizados.'
      };
    }
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
}, {
  condition: ({ order, isAdmin }, { getState }) => {
    const state = getState().orders;
    return !isAdmin && !state.pendingAction && order.status === 'PENDIENTE';
  }
});

export { sameId };
