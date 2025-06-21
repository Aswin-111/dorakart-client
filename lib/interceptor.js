
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000", // Replace with your actual base URL
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("dorakart_acc_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});











instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("dorakart_acc_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
)

export default instance;
