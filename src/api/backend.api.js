import Cookies from "js-cookie";

// export const authBase = "https://adventpercent.onrender.com/auth";
// export const songBase = "https://adventpercent.onrender.com/songs";
// export const uploadBase = "https://adventpercent.onrender.com/uploadsongs";
// export const adminBase = "https://adventpercent.onrender.com/admin";

export const authBase = "http://localhost:5000/auth";
export const songBase = "http://localhost:5000/songs";
export const uploadBase = "http://localhost:5000/uploadsongs"
export const adminBase = "http://localhost:5000/admin"

export const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});