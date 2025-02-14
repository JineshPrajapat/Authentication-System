import axios from "axios";

const userApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

userApi.defaults.withCredentials = true;

userApi.interceptors.request.use(
  (config) => {
    // No need to add Authorization header manually; cookies will handle authentication
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userApi.interceptors.response.use(
  (response) => {
    // Process the response if needed, but no need to handle tokens here
    return response;
  },
  async (error) => {
    const originalRequest = error.config

    if (!originalRequest._retry) {
      originalRequest._retry = false;
    }

    console.log("originalRequest", originalRequest);

    // If we get a 401 Unauthorized error, try to refresh the tokens
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh tokens using the refresh endpoint
        await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refreshToken`,
          {},
          { withCredentials: true }
        );

        // Retry the original request after successfully refreshing tokens
        return userApi(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // window.location.href = "/register";

        // If refresh fails, handle logout or redirect to login as needed
      }
    }

    return Promise.reject(error);
  }
);

export default userApi;