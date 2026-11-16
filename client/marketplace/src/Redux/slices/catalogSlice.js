import { getVinylPrice } from '../../components/vinyl/vinylUtils.js';
import { collections, matchesCollection, normalizeCatalogText } from '../../data/collections.js';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cancelOrder, createOrder } from './ordersSlice.js';
import { getVinyls, getVinylById } from '../../services/api.js';

export const fetchVinyls = createAsyncThunk('catalog/fetch',
  async () => await getVinyls(),
  // StrictMode y distintas páginas pueden solicitar el mismo listado a la vez.
  { condition: (_, { getState }) => getState().catalog.list.status !== 'loading' });

export const fetchVinylById = createAsyncThunk('catalog/fetchById',
  async ({ vinylId }) => await getVinylById(vinylId),
  { condition: ({ vinylId }, { getState }) => getState().catalog.details[vinylId]?.status !== 'loading' });

const catalogSlice = createSlice({
  name: 'catalog',
  // El contador solo ordena respuestas: una consulta vieja no puede restaurar
  // stock anterior a una compra/cancelación ni pisar un detalle más reciente.
  initialState: { entities: {}, ids: [], version: 0, entityVersions: {}, list: { status: 'idle', error: '' }, details: {}, stockChanges: {} },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchVinyls.pending, (state, action) => {
      state.list = { ...state.list, status: 'loading', error: '', requestId: action.meta.requestId, version: ++state.version };
    }).addCase(fetchVinyls.fulfilled, (state, action) => {
      if (state.list.requestId !== action.meta.requestId) return;
      const currentIds = new Set(action.payload.map(vinyl => String(vinyl.id)));
      new Set([...Object.keys(state.entities), ...Object.keys(state.details)]).forEach(id => {
        if (!currentIds.has(String(id)) && (state.entityVersions[id] || 0) <= state.list.version) {
          state.entityVersions[id] = state.list.version;
          delete state.entities[id];
          delete state.details[id];
        }
      });
      state.ids = action.payload.map(vinyl => vinyl.id);
      state.list.status = 'succeeded';
      action.payload.forEach(vinyl => {
        // Conserva el dato más reciente cuando se cruzan listado y detalle.
        if ((state.entityVersions[vinyl.id] || 0) > state.list.version) return;
        state.entities[vinyl.id] = vinyl;
        state.entityVersions[vinyl.id] = state.list.version;
        const detail = state.details[vinyl.id];
        if (detail?.status !== 'loading' || detail.version < state.list.version) {
          state.details[vinyl.id] = { status: 'succeeded', error: '' };
        }
      });
    }).addCase(fetchVinyls.rejected, (state, action) => {
      if (state.list.requestId !== action.meta.requestId) return;
      state.list.status = 'failed';
      state.list.error = action.error.message;
    }).addCase(fetchVinylById.pending, (state, action) => {
      state.details[action.meta.arg.vinylId] = { status: 'loading', error: '', requestId: action.meta.requestId, version: ++state.version };
    }).addCase(fetchVinylById.fulfilled, (state, action) => {
      const request = state.details[action.meta.arg.vinylId];
      if (!request || request.requestId !== action.meta.requestId) return;
      if ((state.entityVersions[action.payload.id] || 0) <= request.version) {
        state.entities[action.payload.id] = action.payload;
        state.entityVersions[action.payload.id] = request.version;
      }
      request.status = 'succeeded';
    }).addCase(fetchVinylById.rejected, (state, action) => {
      const request = state.details[action.meta.arg.vinylId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'failed';
      request.error = action.error.message;
    }).addCase(createOrder.fulfilled, (state, action) => {
      const orderId = action.payload.id;
      if (state.stockChanges[orderId]) return;
      state.stockChanges[orderId] = 'created';
      action.payload.items.forEach(item => {
        const vinyl = state.entities[item.vinylId];
        if (vinyl) {
          vinyl.stock = Math.max(0, Number(vinyl.stock) - Number(item.quantity));
          state.entityVersions[item.vinylId] = ++state.version;
        }
      });
    }).addCase(cancelOrder.fulfilled, (state, action) => {
      if (action.payload.status !== 'CANCELADA') return;
      const orderId = action.payload.id;
      if (state.stockChanges[orderId] === 'cancelled') return;
      state.stockChanges[orderId] = 'cancelled';
      action.payload.items.forEach(item => {
        const vinyl = state.entities[item.vinylId];
        if (vinyl) {
          vinyl.stock = Number(vinyl.stock) + Number(item.quantity);
          state.entityVersions[item.vinylId] = ++state.version;
        }
      });
    });
  }
});

// Se derivan listas con map/filter, como en las demos. Los componentes seleccionan
// el estado del catálogo antes de aplicar estas funciones.
export const selectVinyls = state => state.catalog.ids.map(id => state.catalog.entities[id]).filter(Boolean);

export const selectFilteredVinyls = (state, filters, collectionId) => {
  const collection = collections.find(item => item.id === collectionId);
  let result = selectVinyls(state).filter(vinyl => matchesCollection(vinyl, collection));
  const search = normalizeCatalogText(filters.search);
  if (search) result = result.filter(vinyl => normalizeCatalogText(`${vinyl.name} ${vinyl.artistName || ''}`).includes(search));
  if (filters.stock === 'available') result = result.filter(vinyl => vinyl.stock > 0);
  if (filters.stock === 'unavailable') result = result.filter(vinyl => vinyl.stock <= 0);
  if (filters.sort === 'price-asc') result.sort((a, b) => getVinylPrice(a) - getVinylPrice(b));
  if (filters.sort === 'price-desc') result.sort((a, b) => getVinylPrice(b) - getVinylPrice(a));
  if (filters.sort === 'year-desc') result.sort((a, b) => b.year - a.year);
  return result;
};

export const selectCuratedCollections = state => {
  const vinyls = selectVinyls(state);
  return collections.map(collection => ({
    ...collection,
    vinylCount: vinyls.filter(vinyl => matchesCollection(vinyl, collection)).length
  }));
};
export default catalogSlice.reducer;
