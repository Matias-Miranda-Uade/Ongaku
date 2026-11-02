import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createReview as createReviewRequest, updateReview as updateReviewRequest,
  deleteReview as deleteReviewRequest, getMyReviews, getReviews, getReviewsByVinyl, getReviewEligibility
} from '../../services/api.js';
import { eligibilityKey, getMessage, reviewsKey, shouldFetch } from '../requestState.js';

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
