import React, { useState } from "react";
import { FaSave, FaTimesCircle } from "react-icons/fa";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={onClose}
          disabled={loading}
        >
          <FaTimesCircle size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FaSave /> Crear Cliente
        </h3>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Número de Cuenta
            </label>
            <input
              type="text"
              name="cuenta.numeroCuenta"
              value={formData.cuenta.numeroCuenta}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Saldo Inicial
            </label>
            <input
              type="number"
              name="cuenta.saldo"
              value={formData.cuenta.saldo}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
              disabled={loading}
            >
              {loading ? "Guardando..." : <><FaSave size={16} /> Guardar</>}
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600 transition-colors"
              onClick={onClose}
              disabled={loading}
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
