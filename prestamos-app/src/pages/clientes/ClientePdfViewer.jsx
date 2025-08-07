import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { generateClientReportPdf } from '../../api/pdfInfo';
import { downloadPdf } from '../../api/pdfInfo';

const ClientePdfViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientName, setClientName] = useState('Cliente');

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Aquí podrías obtener el nombre del cliente desde una API si lo necesitas
        // const clienteData = await fetchClienteById(id);
        // setClientName(clienteData.nombre);
        
        const pdfBlob = await generateClientReportPdf(id);
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('No se pudo cargar el reporte PDF. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPdf();
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [id]);

  const handleDownload = async () => {
    try {
      const pdfBlob = await generateClientReportPdf(id);
      downloadPdf(pdfBlob, `reporte-cliente-${id}`);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Error al descargar el archivo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft />
            </motion.button>
            <h1 className="text-2xl font-bold">Reporte de Cliente {id}</h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            disabled={loading || !!error}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload className="mr-2" />
            Descargar PDF
          </motion.button>
        </div>
        
        {/* PDF Viewer */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700 h-[calc(100vh-8rem)]">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <FiLoader className="animate-spin text-4xl text-blue-400" />
              <p>Cargando reporte...</p>
            </div>
          )}
          
          {error && (
            <div className="flex flex-col items-center justify-center h-full text-red-400 space-y-4 p-8 text-center">
              <FiAlertCircle className="text-5xl" />
              <p className="text-xl font-semibold">Error al cargar el PDF</p>
              <p>{error}</p>
              <button 
                onClick={() => navigate(-1)}
                className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Volver
              </button>
            </div>
          )}
          
          {pdfUrl && !loading && !error && (
            <iframe 
              src={pdfUrl} 
              className="w-full h-full" 
              title={`Reporte de Cliente ${id}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientePdfViewer;