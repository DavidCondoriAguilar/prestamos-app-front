// API base configuration
const API_URLS = {
  // In development, these will be prefixed with /api and proxied to the backend
  // In production, they will use the VITE_API_BASE_URL from environment variables
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  CUENTAS: "/api/cuentas",
  CLIENTES: "/api/clientes",
  PRESTAMOS: "/api/prestamos",
  PAGOS: "/api/pagos",
  AUTH: "/api/auth",
};

export default API_URLS;
