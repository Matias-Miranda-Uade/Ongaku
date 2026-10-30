import { createAsyncThunk } from '@reduxjs/toolkit';
import { createReview as createReviewRequest, getMyReviews } from '../../services/api';

const getMessage = error => error?.message ?? String(error);

export const fetchMyReviews = createAsyncThunk('reviews/fetchMine', async (_, { rejectWithValue }) => {
  try {
    return await getMyReviews();
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
}, {
  condition: (_, { getState }) => !['loading', 'succeeded'].includes(getState().reviews.status)
});

export const createReview = createAsyncThunk('reviews/create', async (review, { rejectWithValue }) => {
  try {
    return await createReviewRequest(review);
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
});
