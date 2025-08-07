// src/components/pdf/PDFDownloadButton.jsx
import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { generarPDFCliente } from '../../api/pdfApi';
import { toast } from 'react-toastify';

const PDFDownloadButton = ({ clienteId, className = '', children }) => {
  const handleDownload = async () => {
    try {
      await generarPDFCliente(clienteId);
      toast.success('PDF generado correctamente');
    } catch (error) {
      toast.error('Error al generar el PDF');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors ${className}`}
      title="Descargar PDF"
    >
      <FaFilePdf className="text-white" />
      {children || <span>Descargar PDF</span>}
    </button>
  );
};

export default PDFDownloadButton;