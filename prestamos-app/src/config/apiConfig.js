// In development, we use the Vite proxy to avoid CORS issues
// In production, we'll use the environment variable
const BASE_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_BASE_URL 
  : ''; // Empty string means relative to the current domain

const API_URLS = {
  BASE_URL,
  CUENTAS: "/cuentas",
  CLIENTES: "/clientes",
  PRESTAMOS: "/prestamos",
  PAGOS: "/pagos",
  AUTH: "/auth",  
};

export default API_URLS;
