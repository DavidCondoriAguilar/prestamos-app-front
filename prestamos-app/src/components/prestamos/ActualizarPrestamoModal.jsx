import React, { useState, useEffect } from "react";
import { FiSave, FiX, FiDollarSign, FiPercent, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { actualizarPrestamo } from "../../api/prestamoApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ActualizarPrestamoModal = ({ prestamo, isOpen, onClose, onActualizado }) => {
  const [formData, setFormData] = useState({
    id: prestamo.id || "",
    monto: prestamo.monto || "",
    interes: prestamo.interes || "",
    estado: prestamo.estado || "PENDIENTE",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleActualizar = async () => {
    if (!formData.monto || !formData.interes) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const datosActualizados = {
        clienteId: prestamo.clienteId,
        monto: parseFloat(formData.monto),
        interes: parseFloat(formData.interes),
        estado: formData.estado,
      };

      await actualizarPrestamo(prestamo.id, datosActualizados);
      toast.success("Préstamo actualizado exitosamente");
      onActualizado();
      onClose();
    } catch (error) {
      console.error("Error al actualizar el préstamo:", error);
      setError("Ocurrió un error al actualizar el préstamo");
      toast.error("Error al actualizar el préstamo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleActualizar();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-md overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Actualizar Préstamo
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
                disabled={isLoading}
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <input type="hidden" name="id" value={formData.id} />

            {/* Campo Monto */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Monto Solicitado
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-500" />
                </div>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campo Interés */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Interés (%)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPercent className="text-gray-500" />
                </div>
                <input
                  type="number"
                  name="interes"
                  value={formData.interes}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max="100"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campo Estado */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Estado
              </label>
              <div className="relative">
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-3 pl-4 pr-10 text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <option value="PENDIENTE" className="bg-gray-800">Pendiente</option>
                  <option value="PAGADO" className="bg-gray-800">Pagado</option>
                  <option value="VENCIDO" className="bg-gray-800">Vencido</option>
                  <option value="EN_MORA" className="bg-gray-800">En mora</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <FiAlertCircle className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <motion.button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-lg border border-gray-700 text-white hover:bg-gray-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActualizarPrestamoModal;