import { createSlice } from '@reduxjs/toolkit';
import { createReview, fetchMyReviews } from '../actions/reviewsActions';

const initialState = {
  myReviews: [],
  status: 'idle',
  fetchRequestId: null,
  error: '',
  submittingVinylId: null,
  submitRequestId: null,
  drafts: {}
};

const sameId = (left, right) => String(left) === String(right);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    resetReviews: () => initialState,
    setDraftScore(state, action) {
      const { vinylId, score } = action.payload;
      state.drafts[vinylId] = { ...state.drafts[vinylId], score, error: '' };
    },
    setDraftComment(state, action) {
      const { vinylId, comment } = action.payload;
      state.drafts[vinylId] = { ...state.drafts[vinylId], comment, error: '' };
    },
    setDraftError(state, action) {
      const { vinylId, error } = action.payload;
      state.drafts[vinylId] = { ...state.drafts[vinylId], error };
    },
    clearDraft(state, action) {
      delete state.drafts[action.payload];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMyReviews.pending, (state, action) => {
        state.status = 'loading';
        state.fetchRequestId = action.meta.requestId;
        state.error = '';
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;
        const reviewsByVinyl = new Map(action.payload.map(review => [String(review.vinylId), review]));
        state.myReviews.forEach(review => reviewsByVinyl.set(String(review.vinylId), review));
        state.myReviews = [...reviewsByVinyl.values()];
        state.status = 'succeeded';
        state.fetchRequestId = null;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;
        state.status = 'failed';
        state.error = `No se pudieron cargar tus reseñas: ${action.payload ?? action.error.message ?? ''}`;
        state.fetchRequestId = null;
      })
      .addCase(createReview.pending, (state, action) => {
        state.submittingVinylId = action.meta.arg.vinylId;
        state.submitRequestId = action.meta.requestId;
        state.error = '';
      })
      .addCase(createReview.fulfilled, (state, action) => {
        if (state.submitRequestId !== action.meta.requestId) return;
        const vinylId = action.meta.arg.vinylId;
        state.myReviews = [
          ...state.myReviews.filter(review => !sameId(review.vinylId, vinylId)),
          action.payload
        ];
        delete state.drafts[vinylId];
        state.submittingVinylId = null;
        state.submitRequestId = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        if (state.submitRequestId !== action.meta.requestId) return;
        state.error = `No se pudo guardar la reseña: ${action.payload ?? action.error.message ?? ''}`;
        state.submittingVinylId = null;
        state.submitRequestId = null;
      });
  }
});

export const { resetReviews, setDraftScore, setDraftComment, setDraftError, clearDraft } = reviewsSlice.actions;
export const selectMyReviews = state => state.reviews.myReviews;
export const selectReviewByVinylId = id => state => state.reviews.myReviews.find(review => sameId(review.vinylId, id));
export const selectReviewsError = state => state.reviews.error;
export const selectSubmittingVinylId = state => state.reviews.submittingVinylId;
export const selectReviewDraft = vinylId => state => state.reviews.drafts[vinylId] ?? { score: 0, comment: '', error: '' };

export default reviewsSlice.reducer;
