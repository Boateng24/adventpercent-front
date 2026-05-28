import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRecommendedSongs } from '../api/songs/songs';

const STALE_MS = 5 * 60 * 1000; // 5 minutes

export const fetchSongsPage = createAsyncThunk(
  'songs/fetchPage',
  async (page, { rejectWithValue }) => {
    try {
      const songs = await getRecommendedSongs(page);
      return { songs: songs || [], page };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
  {
    // Skip if already loading — prevents duplicate requests from scroll events
    condition: (_, { getState }) => !getState().songs.isLoading,
  }
);

export const isCacheFresh = (lastFetched) =>
  !!lastFetched && Date.now() - lastFetched < STALE_MS;

const songsSlice = createSlice({
  name: 'songs',
  initialState: {
    items: [],
    page: 1,
    hasMore: true,
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    resetSongs: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.lastFetched = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongsPage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSongsPage.fulfilled, (state, action) => {
        const { songs, page } = action.payload;
        state.isLoading = false;
        state.page = page;
        state.items = page === 1 ? songs : [...state.items, ...songs];
        state.hasMore = songs.length > 0;
        state.lastFetched = Date.now();
      })
      .addCase(fetchSongsPage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSongs } = songsSlice.actions;
export default songsSlice.reducer;
