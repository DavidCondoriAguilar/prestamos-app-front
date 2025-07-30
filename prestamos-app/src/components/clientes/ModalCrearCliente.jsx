import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiCreditCard, FiDollarSign, FiX } from "react-icons/fi";

const ModalCrearCliente = ({ isOpen, onClose, onClienteCreado }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    cuenta: {
      numeroCuenta: "",
      saldo: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("cuenta.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        cuenta: {
          ...prev.cuenta,
          [field]: field === "saldo" ? (value ? parseFloat(value) : "") : value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validación de campos vacíos
    if (!formData.nombre.trim() || !formData.correo.trim() || !formData.cuenta.numeroCuenta.trim()) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const clienteData = {
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim(),
        cuenta: {
          numeroCuenta: formData.cuenta.numeroCuenta.trim(),
          saldo: parseFloat(formData.cuenta.saldo) || 0,
        },
      };

      console.log("Enviando cliente:", JSON.stringify(clienteData, null, 2));

      const response = await fetch("http://localhost:8080/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteData),
      });

      if (!response.ok) {
        throw new Error(`Error al crear cliente: ${response.statusText}`);
      }

      const data = await response.json();

      // Llamamos a onClienteCreado para actualizar la lista sin refrescar
      onClienteCreado(data);

      // Reseteamos el formulario solo si la creación fue exitosa
      setFormData({ nombre: "", correo: "", cuenta: { numeroCuenta: "", saldo: "" } });

      // Cerramos el modal
      onClose();
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      setError("No se pudo crear el cliente. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Crear Cliente
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-lg mb-4">
              <p className="text-red-300 font-medium">Error</p>
              <p className="text-red-400 text-sm mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Nombre */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide">
                  NOMBRE COMPLETO
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    // placeholder="Ingrese el nombre completo"
                    className="block mx-3 w-full pl-11 pr-4 py-2.5 bg-gray-800/40 border border-gray-700/60 rounded-lg text-gray-100 placeholder-gray-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 text-[15px] leading-relaxed transition-all duration-200 "
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide">
                  CORREO ELECTRÓNICO
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    // placeholder="ejemplo@correo.com"
                    className="block w-full pl-11 pr-4 py-2.5 bg-gray-800/40 border border-gray-700/60 rounded-lg text-gray-100 placeholder-gray-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 text-[15px] leading-relaxed transition-all duration-200"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Número de Cuenta */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide">
                  NÚMERO DE CUENTA
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cuenta.numeroCuenta"
                    value={formData.cuenta.numeroCuenta}
                    onChange={handleChange}
                    required
                    // placeholder="Ingrese el número de cuenta"
                    className="block w-full pl-11 pr-4 py-2.5 bg-gray-800/40 border border-gray-700/60 rounded-lg text-gray-100 placeholder-gray-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 text-[15px] leading-relaxed transition-all duration-200"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Saldo Inicial */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide">
                  SALDO INICIAL
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="cuenta.saldo"
                    value={formData.cuenta.saldo}
                    onChange={handleChange}
                    required
                    //placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="block w-full pl-11 pr-4 py-2.5 bg-gray-800/40 border border-gray-700/60 rounded-lg text-gray-100 placeholder-gray-500/70 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 text-[15px] leading-relaxed transition-all duration-200"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-4 pt-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 text-base font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-colors flex items-center gap-2"
              >
                <FiX className="w-4 h-4" />
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className={`px-6 py-3 text-base font-medium rounded-xl transition-colors flex items-center gap-2 ${
                  loading 
                    ? 'bg-blue-600/50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Guardar Cliente
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalCrearCliente;
