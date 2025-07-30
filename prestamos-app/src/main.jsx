import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import { setupResponseInterceptor } from './api/axiosConfig';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Configurar el interceptor de respuestas
const AppWithAuth = () => {
  const navigate = (path) => {
    window.location.href = path;
  };

  // Configurar el interceptor con la función de navegación
  setupResponseInterceptor(navigate);

  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppWithAuth />
    </BrowserRouter>
  </React.StrictMode>
);