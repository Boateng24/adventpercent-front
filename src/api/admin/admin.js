import axios from "axios";
import { adminBase, getAuthHeaders } from "../backend.api";

// Expected response: { songs: Song[] }
export const getPendingSongs = async () => {
  try {
    const response = await axios.get(`${adminBase}/songs/pending`, getAuthHeaders());
    return response.data?.songs || [];
  } catch (error) {
    console.error("Error fetching pending songs:", error);
    throw error;
  }
};

// Expected response: { message: string }
export const approveSong = async (songId) => {
  try {
    const response = await axios.patch(
      `${adminBase}/songs/${songId}/approve`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error approving song:", error);
    throw error;
  }
};

// Expected response: { message: string }
export const rejectSong = async (songId) => {
  try {
    const response = await axios.patch(
      `${adminBase}/songs/${songId}/reject`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting song:", error);
    throw error;
  }
};
