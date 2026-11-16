import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { getAllOrders, getDashboardSummary, updateOrderStatus } from '../../services/adminService.js';
import { emptyRequest, getErrorDetails, getMessage, shouldFetch } from '../requestState.js';
import { login, logout, register } from './authSlice.js';

const read = (type, operation, select) => createAsyncThunk(type,
  (_, { rejectWithValue }) => operation().catch(error => rejectWithValue(getMessage(error))),
  { condition: (options = {}, { getState }) => shouldFetch(select(getState().adminOrders), options.force) });

export const fetchAdminOrders = read('adminOrders/fetchOrders', getAllOrders, state => state.list);
export const fetchDashboardSummary = read('adminOrders/fetchSummary', getDashboardSummary, state => state.summary);

// Tras confirmar el cambio se renueva el resumen, si ya se había cargado, para que las métricas coincidan.
export const updateAdminOrderStatus = createAsyncThunk('adminOrders/updateStatus',
  async ({ orderId, status }, { dispatch, getState, rejectWithValue }) => {
    try {
      const updated = await updateOrderStatus(orderId, status);
      if (getState().adminOrders.summary.status !== 'idle') await dispatch(fetchDashboardSummary({ force: true }));
      return updated;
    } catch (error) {
      return rejectWithValue(getErrorDetails(error));
    }
  },
  { condition: ({ orderId }, { getState }) => getState().adminOrders.mutations[orderId]?.status !== 'loading' });

const initialState = {
  entities: {}, ids: [], version: 0, entityVersions: {},
  list: { ...emptyRequest }, summary: { ...emptyRequest, data: null }, mutations: {}
};

const adminOrdersSlice = createSlice({
  name: 'adminOrders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAdminOrders.pending, (state, action) => {
      state.list = { ...state.list, status: 'loading', error: '', requestId: action.meta.requestId, version: ++state.version };
    }).addCase(fetchAdminOrders.fulfilled, (state, action) => {
      if (state.list.requestId !== action.meta.requestId) return;
      const { version } = state.list;
      action.payload.forEach(order => {
        // Un cambio de estado confirmado después de iniciar la carga tiene prioridad.
        if ((state.entityVersions[order.id] || 0) > version) return;
        state.entities[order.id] = order;
        state.entityVersions[order.id] = version;
      });
      state.ids = action.payload.map(order => order.id);
      state.list.status = 'succeeded';
      state.list.fetchedAt = Date.now();
      state.list.requestId = null;
    }).addCase(fetchAdminOrders.rejected, (state, action) => {
      if (state.list.requestId !== action.meta.requestId) return;
      state.list.status = 'failed';
      state.list.error = action.payload || action.error.message;
      state.list.requestId = null;
    }).addCase(fetchDashboardSummary.pending, (state, action) => {
      state.summary.status = 'loading';
      state.summary.error = '';
      state.summary.requestId = action.meta.requestId;
    }).addCase(fetchDashboardSummary.fulfilled, (state, action) => {
      if (state.summary.requestId !== action.meta.requestId) return;
      state.summary.data = action.payload;
      state.summary.status = 'succeeded';
      state.summary.fetchedAt = Date.now();
      state.summary.requestId = null;
    }).addCase(fetchDashboardSummary.rejected, (state, action) => {
      if (state.summary.requestId !== action.meta.requestId) return;
      state.summary.status = 'failed';
      state.summary.error = action.payload || action.error.message;
      state.summary.requestId = null;
    }).addCase(updateAdminOrderStatus.pending, (state, action) => {
      const { orderId } = action.meta.arg;
      state.mutations[orderId] = { id: orderId, status: 'loading', error: '', requestId: action.meta.requestId };
    }).addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
      const { orderId, status } = action.meta.arg;
      const request = state.mutations[orderId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'succeeded';
      const current = state.entities[orderId];
      if (!current) return;
      const updated = action.payload || {};
      state.entities[orderId] = {
        ...current, ...updated, orderStatus: updated.orderStatus ?? { ...current.orderStatus, name: status }
      };
      state.entityVersions[orderId] = ++state.version;
    }).addCase(updateAdminOrderStatus.rejected, (state, action) => {
      const request = state.mutations[action.meta.arg.orderId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'failed';
      request.error = action.payload?.message || action.error.message;
    });
    // Un cambio de sesión descarta los datos administrativos y las respuestas pendientes.
    for (const thunk of [login, register, logout]) builder.addCase(thunk.pending, () => initialState);
  }
});

export const selectAdminOrdersRequest = state => state.adminOrders.list;
export const selectDashboardSummary = state => state.adminOrders.summary;
// Más recientes primero; el dashboard y la página de órdenes comparten el mismo orden.
export const selectAdminOrders = createSelector(
  [state => state.adminOrders.ids, state => state.adminOrders.entities],
  (ids, entities) => ids.map(id => entities[id]).filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
);
export const selectUpdatingOrderIds = createSelector(
  [state => state.adminOrders.mutations],
  mutations => new Set(Object.values(mutations).filter(request => request.status === 'loading').map(request => request.id))
);
export default adminOrdersSlice.reducer;
