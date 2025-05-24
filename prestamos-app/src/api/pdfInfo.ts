// Update this URL to match your Spring Boot backend URL
const API_BASE_URL = 'http://localhost:8080'; // Replace with your actual API URL if different

/**
 * Fetches a PDF report for a specific client
 * @param clientId - The ID of the client to generate the report for
 * @returns A Promise that resolves to a Blob containing the PDF data
 */
export const generateClientReportPdf = async (clientId: string | number): Promise<Blob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pdf/cliente/${clientId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you're using token-based auth
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al generar el reporte PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

/**
 * Opens the PDF in a new browser tab
 * @param pdfBlob - The PDF data as a Blob
 */
export const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
  // Clean up the URL object when the window is closed
  window.URL.revokeObjectURL(pdfUrl);
};

/**
 * Downloads the PDF file
 * @param pdfBlob - The PDF data as a Blob
 * @param fileName - The name to give the downloaded file (without extension)
 */
export const downloadPdf = (pdfBlob: Blob, fileName: string): void => {
  const url = window.URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Example usage:
/*
// In your React component:
import { generateClientReportPdf, openPdfInNewTab, downloadPdf } from './api/pdfInfo';

// To generate and open the PDF in a new tab:
const handleViewPdf = async (clientId) => {
  try {
    const pdfBlob = await generateClientReportPdf(clientId);
    openPdfInNewTab(pdfBlob);
  } catch (error) {
    // Handle error (e.g., show error message to user)
    console.error('Failed to generate PDF:', error);
  }
};

// To generate and download the PDF:
const handleDownloadPdf = async (clientId, clientName) => {
  try {
    const pdfBlob = await generateClientReportPdf(clientId);
    downloadPdf(pdfBlob, `reporte-${clientName}`);
  } catch (error) {
    // Handle error
    console.error('Failed to download PDF:', error);
  }
};
*/