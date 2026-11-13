import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import * as api from '../../services/api.js';

const sessionAvailable = (_, { getState }) => getState().auth.sessionStatus !== 'loading';
const request = (type, operation, options) => createAsyncThunk(type, async (data, { rejectWithValue }) => {
  try {
    return await operation(data);
  } catch (error) {
    return rejectWithValue(error.message || 'No se pudo completar la solicitud.');
  }
}, options);

export const restoreSession = request('auth/restoreSession', async () => {
  if (!api.getAccessToken()) return null;
  try {
    return await api.getProfile();
  } catch (error) {
    api.clearAccessToken();
    throw error;
  }
}, { condition: (_, { getState }) => getState().auth.isRestoringSession && sessionAvailable(_, { getState }) });
export const login = request('auth/login', api.login, { condition: sessionAvailable });
export const register = request('auth/register', api.register, { condition: sessionAvailable });
export const logout = request('auth/logout', api.logout, { condition: sessionAvailable });
export const updateProfile = request('auth/updateProfile', api.updateProfile, {
  condition: (_, { getState }) => Boolean(getState().auth.user)
    && getState().auth.profileStatus !== 'loading' && sessionAvailable(_, { getState })
});

const initialState = {
  user: null,
  isRestoringSession: true,
  sessionStatus: 'idle',
  sessionRequestId: null,
  sessionError: '',
  loginError: '',
  registerError: '',
  profileStatus: 'idle',
  profileRequestId: null,
  profileError: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthErrors(state) {
      state.loginError = '';
      state.registerError = '';
      state.profileError = '';
    }
  },
  extraReducers: builder => {
    for (const thunk of [restoreSession, login, register, logout]) {
      builder.addCase(thunk.pending, (state, action) => {
        state.sessionStatus = 'loading';
        state.sessionRequestId = action.meta.requestId;
        state.sessionError = '';
        state.loginError = '';
        state.registerError = '';
        state.profileStatus = 'idle';
        state.profileRequestId = null;
        state.profileError = '';
        if (thunk === logout) state.user = null;
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        if (state.sessionRequestId !== action.meta.requestId) return;
        state.user = thunk === logout ? null : action.payload;
        state.sessionStatus = 'succeeded';
        state.sessionRequestId = null;
        state.isRestoringSession = false;
      });
      builder.addCase(thunk.rejected, (state, action) => {
        if (state.sessionRequestId !== action.meta.requestId) return;
        const error = action.payload || action.error.message;
        state.sessionStatus = 'failed';
        state.sessionRequestId = null;
        state.isRestoringSession = false;
        if (thunk === login) state.loginError = error;
        else if (thunk === register) state.registerError = error;
        else {
          state.user = null;
          state.sessionError = thunk === logout
            ? `No se pudo invalidar la sesi?n en el servidor: ${error}`
            : `No se pudo recuperar la sesi?n: ${error}`;
        }
      });
    }
    builder.addCase(updateProfile.pending, (state, action) => {
      state.profileStatus = 'loading';
      state.profileRequestId = action.meta.requestId;
      state.profileError = '';
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      if (state.profileRequestId !== action.meta.requestId) return;
      state.user = action.payload;
      state.profileStatus = 'succeeded';
      state.profileRequestId = null;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      if (state.profileRequestId !== action.meta.requestId) return;
      state.profileStatus = 'failed';
      state.profileError = action.payload || action.error.message;
      state.profileRequestId = null;
    });
  }
});

export const { clearAuthErrors } = authSlice.actions;
export const selectAuth = createSelector([state => state.auth], auth => ({
  ...auth,
  isAuthenticated: Boolean(auth.user),
  isAdmin: auth.user?.role === 'ADMIN'
}));
export default authSlice.reducer;
