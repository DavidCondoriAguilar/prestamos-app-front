import axios from 'axios';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
export const setupResponseInterceptor = (navigate) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized (token expired or invalid)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (navigate) {
          navigate('/login');
        } else {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;