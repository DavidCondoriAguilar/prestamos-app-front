import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPlus, FaUser, FaMoneyBillWave, FaPercentage, FaCalendarAlt, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

const FormField = React.memo(({ id, label, type = "text", placeholder, icon: Icon, options, error, value, onChange, ...props }) => (
  <motion.div 
    className="mb-5"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label 
      htmlFor={id} 
      className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center"
    >
      {Icon && <Icon className="mr-2 text-blue-400" />}
      {label}
    </label>
    
    <div className="relative">
      {type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full px-4 pl-10 py-2.5 bg-gray-800/30 backdrop-blur-sm border-2 ${
            error ? 'border-red-500/80' : 'border-gray-700/30 hover:border-blue-500/50 focus:border-blue-500/70'
          } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} className="bg-gray-800 text-white">
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 pl-10 py-2.5 bg-gray-800/30 backdrop-blur-sm border-2 ${
            error ? 'border-red-500/80' : 'border-gray-700/30 hover:border-blue-500/50 focus:border-blue-500/70'
          } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200`}
          style={{ caretColor: '#3b82f6' }}
          {...props}
        />
      )}
      
      {error && (
        <motion.p 
          className="mt-1 text-sm text-red-400"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  </motion.div>
));

const FormularioCrearPrestamo = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    monto: "",
    interes: "",
    interesMoratorio: "",
    fechaVencimiento: "",
    estado: "PENDIENTE",
    clienteId: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      newErrors.monto = "El monto debe ser mayor que cero";
    }
    if (!formData.interes || parseFloat(formData.interes) <= 0) {
      newErrors.interes = "El interés debe ser mayor que cero";
    }
    if (!formData.interesMoratorio || isNaN(parseFloat(formData.interesMoratorio)) || parseFloat(formData.interesMoratorio) < 0) {
      newErrors.interesMoratorio = "El interés moratorio debe ser un número no negativo";
    }
    if (!formData.fechaVencimiento) {
      newErrors.fechaVencimiento = "La fecha de vencimiento es obligatoria";
    } else {
      const selectedDate = new Date(formData.fechaVencimiento);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.fechaVencimiento = "La fecha no puede ser anterior a hoy";
      }
    }
    if (!formData.clienteId || !Number.isInteger(parseInt(formData.clienteId)) || parseInt(formData.clienteId) <= 0) {
      newErrors.clienteId = "El ID del cliente debe ser un número entero positivo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const nuevoPrestamo = {
        monto: parseFloat(formData.monto),
        interes: parseFloat(formData.interes),
        interesMoratorio: parseFloat(formData.interesMoratorio),
        fechaVencimiento: formData.fechaVencimiento,
        estado: formData.estado,
        clienteId: parseInt(formData.clienteId),
      };
      
      await onSubmit(nuevoPrestamo);
      
    } catch (error) {
      console.error("Error al crear el préstamo:", error);
      toast.error("❌ Error al procesar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-1 p-1">
      <motion.div 
        className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/50 backdrop-blur-lg border border-gray-700/30 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
      <FormField
        id="monto"
        label="Monto del Préstamo"
        type="number"
        value={formData.monto}
        onChange={handleChange}
        placeholder="Ej: 1000"
        icon={FaMoneyBillWave}
        min="0"
        step="0.01"
        required
        error={errors.monto}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          id="interes"
          label="Tasa de Interés (%)"
          type="number"
          value={formData.interes}
          onChange={handleChange}
          placeholder="Ej: 12"
          icon={FaPercentage}
          min="0"
          step="0.01"
          required
          error={errors.interes}
        />

        <FormField
          id="interesMoratorio"
          label="Interés Moratorio (%)"
          type="number"
          value={formData.interesMoratorio}
          onChange={handleChange}
          placeholder="Ej: 5"
          icon={FaPercentage}
          min="0"
          step="0.01"
          required
          error={errors.interesMoratorio}
        />
      </div>

      <FormField
        id="fechaVencimiento"
        label="Fecha de Vencimiento"
        type="date"
        value={formData.fechaVencimiento}
        onChange={handleChange}
        icon={FaCalendarAlt}
        required
        error={errors.fechaVencimiento}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          id="estado"
          label="Estado del Préstamo"
          type="select"
          value={formData.estado}
          onChange={handleChange}
          icon={FaCheck}
          options={[
            { value: 'PENDIENTE', label: 'Pendiente' },
            { value: 'APROBADO', label: 'Aprobado' },
            { value: 'PAGADO', label: 'Pagado' },
            { value: 'VENCIDO', label: 'Vencido' },
          ]}
          required
          error={errors.estado}
        />

        <FormField
          id="clienteId"
          label="ID del Cliente"
          type="number"
          value={formData.clienteId}
          onChange={handleChange}
          placeholder="Ej: 123"
          icon={FaUser}
          min="1"
          required
          error={errors.clienteId}
        />
      </div>

      </motion.div>
      
      <motion.div 
        className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-700/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gray-800/30 backdrop-blur-sm text-gray-200 hover:bg-gray-700/40 border border-gray-700/50 hover:border-gray-600/50 transition-all flex items-center gap-2 shadow-sm"
        >
          <FaTimes />
          Cancelar
        </motion.button>
        
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-6 py-2.5 text-sm font-medium rounded-xl text-white transition-all flex items-center gap-2 ${
            isSubmitting 
              ? 'bg-blue-600/30 backdrop-blur-sm cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20 border border-blue-400/20 hover:border-blue-300/30 backdrop-blur-sm'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            <>
              <FaPlus />
              Crear Préstamo
            </>
          )}
        </motion.button>
      </motion.div>
    </form>
  );
};

export default FormularioCrearPrestamo;