import { createSlice } from '@reduxjs/toolkit';

const stamp = (song, index, ts) => ({ ...song, _queueId: `${song.id}-${index}-${ts}` });

const queueSlice = createSlice({
  name: 'queue',
  initialState: {
    items: [],
    currentIndex: -1,
    isPlaying: false,
    panelOpen: false,
    radioMode: false,
    radioSeedSong: null,
  },
  reducers: {
    // Replace the entire queue and start playing at startIndex
    setQueue: (state, action) => {
      const { items, startIndex = 0 } = action.payload;
      const ts = Date.now();
      state.items = items.map((s, i) => stamp(s, i, ts));
      state.currentIndex = startIndex;
      state.isPlaying = true;
      state.radioMode = false;
      state.radioSeedSong = null;
    },

    // Start a radio session from a seed song
    startRadio: (state, action) => {
      const { songs, seedSong } = action.payload;
      const ts = Date.now();
      state.items = songs.map((s, i) => stamp(s, i, ts));
      state.currentIndex = 0;
      state.isPlaying = true;
      state.panelOpen = false;
      state.radioMode = true;
      state.radioSeedSong = seedSong;
    },

    stopRadio: (state) => {
      state.radioMode = false;
      state.radioSeedSong = null;
    },

    togglePlayPause: (state) => {
      if (state.items.length === 0) return;
      state.isPlaying = !state.isPlaying;
    },

    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },

    goToNext: (state) => {
      if (state.items.length === 0) return;
      state.currentIndex =
        state.currentIndex < state.items.length - 1
          ? state.currentIndex + 1
          : 0;
      state.isPlaying = true;
    },

    goToPrevious: (state) => {
      if (state.items.length === 0) return;
      state.currentIndex =
        state.currentIndex > 0
          ? state.currentIndex - 1
          : state.items.length - 1;
      state.isPlaying = true;
    },

    jumpToSong: (state, action) => {
      state.currentIndex = action.payload;
      state.isPlaying = true;
    },

    addToQueue: (state, action) => {
      const song = stamp(action.payload, state.items.length, Date.now());
      if (state.currentIndex === -1) {
        state.items.push(song);
        state.currentIndex = state.items.length - 1;
        state.isPlaying = true;
      } else {
        state.items.push(song);
      }
    },

    playNext: (state, action) => {
      const song = { ...action.payload, _queueId: `${action.payload.id}-next-${Date.now()}` };
      if (state.currentIndex === -1) {
        state.items.unshift(song);
        state.currentIndex = 0;
        state.isPlaying = true;
      } else {
        state.items.splice(state.currentIndex + 1, 0, song);
      }
    },

    removeFromQueue: (state, action) => {
      const index = action.payload;
      state.items.splice(index, 1);

      if (state.items.length === 0) {
        state.currentIndex = -1;
        state.isPlaying = false;
      } else if (index < state.currentIndex) {
        state.currentIndex -= 1;
      } else if (index === state.currentIndex) {
        if (state.currentIndex >= state.items.length) {
          state.currentIndex = state.items.length - 1;
        }
        state.isPlaying = true;
      }
    },

    reorderQueue: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      if (fromIndex === toIndex) return;
      const [moved] = state.items.splice(fromIndex, 1);
      state.items.splice(toIndex, 0, moved);
      if (state.currentIndex === fromIndex) {
        state.currentIndex = toIndex;
      } else if (fromIndex < state.currentIndex && toIndex >= state.currentIndex) {
        state.currentIndex -= 1;
      } else if (fromIndex > state.currentIndex && toIndex <= state.currentIndex) {
        state.currentIndex += 1;
      }
    },

    clearQueue: (state) => {
      if (state.currentIndex >= 0 && state.items.length > 0) {
        const current = state.items[state.currentIndex];
        state.items = [current];
        state.currentIndex = 0;
        state.radioMode = false;
        state.radioSeedSong = null;
      }
    },

    togglePanel: (state) => {
      state.panelOpen = !state.panelOpen;
    },

    closePanel: (state) => {
      state.panelOpen = false;
    },

    closePlayer: (state) => {
      state.items = [];
      state.currentIndex = -1;
      state.isPlaying = false;
      state.panelOpen = false;
      state.radioMode = false;
      state.radioSeedSong = null;
    },
  },
});

export const {
  setQueue,
  startRadio,
  stopRadio,
  togglePlayPause,
  setIsPlaying,
  goToNext,
  goToPrevious,
  jumpToSong,
  addToQueue,
  playNext,
  removeFromQueue,
  reorderQueue,
  clearQueue,
  togglePanel,
  closePanel,
  closePlayer,
} = queueSlice.actions;

export default queueSlice.reducer;
