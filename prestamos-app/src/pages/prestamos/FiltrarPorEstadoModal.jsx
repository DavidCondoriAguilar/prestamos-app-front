import React, { useState, useEffect } from "react";
import { obtenerPrestamosPorEstado, obtenerPrestamosPorCliente } from "../../api/prestamoApi";
import { FaFilter, FaTimes, FaUserAlt, FaSearch, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const modalVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: { opacity: 0, y: 20 }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

const FiltrarPorEstadoModal = ({ isOpen, onClose, onFiltrado }) => {
  const [estado, setEstado] = useState(""); // Estado seleccionado
  const [clienteId, setClienteId] = useState(""); // ID del cliente
  const [error, setError] = useState(""); // Mensajes de error

  // Función para manejar el filtrado
  const handleFiltrar = async () => {
    setError(""); // Limpiar errores previos

    // Validar que al menos un campo esté lleno
    if (!estado.trim() && !clienteId.trim()) {
      setError("Por favor, ingresa un estado o un ID de cliente válido.");
      return;
    }

    try {
      let data = [];

      // Filtrar por estado si se proporciona
      if (estado.trim()) {
        const prestamosPorEstado = await obtenerPrestamosPorEstado(estado);
        data = [...data, ...prestamosPorEstado];
      }

      // Filtrar por cliente si se proporciona un ID
      if (clienteId.trim()) {
        const clienteIdNum = parseInt(clienteId, 10);
        if (isNaN(clienteIdNum) || clienteIdNum <= 0) {
          setError("El ID del cliente debe ser un número válido mayor que cero.");
          return;
        }
        const prestamosPorCliente = await obtenerPrestamosPorCliente(clienteIdNum);
        data = [...data, ...prestamosPorCliente];
      }

      // Eliminar duplicados en los resultados combinados
      const resultadosUnicos = Array.from(new Set(data.map((p) => p.id))).map(
        (id) => data.find((p) => p.id === id)
      );

      // Notificar al padre con los resultados únicos
      onFiltrado(resultadosUnicos);

      // Cerrar el modal
      onClose();
    } catch (error) {
      console.error("Error al filtrar préstamos:", error);
      setError("Hubo un error al filtrar los préstamos. Inténtalo de nuevo.");
    }
  };

  // Close on Escape key press
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

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={modalVariants}
            className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900/80">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 mr-3">
                    <FaFilter className="text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                      Filtrar Préstamos
                    </h2>
                    <p className="text-sm text-gray-400">Aplica filtros para encontrar préstamos específicos</p>
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

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Estado del Préstamo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FaInfoCircle className="text-indigo-400" />
                    Estado del Préstamo
                  </label>
                  <span className="text-xs text-gray-500">Opcional</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    placeholder="Ej: PENDIENTE, APROBADO, PAGADO"
                    className="block w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Deja vacío para no filtrar por estado
                </p>
              </div>

              {/* ID del Cliente */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FaUserAlt className="text-indigo-400" />
                    ID del Cliente
                  </label>
                  <span className="text-xs text-gray-500">Opcional</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserAlt className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    placeholder="Ej: 123"
                    className="block w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Ingresa el ID numérico del cliente
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 pt-0">
              <div className="flex justify-between items-center">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600/50 transition-colors flex items-center gap-2"
                >
                  <FaTimes className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  onClick={handleFiltrar}
                  disabled={!estado.trim() && !clienteId.trim()}
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    estado.trim() || clienteId.trim()
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaFilter className="w-4 h-4" />
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FiltrarPorEstadoModal;