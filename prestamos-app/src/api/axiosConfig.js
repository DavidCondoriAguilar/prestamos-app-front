import axios from 'axios';

// Crear una instancia de axios con configuración base
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Importante para enviar cookies de autenticación
});

// Interceptor para agregar el token de autenticación a las solicitudes
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

// Interceptor para manejar respuestas de error
export const setupResponseInterceptor = (navigate) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Si el error es 401 (No autorizado), redirigir al login
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