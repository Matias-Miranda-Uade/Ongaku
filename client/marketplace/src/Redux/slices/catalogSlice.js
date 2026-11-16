import { getVinylPrice } from '../../components/vinyl/vinylUtils.js';
import { collections, matchesCollection, normalizeCatalogText } from '../../data/collections.js';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { cancelOrder, createOrder } from './ordersSlice.js';
import { getVinyls, getVinylById } from '../../services/api.js';
import { emptyRequest, getMessage, shouldFetch } from '../requestState.js';

export const fetchVinyls = createAsyncThunk('catalog/fetch',
  async (_, { rejectWithValue }) => {
    try { return await getVinyls(); }
    catch (error) { return rejectWithValue(getMessage(error)); }
  },
  { condition: (options = {}, { getState }) => shouldFetch(getState().catalog.list, options.force) });

export const fetchVinylById = createAsyncThunk('catalog/fetchById',
  async ({ vinylId }, { rejectWithValue }) => {
    try { return await getVinylById(vinylId); }
    catch (error) { return rejectWithValue(getMessage(error)); }
  },
  { condition: ({ vinylId, force = false }, { getState }) => shouldFetch(getState().catalog.details[vinylId], force) });

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: { entities: {}, ids: [], version: 0, entityVersions: {}, list: { ...emptyRequest }, details: {}, stockChanges: {} },
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
      state.list.fetchedAt = Date.now();
      action.payload.forEach(vinyl => {
        // Keep the newest entity when list and detail requests overlap.
        if ((state.entityVersions[vinyl.id] || 0) > state.list.version) return;
        state.entities[vinyl.id] = vinyl;
        state.entityVersions[vinyl.id] = state.list.version;
        const detail = state.details[vinyl.id];
        if (detail?.status !== 'loading' || detail.version < state.list.version) {
          state.details[vinyl.id] = { status: 'succeeded', error: '', fetchedAt: state.list.fetchedAt };
        }
      });
    }).addCase(fetchVinyls.rejected, (state, action) => {
      if (state.list.requestId !== action.meta.requestId) return;
      state.list.status = 'failed';
      state.list.error = action.payload || action.error.message;
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
      request.fetchedAt = Date.now();
    }).addCase(fetchVinylById.rejected, (state, action) => {
      const request = state.details[action.meta.arg.vinylId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'failed';
      request.error = action.payload || action.error.message;
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
      state.list.fetchedAt = 0;
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
      state.list.fetchedAt = 0;
    });
  }
});

export const selectVinyls = createSelector(
  [state => state.catalog.ids, state => state.catalog.entities],
  (ids, entities) => ids.map(id => entities[id]).filter(Boolean)
);
export const selectFilteredVinyls = createSelector(
  [selectVinyls, (_, filters) => filters, (_, filters, collectionId) => collectionId],
  (vinyls, filters, collectionId) => {
    const collection = collections.find(item => item.id === collectionId);
    let result = vinyls.filter(vinyl => matchesCollection(vinyl, collection));
    const search = normalizeCatalogText(filters.search);
    if (search) result = result.filter(vinyl => normalizeCatalogText(`${vinyl.name} ${vinyl.artistName || ''}`).includes(search));
    if (filters.stock === 'available') result = result.filter(vinyl => vinyl.stock > 0);
    if (filters.stock === 'unavailable') result = result.filter(vinyl => vinyl.stock <= 0);
    if (filters.sort === 'price-asc') result.sort((a, b) => getVinylPrice(a) - getVinylPrice(b));
    if (filters.sort === 'price-desc') result.sort((a, b) => getVinylPrice(b) - getVinylPrice(a));
    if (filters.sort === 'year-desc') result.sort((a, b) => b.year - a.year);
    return result;
  }
);
// Curaduria y catalogo derivan sus vistas de las mismas entidades.
export const selectCuratedCollections = createSelector(
  [selectVinyls],
  vinyls => collections.map(collection => ({
    ...collection,
    vinylCount: vinyls.filter(vinyl => matchesCollection(vinyl, collection)).length
  }))
);
export default catalogSlice.reducer;
