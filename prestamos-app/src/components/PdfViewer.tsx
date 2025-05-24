import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateClientReportPdf } from '../api/pdfInfo';
import { FiDownload, FiX, FiFileText, FiLoader, FiAlertCircle } from 'react-icons/fi';

type PdfViewerProps = {
  clientId: string | number;
  clientName: string;
  onClose: () => void;
};

export const PdfViewer = ({ clientId, clientName, onClose }: PdfViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        const pdfBlob = await generateClientReportPdf(clientId);
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('No se pudo cargar el reporte PDF. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [clientId]);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const pdfBlob = await generateClientReportPdf(clientId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${clientName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Error al descargar el archivo');
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
        setIsFullscreen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col ${
            isFullscreen ? 'w-full h-full max-w-none' : 'max-w-4xl w-full max-h-[90vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <FiFileText className="text-blue-400 text-xl" />
              <h2 className="text-lg font-semibold text-white">
                Reporte de {clientName}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                disabled={loading || !!error}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Descargar PDF"
              >
                {loading ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <FiDownload />
                )}
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreen ? '⤵️' : '⤴️'}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                title="Cerrar"
              >
                <FiX />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-gray-900 p-4">
            {loading && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <FiLoader className="animate-spin text-4xl text-blue-400" />
                <p>Cargando reporte...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center h-full text-red-400 space-y-4 p-8 text-center">
                <FiAlertCircle className="text-5xl" />
                <p className="text-xl font-medium">¡Ups! Algo salió mal</p>
                <p className="text-gray-400">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !error && pdfUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0`}
                  className="w-full h-full min-h-[70vh] rounded-lg border border-gray-800 bg-white"
                  title={`Reporte de ${clientName}`}
                />
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 text-center text-xs text-gray-500 border-t border-gray-800 bg-gray-900/80">
            <p>© {new Date().getFullYear()} Prestamos App - Generado el {new Date().toLocaleDateString()}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
