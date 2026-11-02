import { createSelector, createSlice } from '@reduxjs/toolkit';
import { createReview, fetchMyReviews, fetchReviews, fetchReviewEligibility, updateReview, deleteReview } from '../actions/reviewsActions.js';
import { eligibilityKey, emptyRequest, reviewsKey } from '../requestState.js';

const initialState = {
  entities: {}, queries: {}, eligibility: {}, mutations: {}, ownerId: null,
  myReviewIds: [], status: 'idle', fetchRequestId: null, error: '',
  submittingVinylId: null, submitRequestId: null, drafts: {}
};
const sameId = (left, right) => String(left) === String(right);
const emptyQuery = Object.freeze({ ...emptyRequest, ids: [], averageScore: 0, totalReviews: 0 });
const emptyEligibility = Object.freeze({ ...emptyRequest, data: null });
const emptyDraft = Object.freeze({ score: 0, comment: '', error: '' });
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
  state.drafts = {};
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
    setDraftScore(state, action) {
      const { vinylId, score } = action.payload;
      state.drafts[vinylId] = { ...emptyDraft, ...state.drafts[vinylId], score, error: '' };
    },
    setDraftComment(state, action) {
      const { vinylId, comment } = action.payload;
      state.drafts[vinylId] = { ...emptyDraft, ...state.drafts[vinylId], comment, error: '' };
    },
    setDraftError(state, action) {
      const { vinylId, error } = action.payload;
      state.drafts[vinylId] = { ...emptyDraft, ...state.drafts[vinylId], error };
    },
    clearDraft(state, action) { delete state.drafts[action.payload]; }
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
      delete state.drafts[action.meta.arg.vinylId];
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

export const { resetReviews, setReviewOwner, setDraftScore, setDraftComment, setDraftError, clearDraft } = reviewsSlice.actions;
export const selectMyReviews = createSelector(
  [state => state.reviews.myReviewIds, state => state.reviews.entities],
  (ids, entities) => ids.map(id => entities[id]).filter(Boolean)
);
export const selectReviewByVinylId = id => state => selectMyReviews(state).find(review => sameId(review.vinylId, id));
export const selectReviewsError = state => state.reviews.error;
export const selectSubmittingVinylId = state => state.reviews.submittingVinylId;
export const selectReviewDraft = vinylId => state => state.reviews.drafts[vinylId] || emptyDraft;
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
