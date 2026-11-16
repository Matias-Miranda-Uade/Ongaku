import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createReview as createReviewRequest, updateReview as updateReviewRequest,
  deleteReview as deleteReviewRequest, getMyReviews, getReviews, getReviewsByVinyl, getReviewEligibility
} from '../../services/api.js';
import { eligibilityKey, emptyRequest, reviewsKey, shouldFetch } from '../requestState.js';

export const fetchMyReviews = createAsyncThunk('reviews/fetchMine',
  async () => getMyReviews(),
  { condition: (options = {}, { getState }) => {
    const state = getState().reviews;
    return shouldFetch(state, options.force, options.replace);
  } });

export const fetchReviews = createAsyncThunk('reviews/fetch',
  async ({ vinylId = null } = {}) => {
    const request = vinylId == null
      ? getReviews().then(reviews => ({ reviews, totalReviews: reviews.length,
        averageScore: reviews.length ? reviews.reduce((sum, review) => sum + Number(review.score), 0) / reviews.length : 0 }))
      : getReviewsByVinyl(vinylId);
    return request;
  },
  { condition: ({ vinylId = null, force = false, replace = false } = {}, { getState }) =>
    shouldFetch(getState().reviews.queries[reviewsKey(vinylId)], force, replace) });

export const fetchReviewEligibility = createAsyncThunk('reviews/fetchEligibility',
  async ({ vinylId }) => getReviewEligibility(vinylId),
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

// Aplica la escritura confirmada antes de recargar y descarta respuestas de otra sesión.
const confirmReview = async (review, removed, api, creating = false) => {
  const state = api.getState().reviews;
  const requestId = creating ? state.submitRequestId : state.mutations[review.id]?.requestId;
  if (requestId !== api.requestId) return review;
  api.dispatch(reviewsSlice.actions.reviewSaved({ review, removed, requestId, creating }));
  await refreshQueries(review.vinylId, api);
  return review;
};

export const createReview = createAsyncThunk('reviews/create',
  async (review, api) => {
    const saved = await createReviewRequest(review);
    return confirmReview(saved, false, api, true);
  },
  { condition: (_, { getState }) => getState().reviews.submittingVinylId == null });

const canMutate = ({ reviewId }, { getState }) =>
  getState().reviews.mutations[reviewId]?.status !== 'loading';

export const updateReview = createAsyncThunk('reviews/update',
  async ({ reviewId, score, comment }, api) => {
    const saved = await updateReviewRequest(reviewId, { score, comment });
    return confirmReview(saved, false, api);
  },
  { condition: canMutate });

export const deleteReview = createAsyncThunk('reviews/delete',
  async ({ reviewId, vinylId }, api) => {
    await deleteReviewRequest(reviewId);
    return confirmReview({ id: reviewId, vinylId }, true, api);
  },
  { condition: canMutate });

const initialState = {
  items: [], queries: {}, eligibility: {}, mutations: {}, ownerId: null,
  myReviewIds: [], status: 'idle', fetchRequestId: null, fetchedAt: 0, fetchVersion: 0, error: '',
  version: 0, entityVersions: {},
  submittingVinylId: null, submitRequestId: null
};
const sameId = (left, right) => String(left) === String(right);
const emptyQuery = Object.freeze({ ...emptyRequest, ids: [], averageScore: 0, totalReviews: 0 });
const emptyEligibility = Object.freeze({ ...emptyRequest, data: null });
const getError = action => action.error.message || '';
const clearPrivateState = state => {
  state.myReviewIds = [];
  state.status = 'idle';
  state.fetchRequestId = null;
  state.fetchedAt = 0;
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
    state.items = state.items.filter(item => !sameId(item.id, review.id));
    state.myReviewIds = state.myReviewIds.filter(id => !sameId(id, review.id));
  } else {
    const index = state.items.findIndex(item => sameId(item.id, review.id));
    if (index === -1) state.items.push(review);
    else state.items[index] = review;
    if (state.ownerId != null && sameId(state.ownerId, review.userId) && !state.myReviewIds.some(id => sameId(id, review.id))) {
      state.myReviewIds.push(review.id);
    }
  }
  for (const key of ['all', reviewsKey(review.vinylId)]) {
    const query = state.queries[key];
    if (!query) continue;
    if (removed) query.ids = query.ids.filter(id => !sameId(id, review.id));
    else if (!query.ids.some(id => sameId(id, review.id))) query.ids.unshift(review.id);
    updateStatistics(state, query);
  }
};

// Una lectura anterior no debe sobrescribir cambios ni revivir reseñas eliminadas.
const mergeReviews = (state, reviews, version) => {
  for (const review of reviews) {
    if ((state.entityVersions[review.id] || 0) > version) continue;
    const previous = state.items.find(item => sameId(item.id, review.id));
    const index = state.items.findIndex(item => sameId(item.id, review.id));
    if (index === -1) state.items.push(review);
    else state.items[index] = review;
    state.entityVersions[review.id] = version;
    if (previous && Number(previous.score) !== Number(review.score)) {
      for (const query of Object.values(state.queries)) {
        if (query.ids.some(id => sameId(id, review.id))) updateStatistics(state, query);
      }
    }
  }
};
const reconcileIds = (state, reviews, version, matches) => {
  const ids = reviews.map(review => review.id).filter(id => state.items.find(item => sameId(item.id, id)));
  for (const [id, updatedVersion] of Object.entries(state.entityVersions)) {
    if (updatedVersion <= version) continue;
    const review = state.items.find(item => sameId(item.id, id));
    if (review && matches(review) && !ids.some(value => sameId(value, id))) ids.unshift(review.id);
  }
  return ids;
};
const updateStatistics = (state, query) => {
  query.totalReviews = query.ids.length;
  query.averageScore = query.ids.length
    ? query.ids.reduce((sum, id) => sum + Number(state.items.find(item => sameId(item.id, id)).score), 0) / query.ids.length : 0;
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
      state.myReviewIds = reconcileIds(state, action.payload, state.fetchVersion,
        review => sameId(review.userId, state.ownerId));
      state.fetchedAt = Date.now();
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
        state.items.find(item => sameId(item.id, review.id)) !== undefined && state.items.find(item => sameId(item.id, review.id)).score !== review.score)) {
        updateStatistics(state, query);
      }
      query.status = 'succeeded';
      query.fetchedAt = Date.now();
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
    });
    builder.addCase(updateReview.fulfilled, (state, action) => {
      const request = state.mutations[action.meta.arg.reviewId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'succeeded';
    });
    builder.addCase(updateReview.rejected, (state, action) => {
      const request = state.mutations[action.meta.arg.reviewId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'failed';
      request.error = getError(action);
    });    builder.addCase(deleteReview.pending, (state, action) => {
      state.mutations[action.meta.arg.reviewId] = { status: 'loading', error: '', requestId: action.meta.requestId };
    });
    builder.addCase(deleteReview.fulfilled, (state, action) => {
      const request = state.mutations[action.meta.arg.reviewId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'succeeded';
    });
    builder.addCase(deleteReview.rejected, (state, action) => {
      const request = state.mutations[action.meta.arg.reviewId];
      if (!request || request.requestId !== action.meta.requestId) return;
      request.status = 'failed';
      request.error = getError(action);
    });
  }
});

export const { resetReviews, setReviewOwner } = reviewsSlice.actions;
export const selectMyReviews = state => state.reviews.myReviewIds
  .map(id => state.reviews.items.find(review => sameId(review.id, id)))
  .filter(Boolean);
export const selectReviewQuery = (state, vinylId) => state.reviews.queries[reviewsKey(vinylId)] || emptyQuery;
export const selectReviewData = (state, vinylId) => {
  const query = selectReviewQuery(state, vinylId);
  return { ...query, reviews: query.ids.map(id => state.reviews.items.find(review => sameId(review.id, id))).filter(Boolean) };
};
export const selectEligibility = (state, userId, vinylId) => {
  const request = state.reviews.eligibility[eligibilityKey(userId, vinylId)] || emptyEligibility;
  return { ...request, data: request.data ? {
    ...request.data, review: state.reviews.items.find(review => sameId(review.id, request.data.reviewId)) || null
  } : null };
};
export default reviewsSlice.reducer;
