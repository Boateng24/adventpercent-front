import axios from "axios";
import { songBase } from "../api/backend.api";

export const fetchSongById = async (id, setSong) => {
  try {
    const response = await axios.get(`${songBase}/song/${id}`);
    setSong(response.data?.song);
    console.log("song response", response);
  } catch (err) {
    console.error("Error fetching song by ID:", err);
  }
};
