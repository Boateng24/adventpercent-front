import { songBase, playlistBase, favoritesBase, recentlyPlayedBase, getAuthHeaders } from "../backend.api"
import axios from "axios"
import Cookies from "js-cookie"

const getUserIdFromToken = () => {
  const token = Cookies.get('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.id || payload.userId || null;
  } catch {
    return null;
  }
};

export const getRecommendedSongs = async (page) => {
  try {
    const response = await axios.get(`${songBase}/recommended?page=${page}`);
    return response.data?.data?.recommended
  } catch (error) {
    console.log(error)
  }
}

export const recordInteraction = async (songId, type) => {
  try {
    await axios.post(`${songBase}/interaction`, { songId, type });
  } catch (error) {
    console.error("Failed to record interaction:", error);
  }
};

export const getSongDetails = async (id) => {
  try {
    const response = await axios.get(`${songBase}/song/${id}`);
    return response.data?.song || null;
  } catch (error) {
    console.error("Error fetching song:", error);
    return null;
  }
};


export const getTrendingSongs = async (limit = 10) => {
  try {
    const response = await axios.get(`${songBase}/trending`, {
      params: { limit }
    });
    return response.data?.trendingSongs || [];
  } catch (error) {
    console.error("Error fetching trending songs:", error);
    return [];
  }
};


export const searchSongs = async (query) => {
  try {
    const response = await axios.get(`${songBase}/search`, {
      params: { q: query }
    });
    return response.data || [];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};


// GET /favorites?userId=xxx → [{ userId, songId, song: {...} }]
// Returns the nested song objects directly for use throughout the app.
export const getFavorites = async () => {
  const userId = getUserIdFromToken();
  if (!userId) return [];
  try {
    const response = await axios.get(`${favoritesBase}?userId=${userId}`, getAuthHeaders());
    const entries = response.data || [];
    return entries.map((entry) => entry.song ?? entry);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

// POST /favorites?userId=xxx  body: { songId }
export const addToFavorites = async (songId) => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("Not authenticated");
  try {
    const response = await axios.post(
      `${favoritesBase}?userId=${userId}`,
      { songId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

// DELETE /favorites/:songId?userId=xxx
export const removeFromFavorites = async (songId) => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("Not authenticated");
  try {
    await axios.delete(`${favoritesBase}/${songId}?userId=${userId}`, getAuthHeaders());
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

export const getPlaylists = async () => {
  const userId = getUserIdFromToken();
  if (!userId) return [];
  try {
    const response = await axios.get(`${playlistBase}?userId=${userId}`, getAuthHeaders());
    return response.data || [];
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

export const createPlaylist = async ({ name, description }) => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("Not authenticated");
  const response = await axios.post(
    `${playlistBase}?userId=${userId}`,
    { name, description },
    getAuthHeaders()
  );
  return response.data;
};

export const addSongToPlaylist = async (playlistId, songId) => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("Not authenticated");
  const response = await axios.post(
    `${playlistBase}/${playlistId}/songs?userId=${userId}`,
    { songId },
    getAuthHeaders()
  );
  return response.data;
};

// GET /recently-played?userId=xxx → [{ userId, songId, playedAt, song: {...} }]
export const getRecentlyPlayed = async () => {
  const userId = getUserIdFromToken();
  if (!userId) return [];
  try {
    const response = await axios.get(`${recentlyPlayedBase}?userId=${userId}`, getAuthHeaders());
    const entries = response.data || [];
    return entries.map((entry) => ({ ...entry.song, lastPlayed: entry.playedAt }));
  } catch (error) {
    console.error("Error fetching recently played:", error);
    throw error;
  }
};

// POST /recently-played?userId=xxx  body: { songId }
export const addRecentlyPlayed = async (songId) => {
  const userId = getUserIdFromToken();
  if (!userId || !songId) return;
  try {
    await axios.post(
      `${recentlyPlayedBase}?userId=${userId}`,
      { songId },
      getAuthHeaders()
    );
  } catch (error) {
    console.error("Error recording recently played:", error);
  }
};

// Expected response: { songs: Song[] }
export const getSongsByGenre = async (genre) => {
  try {
    const response = await axios.get(`${songBase}/genre/${genre}`);
    return response.data?.songs || [];
  } catch (error) {
    console.error("Error fetching genre songs:", error);
    throw error;
  }
};

// Fisher-Yates shuffle — returns a new array, does not mutate the input
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Returns shuffled songs of the same genre, excluding the seed song and any IDs in excludeIds.
// Falls back to recommended songs when the genre pool is too small.
export const getSimilarSongs = async (song, excludeIds = []) => {
  const excluded = new Set([song.id, ...excludeIds]);
  try {
    let pool = [];

    if (song.genre) {
      const genreSongs = await getSongsByGenre(song.genre);
      pool = genreSongs.filter(s => !excluded.has(s.id));
    }

    // Pad with recommended songs if the genre pool is thin (< 5)
    if (pool.length < 5) {
      try {
        const { data } = await axios.get(`${songBase}/recommended?page=1`);
        const recommended = data?.data?.recommended || [];
        const extra = recommended.filter(s => !excluded.has(s.id) && !pool.find(p => p.id === s.id));
        pool = [...pool, ...extra];
      } catch { /* ignore padding failure */ }
    }

    return shuffleArray(pool);
  } catch {
    return [];
  }
};

export default {getRecommendedSongs, getSongDetails, getTrendingSongs, recordInteraction, searchSongs, getFavorites, addToFavorites, removeFromFavorites, getPlaylists, createPlaylist, addSongToPlaylist, getRecentlyPlayed, addRecentlyPlayed, getSongsByGenre, getSimilarSongs};