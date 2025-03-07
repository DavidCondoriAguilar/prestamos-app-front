import React, { useState } from "react";
import { FaSave, FaTimesCircle } from "react-icons/fa";

const ModalCrearCliente = ({ isOpen, onClose, onClienteCreado }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    numeroCuenta: "",
    saldo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Construir el objeto en el formato esperado por el backend
      const clienteData = {
        nombre: formData.nombre,
        correo: formData.correo,
        cuenta: {
          numeroCuenta: formData.numeroCuenta,
          saldo: parseFloat(formData.saldo),
        },
      };

      await onClienteCreado(clienteData); // Llamar a la función para crear el cliente
    } catch (error) {
      console.error("Error al crear el cliente:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
        {/* Botón de Cierre */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <FaTimesCircle size={20} />
        </button>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FaSave /> Crear Cliente
        </h3>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ejemplo: Juan"
              required
              className="border rounded p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="Ejemplo: juan.perez@example.com"
              required
              className="border rounded p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Número de Cuenta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Número de Cuenta
            </label>
            <input
              type="text"
              name="numeroCuenta"
              value={formData.numeroCuenta}
              onChange={handleChange}
              placeholder="Ejemplo: 123456789"
              required
              className="border rounded p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Saldo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Saldo Inicial
            </label>
            <input
              type="number"
              name="saldo"
              value={formData.saldo}
              onChange={handleChange}
              placeholder="Ejemplo: 1000"
              required
              className="border rounded p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-600 transition-colors"
            >
              <FaSave size={16} /> Guardar
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600 transition-colors"
              onClick={onClose}
            >
              <FaTimesCircle size={16} /> Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearCliente;