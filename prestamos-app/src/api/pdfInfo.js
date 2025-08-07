import axios from './axiosConfig';

/**
 * Genera un informe PDF para un cliente específico
 * @param {number|string} clienteId - ID del cliente
 * @returns {Promise<Blob>} - Blob del PDF generado
 */
export const generateClientReportPdf = async (clienteId) => {
  try {
    const response = await axios.get(`/pdf/cliente/${clienteId}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });

    if (!response.data) {
      throw new Error('No se recibieron datos del servidor');
    }

    return response.data;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error;
  }
};

/**
 * Descarga un archivo PDF
 * @param {Blob} pdfBlob - Blob del PDF a descargar
 * @param {string} filename - Nombre del archivo
 */
export const downloadPdf = (pdfBlob, filename = 'documento') => {
  try {
    const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Limpieza
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    console.error('Error al descargar el PDF:', error);
    throw error;
  }
};

/**
 * Genera y descarga automáticamente un PDF para un cliente
 * @param {number|string} clienteId - ID del cliente
 * @param {string} clienteNombre - Nombre del cliente (opcional)
 */
export const generarYDescargarPDF = async (clienteId, clienteNombre = 'cliente') => {
  try {
    const pdfBlob = await generateClientReportPdf(clienteId);
    const filename = `reporte-${clienteNombre.replace(/\s+/g, '-').toLowerCase()}-${clienteId}`;
    downloadPdf(pdfBlob, filename);
    return true;
  } catch (error) {
    console.error('Error en generarYDescargarPDF:', error);
    throw error;
  }
};

export default {
  generateClientReportPdf,
  downloadPdf,
  generarYDescargarPDF
};
