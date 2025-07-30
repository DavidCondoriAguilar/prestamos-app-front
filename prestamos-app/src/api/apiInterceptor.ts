import API_URLS from '../config/apiConfig';

/**
 * Obtiene el token de autenticación del almacenamiento local
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Realiza una solicitud HTTP con autenticación
 * @param url URL de la solicitud
 * @param options Opciones de la solicitud
 * @returns Promesa con la respuesta
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  
  // Crear headers con valores por defecto
  const headers = new Headers(options.headers);
  
  // Establecer Content-Type a application/json si no está definido
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Agregar el token de autorización si existe
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Configuración de la solicitud
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include' as const, // Importante para incluir cookies
  };
  
  try {
    const response = await fetch(url, config);
    
    // Manejar respuesta no autorizada (401)
    if (response.status === 401) {
      // Limpiar datos de autenticación
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirigir a la página de login si no estamos ya en ella
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    }
    
    // Manejar otros errores HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Error en la solicitud: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return response;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error instanceof Error ? error : new Error('Error desconocido en la solicitud');
  }
};

/**
 * Crea una URL completa para la API
 * @param endpoint Endpoint de la API
 * @returns URL completa
 */
export const createApiUrl = (endpoint: string): string => {
  // Si la URL ya es absoluta, devolverla tal cual
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  // Asegurar que el endpoint comience con /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Combinar con la URL base
  return `${API_URLS.BASE_URL || ''}${normalizedEndpoint}`;
};

/**
 * Función de utilidad para realizar solicitudes GET
 */
export const get = async <T>(url: string): Promise<T> => {
  const response = await fetchWithAuth(url);
  return response.json();
};

/**
 * Función de utilidad para realizar solicitudes POST
 */
export const post = async <T>(url: string, data: any): Promise<T> => {
  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};

/**
 * Función de utilidad para realizar solicitudes PUT
 */
export const put = async <T>(url: string, data: any): Promise<T> => {
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
};

/**
 * Función de utilidad para realizar solicitudes DELETE
 */
export const del = async <T = void>(url: string): Promise<T> => {
  const response = await fetchWithAuth(url, {
    method: 'DELETE',
  });
  
  // Para respuestas vacías (204 No Content)
  if (response.status === 204) {
    return null as any;
  }
  
  return response.json();
};

export default {
  fetchWithAuth,
  getAuthToken,
  createApiUrl,
  get,
  post,
  put,
  delete: del,
};