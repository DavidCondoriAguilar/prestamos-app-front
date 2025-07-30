import axios from './axiosConfig';
import API_URLS from '../config/apiConfig';

export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  rol: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  name: string;
  message?: string;
}

const login = async (request: AuthRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URLS.AUTH}/login`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true
      }
    );

    console.log('Respuesta del login:', response.data);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Guardar información del usuario en localStorage
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        name: response.data.name
      }));
    }
    
    return response.data;
  } catch (error: any) {
    let errorMessage = 'Error en la autenticación';
    
    if (error.response) {
      // El servidor respondió con un error
      if (error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      console.error('Error en la respuesta del servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else {
      // Error en la configuración de la solicitud
      console.error('Error al configurar la solicitud:', error.message);
      errorMessage = `Error de configuración: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
};

const register = async (request: RegisterRequest): Promise<AuthResponse> => {
  try {
    console.log('Sending registration request:', request);
    
    const response = await axios({
      method: 'post',
      url: `${API_URLS.AUTH}/register`,
      data: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true
    });

    console.log('Registration response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        name: response.data.nombre,
        apellidos: response.data.apellidos,
        rol: response.data.rol
      }));
    }
    return response.data;
  } catch (error: any) {
    let errorMessage = 'Error en el registro';
    
    if (error.response?.data) {
      errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      console.error('Error en la respuesta del servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else {
      console.error('Error al configurar la solicitud:', error.message);
      errorMessage = `Error de configuración: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
};

export const authApi = {
  login,
  register,
};

export default authApi;