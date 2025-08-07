import axios from './axiosConfig';
import { toast } from 'react-toastify';

/**
 * Genera y descarga un PDF para un cliente específico
 * @param {number|string} clienteId - ID del cliente
 * @returns {Promise<boolean>} - true si la operación fue exitosa
 */
export const generarPDFCliente = async (clienteId) => {
  try {
    const response = await axios.get(`/pdf/cliente/${clienteId}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf',

      }
    });

    if (!response.data) {
      throw new Error('No se recibieron datos del servidor');
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `reporte-cliente-${clienteId}-${timestamp}.pdf`;
    
    // Create a download link and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    
    // Append to body, trigger download, and clean up
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    
    // Manejo de errores específicos
    if (error.response) {
      // Error de autenticación
      if (error.response.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        // Redirigir al login o refrescar el token
        window.location.href = '/login';
        return false;
      }
      
      // Error de autorización
      if (error.response.status === 403) {
        toast.error('No tienes permiso para acceder a este recurso');
        return false;
      }
      
      // Error de servidor
      if (error.response.status >= 500) {
        toast.error('Error en el servidor. Por favor, inténtalo más tarde.');
        return false;
      }
    }
    
    // Error de red o desconocido
    if (error.message === 'Network Error') {
      toast.error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      toast.error('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
    
    throw error;
  }
};