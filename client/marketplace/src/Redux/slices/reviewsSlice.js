import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import {
  createReview as createReviewRequest, updateReview as updateReviewRequest,
  deleteReview as deleteReviewRequest, getMyReviews, getReviews, getReviewsByVinyl, getReviewEligibility
} from '../../services/api.js';
import { eligibilityKey, emptyRequest, getMessage, reviewsKey, shouldFetch } from '../requestState.js';

export const fetchMyReviews = createAsyncThunk('reviews/fetchMine',
  (_, { rejectWithValue }) => getMyReviews().catch(error => rejectWithValue(getMessage(error))),
  { condition: (options = {}, { getState }) => {
    const state = getState().reviews;
    if (state.status === 'loading' && !options.replace) return false;
    return options.force || state.status !== 'succeeded';
  } });

export const fetchReviews = createAsyncThunk('reviews/fetch',
  ({ vinylId = null } = {}, { rejectWithValue }) => {
    const request = vinylId == null
      ? getReviews().then(reviews => ({ reviews, totalReviews: reviews.length,
        averageScore: reviews.length ? reviews.reduce((sum, review) => sum + Number(review.score), 0) / reviews.length : 0 }))
      : getReviewsByVinyl(vinylId);
    return request.catch(error => rejectWithValue(getMessage(error)));
  },
  { condition: ({ vinylId = null, force = false, replace = false } = {}, { getState }) =>
    shouldFetch(getState().reviews.queries[reviewsKey(vinylId)], force, replace) });

export const fetchReviewEligibility = createAsyncThunk('reviews/fetchEligibility',
  ({ vinylId }, { rejectWithValue }) => getReviewEligibility(vinylId).catch(error => rejectWithValue(getMessage(error))),
  { condition: ({ userId, vinylId, force = false, replace = false }, { getState }) => {
    const state = getState().reviews;
    return userId != null && String(userId) === String(state.ownerId) &&
      shouldFetch(state.eligibility[eligibilityKey(userId, vinylId)], force, replace);
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
  (review, api) => createReviewRequest(review).then(saved =>
    refreshQueries(review.vinylId, api).then(() => saved)
  ).catch(error => api.rejectWithValue(getMessage(error))),
  { condition: (_, { getState }) => getState().reviews.submittingVinylId == null });

const canMutate = ({ reviewId }, { getState }) =>
  getState().reviews.mutations[reviewId]?.status !== 'loading';

export const updateReview = createAsyncThunk('reviews/update',
  ({ reviewId, vinylId, score, comment }, api) => updateReviewRequest(reviewId, { score, comment }).then(saved =>
    refreshQueries(vinylId, api).then(() => saved)
  ).catch(error => api.rejectWithValue(getMessage(error))),
  { condition: canMutate });

export const deleteReview = createAsyncThunk('reviews/delete',
  ({ reviewId, vinylId }, api) => deleteReviewRequest(reviewId).then(() =>
    refreshQueries(vinylId, api).then(() => ({ id: reviewId, vinylId }))
  ).catch(error => api.rejectWithValue(getMessage(error))),
  { condition: canMutate });

const initialState = {
  entities: {}, queries: {}, eligibility: {}, mutations: {}, ownerId: null,
  myReviewIds: [], status: 'idle', fetchRequestId: null, error: '',
  submittingVinylId: null, submitRequestId: null
};
const sameId = (left, right) => String(left) === String(right);
const emptyQuery = Object.freeze({ ...emptyRequest, ids: [], averageScore: 0, totalReviews: 0 });
const emptyEligibility = Object.freeze({ ...emptyRequest, data: null });
const getError = action => action.payload || action.error.message || '';
const clearPrivateState = state => {
  state.myReviewIds = [];
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
  if (removed) {
    delete state.entities[review.id];
    state.myReviewIds = state.myReviewIds.filter(id => !sameId(id, review.id));
  } else {
    state.entities[review.id] = review;
    if (state.ownerId != null && sameId(state.ownerId, review.userId) && !state.myReviewIds.some(id => sameId(id, review.id))) {
      state.myReviewIds.push(review.id);
    }
  }
  for (const key of ['all', reviewsKey(review.vinylId)]) {
    const query = state.queries[key];
    if (!query) continue;
    if (removed) query.ids = query.ids.filter(id => !sameId(id, review.id));
    else if (!query.ids.some(id => sameId(id, review.id))) query.ids.unshift(review.id);
    query.totalReviews = query.ids.length;
    query.averageScore = query.ids.length ? query.ids.reduce((sum, id) => sum + Number(state.entities[id].score), 0) / query.ids.length : 0;
  }
};

const reviewsSlice = createSlice({
  name: 'reviews', initialState,
  reducers: {
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
      state.fetchRequestId = action.meta.requestId;
      state.error = '';
    }).addCase(fetchMyReviews.fulfilled, (state, action) => {
      if (state.fetchRequestId !== action.meta.requestId) return;
      action.payload.forEach(review => { state.entities[review.id] = review; });
      state.myReviewIds = action.payload.map(review => review.id);
      state.status = 'succeeded';
      state.fetchRequestId = null;
    }).addCase(fetchMyReviews.rejected, (state, action) => {
      if (state.fetchRequestId !== action.meta.requestId) return;
      state.status = 'failed';
      state.error = `No se pudieron cargar tus reseñas: ${getError(action)}`;
      state.fetchRequestId = null;
    }).addCase(fetchReviews.pending, (state, action) => {
      const key = reviewsKey(action.meta.arg && action.meta.arg.vinylId);
      state.queries[key] = { ...(state.queries[key] || emptyQuery), status: 'loading', error: '', requestId: action.meta.requestId };
    }).addCase(fetchReviews.fulfilled, (state, action) => {
      const query = state.queries[reviewsKey(action.meta.arg && action.meta.arg.vinylId)];
      if (query.requestId !== action.meta.requestId) return;
      action.payload.reviews.forEach(review => { state.entities[review.id] = review; });
      query.ids = action.payload.reviews.map(review => review.id);
      query.averageScore = action.payload.averageScore;
      query.totalReviews = action.payload.totalReviews;
      query.status = 'succeeded';
      query.fetchedAt = Date.now();
    }).addCase(fetchReviews.rejected, (state, action) => {
      const query = state.queries[reviewsKey(action.meta.arg && action.meta.arg.vinylId)];
      if (!query || query.requestId !== action.meta.requestId) return;
      query.status = 'failed';
      query.error = getError(action);
    }).addCase(fetchReviewEligibility.pending, (state, action) => {
      const { userId, vinylId } = action.meta.arg;
      state.eligibility[eligibilityKey(userId, vinylId)] = { status: 'loading', error: '', data: null, requestId: action.meta.requestId };
    }).addCase(fetchReviewEligibility.fulfilled, (state, action) => {
      const { userId, vinylId } = action.meta.arg;
      const request = state.eligibility[eligibilityKey(userId, vinylId)];
      if (!request || request.requestId !== action.meta.requestId || !sameId(state.ownerId, userId)) return;
      const { review, ...data } = action.payload;
      if (review) state.entities[review.id] = review;
      request.data = { ...data, reviewId: review ? review.id : null };
      request.status = 'succeeded';
      request.fetchedAt = Date.now();
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
      applyReview(state, action.payload);
      state.submittingVinylId = null;
      state.submitRequestId = null;
    }).addCase(createReview.rejected, (state, action) => {
      if (state.submitRequestId !== action.meta.requestId) return;
      state.error = `No se pudo guardar la reseña: ${getError(action)}`;
      state.submittingVinylId = null;
      state.submitRequestId = null;
    });
    for (const thunk of [updateReview, deleteReview]) {
      builder.addCase(thunk.pending, (state, action) => {
        state.mutations[action.meta.arg.reviewId] = { status: 'loading', error: '', requestId: action.meta.requestId };
      }).addCase(thunk.fulfilled, (state, action) => {
        const request = state.mutations[action.meta.arg.reviewId];
        if (!request || request.requestId !== action.meta.requestId) return;
        applyReview(state, action.payload, thunk === deleteReview);
        request.status = 'succeeded';
      }).addCase(thunk.rejected, (state, action) => {
        const request = state.mutations[action.meta.arg.reviewId];
        if (!request || request.requestId !== action.meta.requestId) return;
        request.status = 'failed';
        request.error = getError(action);
      });
    }
  }
});

export const { resetReviews, setReviewOwner } = reviewsSlice.actions;
export const selectMyReviews = createSelector(
  [state => state.reviews.myReviewIds, state => state.reviews.entities],
  (ids, entities) => ids.map(id => entities[id]).filter(Boolean)
);
export const selectReviewByVinylId = id => state => selectMyReviews(state).find(review => sameId(review.vinylId, id));
export const selectReviewsError = state => state.reviews.error;
export const selectSubmittingVinylId = state => state.reviews.submittingVinylId;
export const selectReviewQuery = (state, vinylId) => state.reviews.queries[reviewsKey(vinylId)] || emptyQuery;
export const selectReviewData = createSelector(
  [selectReviewQuery, state => state.reviews.entities],
  (query, entities) => ({ ...query, reviews: query.ids.map(id => entities[id]).filter(Boolean) })
);
export const selectEligibility = createSelector(
  [(state, userId, vinylId) => state.reviews.eligibility[eligibilityKey(userId, vinylId)] || emptyEligibility,
    state => state.reviews.entities],
  (request, entities) => ({ ...request, data: request.data ? {
    ...request.data, review: request.data.reviewId == null ? null : entities[request.data.reviewId]
  } : null })
);
export default reviewsSlice.reducer;
