// src/api/axiosInstance.js
import axios from 'axios';
import { auth } from '../firebaseConfig'; // Import auth

// Define your backend base URL - ** MAKE SURE PORT IS CORRECT (3001) **
const API_BASE_URL = 'http://localhost:3001/api'; // Your backend URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor: Attaches Firebase token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    console.log('[Axios Interceptor] Current Firebase User:', user ? user.email : 'None'); // Log user status

    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[Axios Interceptor] Token attached for URL:', config.url); // Log token attachment
      } catch (error) {
        console.error("[Axios Interceptor] Error getting ID token:", error);
      }
    } else {
       delete config.headers.Authorization;
       console.log("[Axios Interceptor] No user, sending without token for URL:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("[Axios Interceptor] Request error:", error); // Log request setup errors
    return Promise.reject(error);
  }
);
// Response Interceptor (Optional): Handle common errors like 401/403
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API Error Response:", error.response.status, error.response.data);
      if ((error.response.status === 401 || error.response.status === 403) && window.location.pathname !== '/') {
        // Handle unauthorized or forbidden errors (e.g., token expired/invalid)
        // Avoid infinite loops if already on login page
        console.warn("Unauthorized/Forbidden API access. Logging out.");
        // Example: Force logout - might need refinement depending on state management
        auth.signOut().catch(err => console.error("Interceptor logout failed:", err));
        // You might want to redirect or show a message
        // window.location.href = '/'; // Simple redirect
      }
    } else if (error.request) {
      console.error("API No Response Error:", error.request);
    } else {
      console.error('API Request Setup Error:', error.message);
    }
    // Return a rejected promise to allow components to catch the error too
    return Promise.reject(error);
  }
);


export default axiosInstance;