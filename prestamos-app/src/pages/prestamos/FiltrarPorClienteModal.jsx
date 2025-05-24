import React, { useState, useEffect, useRef } from "react";
import { obtenerPrestamosPorCliente } from "../../api/prestamoApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaTimes, FaUserAlt, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const FiltrarPorClienteModal = ({ isOpen, onClose, onFiltrado }) => {
  const [clienteId, setClienteId] = useState(""); // ID del cliente
  const [error, setError] = useState(""); // Mensajes de error

  // Función para manejar el filtrado
  const handleFiltrar = async () => {
    setError(""); // Limpiar errores previos

    const id = parseInt(clienteId, 10);
    if (!id || id <= 0) {
      setError("El ID del cliente debe ser un número válido mayor que cero.");
      return;
    }

    try {
      // Llamar al backend para obtener los préstamos del cliente
      const data = await obtenerPrestamosPorCliente(id);

      // Si no hay préstamos, mostrar una notificación
      if (data.length === 0) {
        toast.info(`No se encontraron préstamos para el cliente con ID ${id}.`);
      }

      // Notificar al padre con los resultados
      onFiltrado(data, id); // Pasamos el ID del cliente para mostrarlo en la tabla

      // Cerrar el modal
      onClose();
    } catch (error) {
      console.error("Error al filtrar préstamos:", error);
      setError("Hubo un error al filtrar los préstamos. Inténtalo de nuevo.");
    }
  };

  const modalRef = useRef(null);

  // Cerrar modal al presionar Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Cerrar al hacer clic fuera del modal
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-700/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Encabezado */}
            <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900/80">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 mr-3">
                    <FaUserAlt className="text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                      Filtrar Préstamos
                    </h2>
                    <p className="text-sm text-gray-400">Busca por ID de cliente</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-gray-700/50 transition-colors"
                  title="Cerrar"
                  aria-label="Cerrar modal"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Campo de búsqueda */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 mx-1 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFiltrar()}
                    //placeholder="Ejemplo: 123"
                    className="mx-5 block w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                    aria-label="ID del cliente"
                    autoFocus
                  />
                </div>

                {/* Mensaje de error */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start"
                  >
                    <div className="flex-1">{error}</div>
                  </motion.div>
                )}
              </div>

              {/* Pie del modal */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600/50 transition-colors flex items-center gap-2"
                >
                  <FaTimes className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  onClick={handleFiltrar}
                  disabled={!clienteId.trim()}
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    clienteId.trim()
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Buscar préstamos
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FiltrarPorClienteModal;