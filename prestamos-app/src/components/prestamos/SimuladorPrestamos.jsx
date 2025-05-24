import React, { useState, useEffect } from "react";
import { FaCalculator, FaDollarSign, FaCalendarAlt, FaPercentage, FaChartLine } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const SimuladorPrestamos = () => {
  const [monto, setMonto] = useState("");
  const [interes, setInteres] = useState("");
  const [plazo, setPlazo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const calcularCuota = () => {
    if (!monto || !interes || !plazo) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    const montoNumerico = parseFloat(monto);
    const interesNumerico = parseFloat(interes) / 100 / 12; // Tasa mensual
    const plazoNumerico = parseInt(plazo);

    if (montoNumerico <= 0 || isNaN(interesNumerico) || plazoNumerico <= 0) {
      toast.error("Ingresa valores válidos mayores que cero.");
      return;
    }

    setIsCalculating(true);
    setShowResults(false);

    // Simular carga para mejor experiencia de usuario
    setTimeout(() => {
      // Fórmula para calcular la cuota mensual: Cuota = M * (i * (1 + i)^n) / ((1 + i)^n - 1)
      const cuota =
        (montoNumerico *
          interesNumerico *
          Math.pow(1 + interesNumerico, plazoNumerico)) /
        (Math.pow(1 + interesNumerico, plazoNumerico) - 1);

      const totalAPagar = cuota * plazoNumerico;
      const totalInteres = totalAPagar - montoNumerico;

      setResultado({
        cuotaMensual: cuota.toFixed(2),
        totalAPagar: totalAPagar.toFixed(2),
        totalInteres: totalInteres.toFixed(2),
        montoSolicitado: montoNumerico.toFixed(2)
      });
      
      setIsCalculating(false);
      setShowResults(true);
    }, 800);
  };

  // Resetear resultados cuando cambian los inputs
  useEffect(() => {
    if (monto || interes || plazo) {
      setShowResults(false);
    }
  }, [monto, interes, plazo]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div 
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 to-blue-800">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
              <FaCalculator className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Simulador de Préstamos
            </h2>
          </div>
          <p className="text-center text-indigo-100/80 text-sm mt-2">
            Calcula tu cuota mensual de forma rápida y sencilla
          </p>
        </div>

        {/* Formulario */}
        <div className="p-6 space-y-5">
          {/* Monto */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <FaDollarSign className="text-indigo-400" /> Monto del Préstamo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Ej: 1000"
                className="w-full pl-8 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Interés */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <FaPercentage className="text-indigo-400" /> Tasa de Interés Anual
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">%</span>
              </div>
              <input
                type="number"
                value={interes}
                onChange={(e) => setInteres(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Ej: 12"
                step="0.01"
                min="0"
                max="100"
                className="w-full pr-10 pl-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Plazo */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <FaCalendarAlt className="text-indigo-400" /> Plazo de Pago
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">meses</span>
              </div>
              <input
                type="number"
                value={plazo}
                onChange={(e) => setPlazo(e.target.value.replace(/\D/g, ''))}
                placeholder="Ej: 12"
                min="1"
                max="360"
                className="w-full pr-20 pl-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Botón de Cálculo */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={calcularCuota}
            disabled={isCalculating || (!monto || !interes || !plazo)}
            className={`w-full py-3.5 px-6 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 ${
              isCalculating || (!monto || !interes || !plazo)
                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20'
            }`}
          >
            {isCalculating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculando...
              </>
            ) : (
              <>
                <FaChartLine /> Calcular Cuota
              </>
            )}
          </motion.button>
        </div>

        {/* Resultados */}
        <AnimatePresence>
          {showResults && resultado && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0">
                <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaChartLine className="text-indigo-400" /> Resumen del Préstamo
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Monto Solicitado:</span>
                      <span className="font-medium text-white">${resultado.montoSolicitado}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Cuota Mensual:</span>
                      <span className="font-bold text-xl text-white">${resultado.cuotaMensual}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Plazo:</span>
                      <span className="text-gray-300">{plazo} meses</span>
                    </div>
                    <div className="h-px bg-gray-700/50 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total a Pagar:</span>
                      <span className="font-semibold text-white">${resultado.totalAPagar}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Interés Total:</span>
                      <span className="text-red-400">+${resultado.totalInteres}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SimuladorPrestamos;