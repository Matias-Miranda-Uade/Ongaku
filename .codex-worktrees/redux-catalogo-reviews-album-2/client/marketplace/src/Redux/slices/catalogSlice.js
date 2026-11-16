import { getVinylPrice } from '../../components/vinyl/vinylUtils.js';
import { collections, matchesCollection, normalizeCatalogText } from '../../data/collections.js';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cancelOrder, createOrder } from './ordersSlice.js';
import { getVinyls, getVinylById } from '../../services/api.js';
import { emptyRequest, shouldFetch } from '../requestState.js';

export const fetchVinyls = createAsyncThunk('catalog/fetch',
  async () => getVinyls(),
  { condition: (options = {}, { getState }) => shouldFetch(getState().catalog.list, options.force) });

export const fetchVinylById = createAsyncThunk('catalog/fetchById',
  async ({ vinylId }) => getVinylById(vinylId),
  { condition: ({ vinylId, force = false }, { getState }) => shouldFetch(getState().catalog.details[vinylId], force) });

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: { items: [], ids: [], version: 0, entityVersions: {}, list: { ...emptyRequest }, details: {} },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchVinyls.pending, (state, action) => {
      state.list = { ...state.list, status: 'loading', error: '', requestId: action.meta.requestId, version: ++state.version };
    }).addCase(fetchVinyls.fulfilled, (state, action) => {
      if (state.list.requestId !== action.meta.requestId) return;
      const currentIds = new Set(action.payload.map(vinyl => String(vinyl.id)));
      new Set([...state.items.map(vinyl => String(vinyl.id)), ...Object.keys(state.details)]).forEach(id => {
        if (!currentIds.has(String(id)) && (state.entityVersions[id] || 0) <= state.list.version) {
          state.entityVersions[id] = state.list.version;
          state.items = state.items.filter(vinyl => String(vinyl.id) !== String(id));
          delete state.details[id];
        }
      });
      state.ids = action.payload.map(vinyl => vinyl.id);
      state.list.status = 'succeeded';
      state.list.fetchedAt = Date.now();
      action.payload.forEach(vinyl => {
        // Conserva el dato más reciente si se cruzan las respuestas de listado y detalle.
        if ((state.entityVersions[vinyl.id] || 0) > state.list.version) return;
        const index = state.items.findIndex(item => String(item.id) === String(vinyl.id));
        if (index === -1) state.items.push(vinyl);
        else state.items[index] = vinyl;
        state.entityVersions[vinyl.id] = state.list.version;
        const detail = state.details[vinyl.id];
        if (detail?.status !== 'loading' || detail.version < state.list.version) {
          state.details[vinyl.id] = { status: 'succeeded', error: '', fetchedAt: state.list.fetchedAt };
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
        const index = state.items.findIndex(item => String(item.id) === String(action.payload.id));
        if (index === -1) state.items.push(action.payload);
        else state.items[index] = action.payload;
        state.entityVersions[action.payload.id] = request.version;
      }
      request.status = 'succeeded';
      request.fetchedAt = Date.now();
    }).addCase(fetchVinylById.rejected, (state, action) => {
      const request = state.details[action.meta.arg.vinylId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'failed';
      request.error = action.error.message;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      action.payload.items.forEach(item => {
        const vinyl = state.items.find(vinyl => String(vinyl.id) === String(item.vinylId));
        if (vinyl) {
          vinyl.stock = Math.max(0, vinyl.stock - item.quantity);
          state.entityVersions[vinyl.id] = ++state.version;
        }
      });
    });
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      if (action.payload.status !== 'CANCELADA') return;
      action.payload.items.forEach(item => {
        const vinyl = state.items.find(vinyl => String(vinyl.id) === String(item.vinylId));
        if (vinyl) {
          vinyl.stock += item.quantity;
          state.entityVersions[vinyl.id] = ++state.version;
        }
      });
    });
  }
});

export const selectVinyls = state => state.catalog.ids
  .map(id => state.catalog.items.find(vinyl => String(vinyl.id) === String(id)))
  .filter(Boolean);

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
