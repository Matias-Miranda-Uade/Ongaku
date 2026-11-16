import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import {
  adjustVinylStock, createArtist, createAudioPreview, createCategory, createGenre, createVinyl, deleteArtist,
  deleteCategory, deleteGenre, deleteVinyl, getAdminVinylById, getAdminVinyls, getAudioPreviews, getCatalogLookups, setVinylEnabled, updateVinyl
} from '../../services/adminService.js';
import { getStockStatus, indexById, normalizeText } from '../../components/admin/adminUtils.js';
import { emptyRequest, getErrorDetails, getMessage, shouldFetch } from '../requestState.js';
import { login, logout, register } from './authSlice.js';
import { fetchVinyls } from './catalogSlice.js';

const sameId = (left, right) => String(left) === String(right);
const genreIdsOf = vinyl => (vinyl.genreIds?.length ? vinyl.genreIds : [vinyl.genreId]).filter(id => id != null);

// Las escrituras del panel cambian la tienda: si el catálogo público ya se cargó, se renueva.
const refreshStorefront = api => {
  if (api.getState().catalog?.list.status === 'succeeded') api.dispatch(fetchVinyls({ force: true }));
};
const read = (type, operation, select) => createAsyncThunk(type,
  (_, { rejectWithValue }) => operation().catch(error => rejectWithValue(getMessage(error))),
  { condition: (options = {}, { getState }) => shouldFetch(select(getState().adminCatalog), options.force) });
const write = (type, operation, options) => createAsyncThunk(type, async (arg, api) => {
  try {
    return await operation(arg, api);
  } catch (error) {
    return api.rejectWithValue(getErrorDetails(error));
  }
}, options);
const canMutate = ({ vinylId }, { getState }) => getState().adminCatalog.mutations[vinylId]?.status !== 'loading';

export const fetchAdminVinyls = read('adminCatalog/fetchVinyls', getAdminVinyls, state => state.list);
export const fetchAdminLookups = read('adminCatalog/fetchLookups', getCatalogLookups, state => state.lookups.request);
export const fetchAudioPreviews = read('adminCatalog/fetchPreviews', getAudioPreviews, state => state.previews.request);
export const fetchAdminVinylById = write('adminCatalog/fetchVinylById', ({ vinylId }) => getAdminVinylById(vinylId), {
  condition: ({ vinylId, force = false }, { getState }) => shouldFetch(getState().adminCatalog.details[vinylId], force)
});

// Alta o edición; si el estado de publicación guardado no coincide con el pedido, se ajusta.
export const saveAdminVinyl = write('adminCatalog/saveVinyl', async ({ vinylId = null, payload, enabled }, api) => {
  let saved = vinylId == null ? await createVinyl(payload) : await updateVinyl(vinylId, payload);
  if (Boolean(enabled) !== (saved?.enabled ?? true)) saved = await setVinylEnabled(saved.id, Boolean(enabled));
  refreshStorefront(api);
  return saved;
}, { condition: ({ vinylId = null }, { getState }) => vinylId == null || canMutate({ vinylId }, { getState }) });

export const setAdminVinylEnabled = write('adminCatalog/setEnabled', async ({ vinylId, enabled }, api) => {
  const saved = await setVinylEnabled(vinylId, enabled);
  refreshStorefront(api);
  return saved;
}, { condition: canMutate });

export const adjustAdminVinylStock = write('adminCatalog/adjustStock', async ({ vinylId, quantity }, api) => {
  const saved = await adjustVinylStock(vinylId, quantity);
  refreshStorefront(api);
  return saved;
}, { condition: canMutate });

export const deleteAdminVinyl = write('adminCatalog/deleteVinyl', async ({ vinylId }, api) => {
  await deleteVinyl(vinylId);
  refreshStorefront(api);
  return { id: vinylId };
}, { condition: canMutate });

export const createAdminArtist = write('adminCatalog/createArtist', name => createArtist(name));
// Borrar un artista, género o categoría no borra sus vinilos: el backend los deja sin esa relación.
// La tienda muestra nombres de artista y categoría, así que también se renueva.
export const deleteAdminArtist = write('adminCatalog/deleteArtist', async ({ artistId }, api) => {
  await deleteArtist(artistId);
  refreshStorefront(api);
  return { id: artistId };
});
export const createAdminGenre = write('adminCatalog/createGenre', name => createGenre(name));
export const deleteAdminGenre = write('adminCatalog/deleteGenre', async ({ genreId }, api) => {
  await deleteGenre(genreId);
  refreshStorefront(api);
  return { id: genreId };
});
export const createAdminCategory = write('adminCatalog/createCategory', description => createCategory(description));
export const deleteAdminCategory = write('adminCatalog/deleteCategory', async ({ categoryId }, api) => {
  await deleteCategory(categoryId);
  refreshStorefront(api);
  return { id: categoryId };
});
export const createAdminAudioPreview = write('adminCatalog/createPreview', preview => createAudioPreview(preview));

const initialState = {
  entities: {}, ids: [], version: 0, entityVersions: {},
  list: { ...emptyRequest }, details: {}, mutations: {}, createRequestId: null,
  lookups: { artists: [], genres: [], categories: [], request: { ...emptyRequest } },
  previews: { items: [], request: { ...emptyRequest } }
};

// Solo reemplaza los campos que cambiaron: un vinilo idéntico conserva su referencia
// y el formulario de edición no se reinicia cuando llega una recarga del listado.
const mergeVinyl = (state, vinyl, version) => {
  if ((state.entityVersions[vinyl.id] || 0) > version) return;
  state.entityVersions[vinyl.id] = version;
  const current = state.entities[vinyl.id];
  if (!current) {
    state.entities[vinyl.id] = vinyl;
    if (!state.ids.some(id => sameId(id, vinyl.id))) state.ids.unshift(vinyl.id);
    return;
  }
  for (const [key, value] of Object.entries(vinyl)) {
    if (JSON.stringify(current[key]) !== JSON.stringify(value)) current[key] = value;
  }
};
const removeVinyl = (state, id) => {
  state.entityVersions[id] = ++state.version;
  delete state.entities[id];
  delete state.details[id];
  state.ids = state.ids.filter(value => !sameId(value, id));
};
const pushUnique = (list, item) => {
  if (!list.some(value => sameId(value.id, item.id))) list.push(item);
};
const startRequest = (request, action) => {
  request.status = 'loading';
  request.error = '';
  request.requestId = action.meta.requestId;
};
const finishRequest = (request, action) => {
  if (request.requestId !== action.meta.requestId) return false;
  request.status = 'succeeded';
  request.fetchedAt = Date.now();
  request.requestId = null;
  return true;
};
const failRequest = (request, action) => {
  if (request.requestId !== action.meta.requestId) return;
  request.status = 'failed';
  request.error = action.payload || action.error.message;
  request.requestId = null;
};

const adminCatalogSlice = createSlice({
  name: 'adminCatalog',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAdminVinyls.pending, (state, action) => {
      startRequest(state.list, action);
      state.list.version = ++state.version;
    }).addCase(fetchAdminVinyls.fulfilled, (state, action) => {
      const { version } = state.list;
      if (!finishRequest(state.list, action)) return;
      const received = new Set(action.payload.map(vinyl => String(vinyl.id)));
      // Lo que no vino en la respuesta se descarta, salvo que una escritura posterior lo haya creado.
      for (const id of Object.keys(state.entities)) {
        if (!received.has(id) && (state.entityVersions[id] || 0) <= version) removeVinyl(state, id);
      }
      const kept = state.ids.filter(id => !received.has(String(id)));
      action.payload.forEach(vinyl => mergeVinyl(state, vinyl, version));
      state.ids = [...kept, ...action.payload.map(vinyl => vinyl.id).filter(id => state.entities[id])];
    }).addCase(fetchAdminVinyls.rejected, (state, action) => {
      failRequest(state.list, action);
    }).addCase(fetchAdminVinylById.pending, (state, action) => {
      state.details[action.meta.arg.vinylId] = {
        status: 'loading', error: '', notFound: false, requestId: action.meta.requestId, version: ++state.version
      };
    }).addCase(fetchAdminVinylById.fulfilled, (state, action) => {
      const request = state.details[action.meta.arg.vinylId];
      if (!request || !finishRequest(request, action)) return;
      mergeVinyl(state, action.payload, request.version);
    }).addCase(fetchAdminVinylById.rejected, (state, action) => {
      const request = state.details[action.meta.arg.vinylId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'failed';
      request.error = action.payload?.message || action.error.message;
      request.notFound = Boolean(action.payload?.isNotFound);
      request.requestId = null;
    }).addCase(fetchAdminLookups.pending, (state, action) => {
      startRequest(state.lookups.request, action);
    }).addCase(fetchAdminLookups.fulfilled, (state, action) => {
      if (!finishRequest(state.lookups.request, action)) return;
      state.lookups.artists = action.payload.artists;
      state.lookups.genres = action.payload.genres;
      state.lookups.categories = action.payload.categories;
    }).addCase(fetchAdminLookups.rejected, (state, action) => {
      failRequest(state.lookups.request, action);
    }).addCase(fetchAudioPreviews.pending, (state, action) => {
      startRequest(state.previews.request, action);
    }).addCase(fetchAudioPreviews.fulfilled, (state, action) => {
      if (finishRequest(state.previews.request, action)) state.previews.items = action.payload;
    }).addCase(fetchAudioPreviews.rejected, (state, action) => {
      failRequest(state.previews.request, action);
    }).addCase(createAdminArtist.fulfilled, (state, action) => {
      pushUnique(state.lookups.artists, action.payload);
    }).addCase(deleteAdminArtist.fulfilled, (state, action) => {
      const { id } = action.payload;
      state.lookups.artists = state.lookups.artists.filter(artist => !sameId(artist.id, id));
      // El backend conserva los vinilos del artista eliminado y los deja sin artista.
      Object.values(state.entities).forEach(vinyl => {
        if (sameId(vinyl.artistId, id)) vinyl.artistId = null;
      });
    }).addCase(createAdminGenre.fulfilled, (state, action) => {
      pushUnique(state.lookups.genres, action.payload);
    }).addCase(deleteAdminGenre.fulfilled, (state, action) => {
      const { id } = action.payload;
      state.lookups.genres = state.lookups.genres.filter(genre => !sameId(genre.id, id));
      // Igual que el backend: si era el género principal, toma su lugar el primero que quede.
      Object.values(state.entities).forEach(vinyl => {
        if (!genreIdsOf(vinyl).some(genreId => sameId(genreId, id))) return;
        const remaining = genreIdsOf(vinyl).filter(genreId => !sameId(genreId, id));
        vinyl.genreIds = remaining;
        vinyl.genreId = remaining[0] ?? null;
      });
    }).addCase(createAdminCategory.fulfilled, (state, action) => {
      pushUnique(state.lookups.categories, action.payload);
    }).addCase(deleteAdminCategory.fulfilled, (state, action) => {
      const { id } = action.payload;
      state.lookups.categories = state.lookups.categories.filter(category => !sameId(category.id, id));
      Object.values(state.entities).forEach(vinyl => {
        if (sameId(vinyl.categoryId, id)) vinyl.categoryId = null;
      });
    }).addCase(createAdminAudioPreview.fulfilled, (state, action) => {
      pushUnique(state.previews.items, action.payload);
    });
    // Estado por vinilo de las escrituras, para deshabilitar sólo las filas afectadas.
    // El alta todavía no tiene id: se sigue con createRequestId.
    for (const thunk of [saveAdminVinyl, setAdminVinylEnabled, adjustAdminVinylStock, deleteAdminVinyl]) {
      builder.addCase(thunk.pending, (state, action) => {
        const { vinylId = null } = action.meta.arg;
        if (vinylId == null) state.createRequestId = action.meta.requestId;
        else state.mutations[vinylId] = { id: vinylId, status: 'loading', error: '', requestId: action.meta.requestId };
      }).addCase(thunk.fulfilled, (state, action) => {
        const { vinylId = null } = action.meta.arg;
        if (vinylId == null) {
          if (state.createRequestId !== action.meta.requestId) return;
          state.createRequestId = null;
        } else {
          const request = state.mutations[vinylId];
          if (!request || request.requestId !== action.meta.requestId) return;
          request.status = 'succeeded';
        }
        if (thunk === deleteAdminVinyl) removeVinyl(state, action.payload.id);
        else mergeVinyl(state, action.payload, ++state.version);
      }).addCase(thunk.rejected, (state, action) => {
        const { vinylId = null } = action.meta.arg;
        if (vinylId == null) {
          if (state.createRequestId === action.meta.requestId) state.createRequestId = null;
          return;
        }
        const request = state.mutations[vinylId];
        if (!request || request.requestId !== action.meta.requestId) return;
        request.status = 'failed';
        request.error = action.payload?.message || action.error.message;
      });
    }
    // Un cambio de sesión descarta los datos administrativos y las respuestas pendientes.
    for (const thunk of [login, register, logout]) builder.addCase(thunk.pending, () => initialState);
  }
});

export const selectAdminVinylsRequest = state => state.adminCatalog.list;
export const selectAdminLookupsRequest = state => state.adminCatalog.lookups.request;
export const selectAudioPreviews = state => state.adminCatalog.previews.items;
export const selectAdminArtists = state => state.adminCatalog.lookups.artists;
export const selectAdminGenres = state => state.adminCatalog.lookups.genres;
export const selectAdminCategories = state => state.adminCatalog.lookups.categories;
export const selectAdminVinyls = createSelector(
  [state => state.adminCatalog.ids, state => state.adminCatalog.entities],
  (ids, entities) => ids.map(id => entities[id]).filter(Boolean)
);
export const selectBusyVinylIds = createSelector(
  [state => state.adminCatalog.mutations],
  mutations => new Set(Object.values(mutations).filter(request => request.status === 'loading').map(request => request.id))
);
export const selectAdminVinylDetail = createSelector(
  [(state, vinylId) => state.adminCatalog.details[vinylId], (state, vinylId) => state.adminCatalog.entities[vinylId]],
  (request = emptyRequest, vinyl = null) => ({
    status: request.status, error: request.error, notFound: Boolean(request.notFound), vinyl
  })
);
// Previews ya asignadas a algún vinilo: el formulario no las ofrece para otro disco.
export const selectUsedPreviewIds = createSelector(
  [selectAdminVinyls],
  vinyls => new Set(vinyls.filter(vinyl => vinyl.audioPreviewId).map(vinyl => String(vinyl.audioPreviewId)))
);
// Filas del inventario y la vitrina con los nombres de artista y género resueltos.
export const selectAdminVinylRows = createSelector(
  [selectAdminVinyls, selectAdminArtists, selectAdminGenres],
  (vinyls, artists, genres) => {
    const artistsById = indexById(artists);
    const genresById = indexById(genres);
    return vinyls.map(vinyl => ({
      ...vinyl,
      artistName: artistsById[String(vinyl.artistId)]?.name ?? '',
      genreName: genreIdsOf(vinyl).map(id => genresById[String(id)]?.name).filter(Boolean).join(' / '),
      finalPrice: vinyl.finalPrice ?? vinyl.price
    }));
  }
);
const compare = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a ?? '').localeCompare(String(b ?? ''), 'es', { sensitivity: 'base' });
};
export const selectInventoryRows = createSelector(
  [selectAdminVinylRows, (_, filters) => filters, (_, filters, sort) => sort],
  (rows, filters, sort) => {
    const term = normalizeText(filters.search);
    const direction = sort.direction === 'asc' ? 1 : -1;
    return rows.filter(row => {
      if (term && ![row.name, row.artistName, String(row.id)].some(value => normalizeText(value).includes(term))) return false;
      if (filters.genreId && !genreIdsOf(row).map(String).includes(filters.genreId)) return false;
      if (filters.categoryId && String(row.categoryId) !== filters.categoryId) return false;
      if (filters.stock !== 'all' && getStockStatus(row.stock) !== filters.stock) return false;
      if (filters.visibility === 'visible' && !row.enabled) return false;
      if (filters.visibility === 'hidden' && row.enabled) return false;
      return true;
    }).sort((a, b) => compare(a[sort.key], b[sort.key]) * direction);
  }
);
export const selectInventoryTotals = createSelector([selectAdminVinyls], vinyls => vinyls.reduce((acc, vinyl) => {
  const status = getStockStatus(vinyl.stock);
  acc.titles += 1;
  acc.units += Number(vinyl.stock) || 0;
  if (status === 'out') acc.out += 1;
  if (status === 'low') acc.low += 1;
  if (vinyl.enabled) acc.published += 1;
  return acc;
}, { titles: 0, units: 0, out: 0, low: 0, published: 0 }));
export default adminCatalogSlice.reducer;
