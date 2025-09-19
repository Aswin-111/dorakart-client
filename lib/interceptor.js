import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Request interceptor is correct and needs no changes
instance.interceptors.request.use((config) => {
  if (config.url.includes("/admin/login")) return config;

  if (config.url.includes("/admin") || config.url.includes("products") || config.url.includes("categories") || config.url.includes("inventory")) {
    const token = localStorage.getItem("dorakart_admin_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  }

  const token = localStorage.getItem("dorakart_acc_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// The fix is adding one line to the Response Interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const originalUrl = error.config.url;

      // --- NEW EXCEPTION RULE ---
      // If the login attempt itself fails, just let the login page handle the error.
      // Do not trigger a global redirect.
      if (originalUrl.includes("/admin/login") || originalUrl.includes("/login")) {
        return Promise.reject(error);
      }

      // Check if the failed request was a protected admin route
      if (originalUrl.includes("/admin")) {
        localStorage.removeItem("dorakart_admin_token");
        window.location.href = "/admin/login";
      } else {
        // Handle it as a regular user authentication failure
        localStorage.removeItem("dorakart_acc_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;