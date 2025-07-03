import { songBase } from "../backend.api"
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


export default {getRecommendedSongs, getSongDetails, getTrendingSongs, recordInteraction, searchSongs};