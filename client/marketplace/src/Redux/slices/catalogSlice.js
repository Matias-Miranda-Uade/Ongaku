import { createSelector, createSlice } from '@reduxjs/toolkit';
import { fetchVinylById, fetchVinyls } from '../actions/catalogActions.js';
import { emptyRequest } from '../requestState.js';
import { collections, matchesCollection } from '../../data/collections.js';
import { getVinylPrice } from '../../components/vinyl/vinylUtils.js';

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: { entities: {}, ids: [], list: { ...emptyRequest }, details: {} },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchVinyls.pending, (state, action) => {
      state.list = { ...state.list, status: 'loading', error: '', requestId: action.meta.requestId };
    }).addCase(fetchVinyls.fulfilled, (state, action) => {
      if (state.list.requestId !== action.meta.requestId) return;
      const currentIds = new Set(action.payload.map(vinyl => String(vinyl.id)));
      state.ids.forEach(id => {
        if (!currentIds.has(String(id)) && state.details[id]?.status !== 'loading') {
          delete state.entities[id];
          delete state.details[id];
        }
      });
      state.ids = action.payload.map(vinyl => vinyl.id);
      state.list.status = 'succeeded';
      state.list.fetchedAt = Date.now();
      action.payload.forEach(vinyl => {
        // Listado y detalle reciben el mismo DTO; se conserva una sola copia.
        if (!state.entities[vinyl.id]) state.entities[vinyl.id] = vinyl;
        if (state.details[vinyl.id]?.status === 'loading') return;
        state.entities[vinyl.id] = vinyl;
        state.details[vinyl.id] = { status: 'succeeded', error: '', fetchedAt: state.list.fetchedAt };
      });
    }).addCase(fetchVinyls.rejected, (state, action) => {
      if (state.list.requestId !== action.meta.requestId) return;
      state.list.status = 'failed';
      state.list.error = action.payload || action.error.message;
    }).addCase(fetchVinylById.pending, (state, action) => {
      state.details[action.meta.arg.vinylId] = { status: 'loading', error: '', requestId: action.meta.requestId };
    }).addCase(fetchVinylById.fulfilled, (state, action) => {
      const request = state.details[action.meta.arg.vinylId];
      if (request.requestId !== action.meta.requestId) return;
      state.entities[action.payload.id] = action.payload;
      request.status = 'succeeded';
      request.fetchedAt = Date.now();
    }).addCase(fetchVinylById.rejected, (state, action) => {
      const request = state.details[action.meta.arg.vinylId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'failed';
      request.error = action.payload || action.error.message;
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
    const search = filters.search.trim().toLowerCase();
    if (search) result = result.filter(vinyl => `${vinyl.name} ${vinyl.artistName || ''}`.toLowerCase().includes(search));
    if (filters.stock === 'available') result = result.filter(vinyl => vinyl.stock > 0);
    if (filters.stock === 'unavailable') result = result.filter(vinyl => vinyl.stock <= 0);
    if (filters.sort === 'price-asc') result.sort((a, b) => getVinylPrice(a) - getVinylPrice(b));
    if (filters.sort === 'price-desc') result.sort((a, b) => getVinylPrice(b) - getVinylPrice(a));
    if (filters.sort === 'year-desc') result.sort((a, b) => b.year - a.year);
    return result;
  }
);
export default catalogSlice.reducer;
