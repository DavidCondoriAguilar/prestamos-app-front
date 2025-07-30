import { createContext, useState, useContext } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authApi.login({ username, password });
      
      const userData = { 
        username: response.username, 
        name: response.name 
      };
      
      setUser(userData);
      setToken(response.token);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.token);
      
      return true;
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.message.includes('401') || error.message.toLowerCase().includes('credenciales')) {
        errorMessage = 'Usuario o contraseña incorrectos';
      } else if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else {
        errorMessage = error.message || 'Error al iniciar sesión';
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authApi.register(userData);
      
      const userResponse = { 
        username: response.username, 
        name: response.nombre,
        apellidos: response.apellidos,
        rol: response.rol
      };
      
      setUser(userResponse);
      setToken(response.token);
      
      localStorage.setItem('user', JSON.stringify(userResponse));
      localStorage.setItem('token', response.token);
      
      return true;
    } catch (error) {
      console.error('Error en el registro:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error en el registro';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      login, 
      register,
      logout, 
      error,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;