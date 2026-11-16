import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createReview as createReviewRequest, updateReview as updateReviewRequest,
  deleteReview as deleteReviewRequest, getMyReviews, getReviews, getReviewsByVinyl, getReviewEligibility
} from '../../services/api.js';
import { eligibilityKey, reviewsKey } from '../requestState.js';

export const fetchMyReviews = createAsyncThunk('reviews/fetchMine',
  async () => await getMyReviews(),
  { condition: (options = {}, { getState }) => options.replace || getState().reviews.status !== 'loading' });

export const fetchReviews = createAsyncThunk('reviews/fetch',
  async ({ vinylId = null } = {}) => {
    if (vinylId != null) return await getReviewsByVinyl(vinylId);
    const reviews = await getReviews();
    return { reviews, totalReviews: reviews.length,
      averageScore: reviews.length ? reviews.reduce((sum, review) => sum + Number(review.score), 0) / reviews.length : 0 };
  },
  { condition: ({ vinylId = null, replace = false } = {}, { getState }) =>
    replace || getState().reviews.queries[reviewsKey(vinylId)]?.status !== 'loading' });

export const fetchReviewEligibility = createAsyncThunk('reviews/fetchEligibility',
  async ({ vinylId }) => await getReviewEligibility(vinylId),
  { condition: ({ userId, vinylId, replace = false }, { getState }) => {
    const state = getState().reviews;
    return userId != null && String(userId) === String(state.ownerId) &&
      (replace || state.eligibility[eligibilityKey(userId, vinylId)]?.status !== 'loading');
  } });

// Solo se renuevan consultas utilizadas que contienen el vinilo modificado.
// Una recarga fallida muestra su propio error: la escritura ya fue confirmada.
const refreshQueries = (vinylId, api) => {
  const state = api.getState().reviews;
  const requests = [];
  for (const key of ['all', reviewsKey(vinylId)]) {
    if (state.queries[key]) requests.push(api.dispatch(fetchReviews({ vinylId: key === 'all' ? null : vinylId, force: true, replace: true })));
  }
  if (state.ownerId != null && state.eligibility[eligibilityKey(state.ownerId, vinylId)]) {
    requests.push(api.dispatch(fetchReviewEligibility({ userId: state.ownerId, vinylId, force: true, replace: true })));
  }
  if (state.status === 'loading') requests.push(api.dispatch(fetchMyReviews({ force: true, replace: true })));
  return Promise.all(requests);
};

export const createReview = createAsyncThunk('reviews/create',
  async (review, api) => {
    const saved = await createReviewRequest(review);
    if (api.getState().reviews.submitRequestId === api.requestId) {
      api.dispatch(reviewsSlice.actions.reviewSaved({ review: saved, requestId: api.requestId, creating: true }));
      await refreshQueries(saved.vinylId, api);
    }
    return saved;
  },
  { condition: (_, { getState }) => getState().reviews.submittingVinylId == null });

const canMutate = ({ reviewId }, { getState }) =>
  getState().reviews.mutations[reviewId]?.status !== 'loading';

export const updateReview = createAsyncThunk('reviews/update',
  async ({ reviewId, score, comment }, api) => {
    const saved = await updateReviewRequest(reviewId, { score, comment });
    if (api.getState().reviews.mutations[reviewId]?.requestId === api.requestId) {
      api.dispatch(reviewsSlice.actions.reviewSaved({ review: saved, requestId: api.requestId }));
      await refreshQueries(saved.vinylId, api);
    }
    return saved;
  },
  { condition: canMutate });

export const deleteReview = createAsyncThunk('reviews/delete',
  async ({ reviewId, vinylId }, api) => {
    await deleteReviewRequest(reviewId);
    const removed = { id: reviewId, vinylId };
    if (api.getState().reviews.mutations[reviewId]?.requestId === api.requestId) {
      api.dispatch(reviewsSlice.actions.reviewSaved({ review: removed, removed: true, requestId: api.requestId }));
      await refreshQueries(vinylId, api);
    }
    return removed;
  },
  { condition: canMutate });


const initialState = {
  // requestId descarta respuestas de otra sesión o solicitudes reemplazadas.
  // Las versiones evitan que una lectura antigua reviva una reseña eliminada.
  entities: {}, queries: {}, eligibility: {}, mutations: {}, ownerId: null,
  myReviews: [], status: 'idle', fetchRequestId: null, fetchVersion: 0, error: '',
  version: 0, entityVersions: {},
  submittingVinylId: null, submitRequestId: null
};
const sameId = (left, right) => String(left) === String(right);
const emptyQuery = { status: 'idle', error: '', ids: [], averageScore: 0, totalReviews: 0 };
const emptyEligibility = { status: 'idle', error: '', data: null };
const getError = action => action.error.message || '';
const clearPrivateState = state => {
  state.myReviews = [];
  state.status = 'idle';
  state.fetchRequestId = null;
  state.error = '';
  state.submittingVinylId = null;
  state.submitRequestId = null;
  state.eligibility = {};
  state.mutations = {};
};
// Todas las vistas y "mis reseñas" apuntan a una única entidad por reseña.
const applyReview = (state, review, removed = false) => {
  state.entityVersions[review.id] = ++state.version;
  if (removed) {
    delete state.entities[review.id];
    state.myReviews = state.myReviews.filter(item => !sameId(item.id, review.id));
  } else {
    state.entities[review.id] = review;
    if (state.ownerId != null && sameId(state.ownerId, review.userId) && !state.myReviews.some(item => sameId(item.id, review.id))) {
      state.myReviews.push(review);
    }
  }
  state.myReviews = state.myReviews.map(item => state.entities[item.id]).filter(Boolean);
  for (const key of ['all', reviewsKey(review.vinylId)]) {
    const query = state.queries[key];
    if (!query) continue;
    if (removed) query.ids = query.ids.filter(id => !sameId(id, review.id));
    else if (!query.ids.some(id => sameId(id, review.id))) query.ids.unshift(review.id);
    updateStatistics(state, query);
  }
};

// Conserva las escrituras y lecturas más recientes entre las distintas páginas.
const mergeReviews = (state, reviews, version) => {
  for (const review of reviews) {
    if ((state.entityVersions[review.id] || 0) > version) continue;
    const previous = state.entities[review.id];
    state.entities[review.id] = review;
    state.entityVersions[review.id] = version;
    if (previous && Number(previous.score) !== Number(review.score)) {
      for (const query of Object.values(state.queries)) {
        if (query.ids.some(id => sameId(id, review.id))) updateStatistics(state, query);
      }
    }
  }
  state.myReviews = state.myReviews.map(item => state.entities[item.id]).filter(Boolean);
};
const reconcileIds = (state, reviews, version, matches) => {
  const ids = reviews.map(review => review.id).filter(id => state.entities[id]);
  for (const [id, updatedVersion] of Object.entries(state.entityVersions)) {
    if (updatedVersion <= version) continue;
    const review = state.entities[id];
    if (review && matches(review) && !ids.some(value => sameId(value, id))) ids.unshift(review.id);
  }
  return ids;
};
const updateStatistics = (state, query) => {
  query.totalReviews = query.ids.length;
  query.averageScore = query.ids.length
    ? query.ids.reduce((sum, id) => sum + Number(state.entities[id].score), 0) / query.ids.length : 0;
};

const reviewsSlice = createSlice({
  name: 'reviews', initialState,
  reducers: {
    reviewSaved(state, { payload }) {
      const { review, removed, requestId, creating } = payload;
      const currentId = creating ? state.submitRequestId : state.mutations[review.id]?.requestId;
      if (currentId === requestId) applyReview(state, review, removed);
    },
    resetReviews(state) {
      clearPrivateState(state);
      state.ownerId = null;
    },
    setReviewOwner(state, action) {
      if (state.ownerId === action.payload) return;
      clearPrivateState(state);
      state.ownerId = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchMyReviews.pending, (state, action) => {
      state.status = 'loading';
      state.fetchVersion = ++state.version;
      state.fetchRequestId = action.meta.requestId;
      state.error = '';
    }).addCase(fetchMyReviews.fulfilled, (state, action) => {
      if (state.fetchRequestId !== action.meta.requestId) return;
      mergeReviews(state, action.payload, state.fetchVersion);
      state.myReviews = reconcileIds(state, action.payload, state.fetchVersion,
        review => sameId(review.userId, state.ownerId)).map(id => state.entities[id]);
      state.status = 'succeeded';
      state.fetchRequestId = null;
    }).addCase(fetchMyReviews.rejected, (state, action) => {
      if (state.fetchRequestId !== action.meta.requestId) return;
      state.status = 'failed';
      state.error = `No se pudieron cargar tus reseñas: ${getError(action)}`;
      state.fetchRequestId = null;
    }).addCase(fetchReviews.pending, (state, action) => {
      const key = reviewsKey(action.meta.arg && action.meta.arg.vinylId);
      state.queries[key] = { ...(state.queries[key] || emptyQuery), status: 'loading', error: '', requestId: action.meta.requestId, version: ++state.version };
    }).addCase(fetchReviews.fulfilled, (state, action) => {
      const query = state.queries[reviewsKey(action.meta.arg && action.meta.arg.vinylId)];
      if (query.requestId !== action.meta.requestId) return;
      const vinylId = action.meta.arg?.vinylId;
      mergeReviews(state, action.payload.reviews, query.version);
      query.ids = reconcileIds(state, action.payload.reviews, query.version,
        review => vinylId == null || sameId(review.vinylId, vinylId));
      query.averageScore = action.payload.averageScore;
      query.totalReviews = action.payload.totalReviews;
      if (query.ids.length !== action.payload.reviews.length || action.payload.reviews.some(review =>
        state.entities[review.id] !== undefined && state.entities[review.id].score !== review.score)) {
        updateStatistics(state, query);
      }
      query.status = 'succeeded';
    }).addCase(fetchReviews.rejected, (state, action) => {
      const query = state.queries[reviewsKey(action.meta.arg && action.meta.arg.vinylId)];
      if (!query || query.requestId !== action.meta.requestId) return;
      query.status = 'failed';
      query.error = getError(action);
    }).addCase(fetchReviewEligibility.pending, (state, action) => {
      const { userId, vinylId } = action.meta.arg;
      state.eligibility[eligibilityKey(userId, vinylId)] = { status: 'loading', error: '', data: null, requestId: action.meta.requestId, version: ++state.version };
    }).addCase(fetchReviewEligibility.fulfilled, (state, action) => {
      const { userId, vinylId } = action.meta.arg;
      const request = state.eligibility[eligibilityKey(userId, vinylId)];
      if (!request || request.requestId !== action.meta.requestId || !sameId(state.ownerId, userId)) return;
      const { review, ...data } = action.payload;
      if (review) mergeReviews(state, [review], request.version);
      request.data = { ...data, reviewId: review ? review.id : null };
      request.status = 'succeeded';
    }).addCase(fetchReviewEligibility.rejected, (state, action) => {
      const { userId, vinylId } = action.meta.arg;
      const request = state.eligibility[eligibilityKey(userId, vinylId)];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'failed';
      request.error = getError(action);
    }).addCase(createReview.pending, (state, action) => {
      state.submittingVinylId = action.meta.arg.vinylId;
      state.submitRequestId = action.meta.requestId;
      state.error = '';
    }).addCase(createReview.fulfilled, (state, action) => {
      if (state.submitRequestId !== action.meta.requestId) return;
      state.submittingVinylId = null;
      state.submitRequestId = null;
    }).addCase(createReview.rejected, (state, action) => {
      if (state.submitRequestId !== action.meta.requestId) return;
      state.error = `No se pudo guardar la reseña: ${getError(action)}`;
      state.submittingVinylId = null;
      state.submitRequestId = null;
    });
    builder.addCase(updateReview.pending, (state, action) => {
      state.mutations[action.meta.arg.reviewId] = { status: 'loading', error: '', requestId: action.meta.requestId };
    }).addCase(updateReview.fulfilled, (state, action) => {
      const request = state.mutations[action.meta.arg.reviewId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'succeeded';
    }).addCase(updateReview.rejected, (state, action) => {
      const request = state.mutations[action.meta.arg.reviewId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'failed';
      request.error = getError(action);
    });
    builder.addCase(deleteReview.pending, (state, action) => {
      state.mutations[action.meta.arg.reviewId] = { status: 'loading', error: '', requestId: action.meta.requestId };
    }).addCase(deleteReview.fulfilled, (state, action) => {
      const request = state.mutations[action.meta.arg.reviewId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'succeeded';
    }).addCase(deleteReview.rejected, (state, action) => {
      const request = state.mutations[action.meta.arg.reviewId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'failed';
      request.error = getError(action);
    });
  }
});

export const { resetReviews, setReviewOwner } = reviewsSlice.actions;
export const selectMyReviews = state => state.reviews.myReviews;
export const selectReviewsError = state => state.reviews.error;
export const selectSubmittingVinylId = state => state.reviews.submittingVinylId;
export const selectReviewQuery = (state, vinylId) => state.reviews.queries[reviewsKey(vinylId)] || emptyQuery;
export const selectReviewData = (state, vinylId) => {
  const query = selectReviewQuery(state, vinylId);
  return { ...query, reviews: query.ids.map(id => state.reviews.entities[id]).filter(Boolean) };
};
export const selectEligibility = (state, userId, vinylId) => {
  const request = state.reviews.eligibility[eligibilityKey(userId, vinylId)] || emptyEligibility;
  return { ...request, data: request.data ? {
    ...request.data, review: request.data.reviewId == null ? null : state.reviews.entities[request.data.reviewId]
  } : null };
};
export default reviewsSlice.reducer;
