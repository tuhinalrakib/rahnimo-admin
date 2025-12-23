import axios from "axios";
import { store } from "@/lib/store";
import { setAccessToken, clearAuth, AUTH_STATUS, setAuthStatus } from "@/reduxSlice/authSlice";
import { setUser, clearUser, USER_STATUS, setUserStatus } from "@/reduxSlice/userSlice";
import { refresh as refreshAuth, logout as logoutService } from "@/services/authService";

/**
 * Create axios instance
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send cookies for refresh
});

/**
 * Refresh token state
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If refresh already in progress, queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      store.dispatch(setAuthStatus(AUTH_STATUS.LOADING));
      store.dispatch(setUserStatus( USER_STATUS.LOADING));

      return new Promise(async (resolve, reject) => {
        try {
          const data = await refreshAuth();

          if (!data?.accessToken || !data?.user) throw new Error("Refresh failed: No token or user");

          store.dispatch(setAccessToken(data.accessToken));
          store.dispatch(setUser(data.user));

          api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
          processQueue(null, data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          resolve(api(originalRequest));
        } catch (err) {
          processQueue(err, null);
          await logoutService().catch(() => {});
          store.dispatch(clearAuth());
          store.dispatch(clearUser());
          reject(err);
        } finally {
          isRefreshing = false;
          store.dispatch(setAuthStatus(AUTH_STATUS.IDLE));
          store.dispatch(setUserStatus(USER_STATUS.IDLE));
        }
      });
    }

    return Promise.reject(error);
  }
);

export default api;
