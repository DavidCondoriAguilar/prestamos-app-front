// src/api/clienteApi.js
import axiosInstance from './axiosConfig';

const clienteApi = {
  // Obtener todos los clientes
  async getAll() {
    try {
      console.log('Fetching clients from:', axiosInstance.defaults.baseURL + '/clientes');
      const response = await axiosInstance.get('/clientes');
      console.log('Clients response:', response);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los clientes:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.baseURL + error.config?.url,
          method: error.config?.method
        }
      });
      throw error;
    }
  },

  // Crear un nuevo cliente
  async create(clienteData) {
    try {
      // Transformar los datos al formato esperado por el backend
      const payload = {
        nombre: clienteData.nombre,
        correo: clienteData.correo,
        cuenta: {
          numeroCuenta: clienteData.cuenta?.numeroCuenta || '',
          saldo: parseFloat(clienteData.cuenta?.saldo) || 0
        }
      };

      console.log('Enviando payload al backend:', JSON.stringify(payload, null, 2));

      const response = await axiosInstance.post('/clientes', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta del servidor:', response.data);
      return response.data;

    } catch (error) {
      // Loguear el error con más detalle para depuración
      console.error('Error detallado al crear el cliente:', error.response ? error.response.data : error.message);
      throw this.handleError(error);
    }
  },

  // Manejo de errores simplificado y robusto
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage;

      if (status === 400) {
        // Prioriza el mensaje de error más específico del backend
        if (data && data.error) {
          errorMessage = data.error; // Ej: "El número de cuenta ya está en uso"
        } else if (data && data.errors && typeof data.errors === 'object') {
          errorMessage = Object.values(data.errors).join('. ');
        } else if (data && data.message) {
          errorMessage = data.message;
        } else {
          errorMessage = 'Datos inválidos. Por favor, verifica la información.';
        }
      } else if (status === 401) {
        errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
      } else if (status === 404) {
        errorMessage = 'El recurso solicitado no fue encontrado.';
      } else if (status >= 500) {
        errorMessage = 'Error interno del servidor. Inténtalo de nuevo más tarde.';
      } else {
        errorMessage = `Ocurrió un error inesperado (código: ${status}).`;
      }

      return new Error(errorMessage);
    } else if (error.request) {
      return new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    } else {
      return new Error(error.message || 'Ocurrió un error al configurar la solicitud.');
    }
  }
};

export default clienteApi;