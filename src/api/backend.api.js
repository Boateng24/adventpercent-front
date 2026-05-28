import Cookies from "js-cookie";

const BASE = import.meta.env.VITE_API_BASE;

export const authBase           = `${BASE}/auth`;
export const songBase           = `${BASE}/songs`;
export const uploadBase         = `${BASE}/uploadsongs`;
export const adminBase          = `${BASE}/admin`;
export const playlistBase       = `${BASE}/playlists`;
export const favoritesBase      = `${BASE}/favorites`;
export const recentlyPlayedBase = `${BASE}/recently-played`;

export const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});