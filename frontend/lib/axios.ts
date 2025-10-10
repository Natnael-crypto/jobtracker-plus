import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       if (typeof window !== "undefined") {
//         window.location.href = "/";
//       }
//     }
//     return Promise.reject(err);
//   }
// );

export default api;
