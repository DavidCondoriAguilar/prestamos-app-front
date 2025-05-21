// URL base del backend (puedes usar variables de entorno aquí)
const API_URLS = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
  CUENTAS: "/cuentas",
  CLIENTES: "/clientes",
  PRESTAMOS: "/prestamos",
  PAGOS: "/pagos",
};

export default API_URLS;
