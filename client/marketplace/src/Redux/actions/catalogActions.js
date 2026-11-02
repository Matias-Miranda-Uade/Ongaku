import { createAsyncThunk } from '@reduxjs/toolkit';
import { getVinyls, getVinylById } from '../../services/api.js';
import { getMessage, shouldFetch } from '../requestState.js';

export const fetchVinyls = createAsyncThunk('catalog/fetch',
  (_, { rejectWithValue }) => getVinyls().catch(error => rejectWithValue(getMessage(error))),
  { condition: (options = {}, { getState }) => shouldFetch(getState().catalog.list, options.force) });

export const fetchVinylById = createAsyncThunk('catalog/fetchById',
  ({ vinylId }, { rejectWithValue }) => getVinylById(vinylId).catch(error => rejectWithValue(getMessage(error))),
  { condition: ({ vinylId, force = false }, { getState }) => shouldFetch(getState().catalog.details[vinylId], force) });
