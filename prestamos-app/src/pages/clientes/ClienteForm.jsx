import React, { useState } from "react";
import { toast } from "react-toastify";
import { createCliente } from "../../api/clienteApi";

const ClienteForm = ({ onClose, onCreado }) => {
  const [cliente, setCliente] = useState({
    nombre: "",
    correo: "",
    cuenta: {
      numeroCuenta: "",
      saldo: 0,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("cuenta.")) {
      const campoCuenta = name.split(".")[1];
      setCliente((prev) => ({
        ...prev,
        cuenta: {
          ...prev.cuenta,
          [campoCuenta]: value,
        },
      }));
    } else {
      setCliente((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos
    if (!cliente.nombre || !cliente.email || !cliente.cuenta.numeroCuenta) {
      toast.error("Por favor, completa todos los campos correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await createCliente(cliente);
      toast.success("Cliente creado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });
      onCreado(); // Notificar al padre que se actualice la lista
      onClose(); // Cerrar el formulario
    } catch (error) {
      console.error("Error al crear cliente:", error);
      toast.error("Ocurrió un error al crear el cliente", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Nuevo Cliente</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campo de Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={cliente.nombre}
              onChange={handleChange}
              placeholder="Nombre del cliente"
              className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Campo de Correo */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={cliente.correo}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Campo de Número de Cuenta */}
          <div>
            <label htmlFor="cuenta.numeroCuenta" className="block text-sm font-medium text-gray-700">
              Número de Cuenta
            </label>
            <input
              type="text"
              id="cuenta.numeroCuenta"
              name="cuenta.numeroCuenta"
              value={cliente.cuenta.numeroCuenta}
              onChange={handleChange}
              placeholder="Número de cuenta"
              className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Campo de Saldo */}
          <div>
            <label htmlFor="cuenta.saldo" className="block text-sm font-medium text-gray-700">
              Saldo Inicial
            </label>
            <input
              type="number"
              id="cuenta.saldo"
              name="cuenta.saldo"
              value={cliente.cuenta.saldo}
              onChange={handleChange}
              placeholder="Saldo inicial"
              className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteForm;