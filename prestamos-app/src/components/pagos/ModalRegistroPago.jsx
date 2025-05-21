import React, { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative border border-gray-100 overflow-hidden">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Registrar Nuevo Pago</h2>
          <button
            onClick={onClose}
            disabled={cargando}
            className="text-white/90 hover:text-white focus:outline-none p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleGuardar} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border-l-4 border-red-500">
              {error}
            </div>
          )}

          <div className="p-6 bg-gray-50">
            <label htmlFor="monto" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider text-indigo-700">
              Monto del Pago
            </label>
            <div className="relative rounded-lg shadow-sm border border-gray-300 bg-white hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-500 transition-all duration-200">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-700 font-bold text-xl">S/</span>
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
                className="block w-full pl-14 pr-6 py-5 text-xl border-0 focus:ring-0 bg-transparent text-gray-900 font-bold"
                style={{ letterSpacing: '0.5px' }}
                required
              />
            </div>
          </div>

          <div className="bg-white border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
            <button
              type="submit"
              disabled={cargando}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${
                cargando ? 'opacity-70 cursor-not-allowed' : ''
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
                  <FaSave className="h-4 w-4 mr-2" />
                  Registrar Pago
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={cargando}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegistroPago;