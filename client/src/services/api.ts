import axios from "axios";
import { TOKEN_KEY } from "../utils/auth";

export const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:3333/api").replace(
  /\/$/,
  ""
);

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
//       clearAuthToken();

//       if (window.location.pathname !== "/login") {
//         window.location.assign("/login");
//       }
//     }

//     return Promise.reject(error);
//   },
// );
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("❌ API ERROR");
    console.log("URL:", error.config?.url);
    console.log("STATUS:", error.response?.status);
    console.log("BODY:", error.response?.data);

    return Promise.reject(error);
  },
);
export default api;
