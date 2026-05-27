import { songBase, getAuthHeaders } from "../backend.api"
import axios from "axios"

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


// Expected response: { favorites: Song[] }
export const getFavorites = async () => {
  try {
    const response = await axios.get(`${songBase}/favorites`, getAuthHeaders());
    return response.data?.favorites || [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

// Expected response: { message: string }
export const addToFavorites = async (songId) => {
  try {
    const response = await axios.post(`${songBase}/favorites/${songId}`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

// Expected response: { message: string }
export const removeFromFavorites = async (songId) => {
  try {
    await axios.delete(`${songBase}/favorites/${songId}`, getAuthHeaders());
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

// Expected response: { playlists: Playlist[] }
export const getPlaylists = async () => {
  try {
    const response = await axios.get(`${songBase}/playlists`, getAuthHeaders());
    return response.data?.playlists || [];
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

// Expected response: { songs: Song[] }
export const getRecentlyPlayed = async () => {
  try {
    const response = await axios.get(`${songBase}/recently-played`, getAuthHeaders());
    return response.data?.songs || [];
  } catch (error) {
    console.error("Error fetching recently played:", error);
    throw error;
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

export default {getRecommendedSongs, getSongDetails, getTrendingSongs, recordInteraction, searchSongs, getFavorites, addToFavorites, removeFromFavorites, getPlaylists, getRecentlyPlayed, getSongsByGenre};