import React, { useState, useEffect } from "react";
import { FaSave, FaTimes, FaMoneyBillWave } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ModalRegistroPago = ({ isOpen, onClose, onPagoRegistrado, cargando, prestamoId }) => {
  const [monto, setMonto] = useState("");
  const [error, setError] = useState("");

  // Resetear el formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setMonto("");
      setError("");
    }
  }, [isOpen]);

  const handleGuardar = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!monto || isNaN(parseFloat(monto)) || parseFloat(monto) <= 0) {
      setError("Por favor, ingresa un monto válido mayor a cero.");
      return;
    }

    const montoNumerico = parseFloat(monto);
    if (montoNumerico <= 0) {
      setError("El monto debe ser mayor a cero.");
      return;
    }

    // Crear el objeto de pago con la fecha y hora actual exacta
    const ahora = new Date();
    const nuevoPago = { 
      montoPago: montoNumerico, 
      fecha: ahora.toISOString(), // Incluye fecha y hora en formato ISO
      fechaHora: ahora.getTime(), // Timestamp para ordenamiento
      prestamoId: prestamoId || 0
    };
    
    // Llamar a la función del padre para guardar el pago
    onPagoRegistrado(nuevoPago);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          
          <motion.div 
            className="relative w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 flex justify-between items-center border-b border-indigo-500/30">
              <div>
                <h2 className="text-xl font-bold text-white">Registrar Nuevo Pago</h2>
                <p className="text-indigo-100 text-sm mt-1">Ingrese los detalles del pago</p>
              </div>
              <button
                onClick={onClose}
                disabled={cargando}
                className="text-white/80 hover:text-white focus:outline-none p-1.5 hover:bg-white/10 rounded-full transition-all duration-200"
                aria-label="Cerrar"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="p-6">
              {error && (
                <motion.div 
                  className="mb-6 p-4 bg-red-900/30 text-red-200 text-sm rounded-lg border-l-4 border-red-500"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </motion.div>
              )}

              <div className="space-y-8">
                <div className="relative group">
                  <label 
                    htmlFor="monto" 
                    className="block text-sm font-medium text-gray-400 mb-2 ml-1 transition-all duration-200 group-focus-within:text-indigo-400"
                  >
                    Monto del Pago
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center pointer-events-none">
                      {/* <span className="text-gray-400 font-bold text-2xl ">S/</span> */}
                    </div>
                    <input
                      type="number"
                      id="monto"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      disabled={cargando}
                      className="flex-1 pl-16 pr-12 py-5 text-2xl bg-gray-800/50 border border-gray-700 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white font-bold placeholder-gray-500 transition-all duration-200 outline-none"
                      style={{ letterSpacing: '0.5px' }}
                      required
                    />
                    <div className="absolute right-4 text-gray-400">
                      <FaMoneyBillWave className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between px-1">
                    <span className="text-xs text-gray-500">Mínimo: S/ 0.01</span>
                    {monto && (
                      <span className="text-xs font-medium text-green-400">
                        Total: S/ {parseFloat(monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Detalles adicionales */}
                <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Detalles del préstamo
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>ID del Préstamo:</span>
                      <span className="font-mono text-indigo-300">#{prestamoId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Fecha de pago:</span>
                      <span className="text-gray-300">{new Date().toLocaleDateString('es-PE')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-700/50 flex flex-col sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
                <motion.button
                  type="submit"
                  disabled={cargando}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.5)'
                  }}
                  className={`w-full inline-flex justify-center items-center rounded-xl px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-lg hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ${
                    cargando ? 'opacity-80 cursor-not-allowed' : ''
                  }`}
                >
                  {cargando ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <FaSave className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Registrar Pago</span>
                    </>
                  )}
                </motion.button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={cargando}
                  className="px-6 py-3.5 w-full rounded-xl border border-gray-600 bg-transparent text-gray-300 font-medium hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalRegistroPago;