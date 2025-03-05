import React, { useState } from "react";
import { obtenerPrestamosPorCliente } from "../../api/prestamoApi";
import { toast } from "react-toastify"; // Para notificaciones
import "react-toastify/dist/ReactToastify.css";
import { FaFilter, FaTimes } from "react-icons/fa"; // Iconos

const FiltrarPorClienteModal = ({ isOpen, onClose, onFiltrado }) => {
  const [clienteId, setClienteId] = useState(""); // ID del cliente
  const [error, setError] = useState(""); // Mensajes de error

  // Función para manejar el filtrado
  const handleFiltrar = async () => {
    setError(""); // Limpiar errores previos

    const id = parseInt(clienteId, 10);
    if (!id || id <= 0) {
      setError("El ID del cliente debe ser un número válido mayor que cero.");
      return;
    }

    try {
      // Llamar al backend para obtener los préstamos del cliente
      const data = await obtenerPrestamosPorCliente(id);

      // Si no hay préstamos, mostrar una notificación
      if (data.length === 0) {
        toast.info(`No se encontraron préstamos para el cliente con ID ${id}.`);
      }

      // Notificar al padre con los resultados
      onFiltrado(data, id); // Pasamos el ID del cliente para mostrarlo en la tabla

      // Cerrar el modal
      onClose();
    } catch (error) {
      console.error("Error al filtrar préstamos:", error);
      setError("Hubo un error al filtrar los préstamos. Inténtalo de nuevo.");
    }
  };

  // No renderizar si el modal está cerrado
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Título */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Filtrar Préstamos por Cliente</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            title="Cerrar"
            aria-label="Cerrar modal"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Campo para ingresar el ID del cliente */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID del Cliente
          </label>
          <input
            type="number"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            placeholder="Ejemplo: 123"
            className="border rounded p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="ID del cliente"
          />
        </div>

        {/* Mensaje de error */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Botones de acción */}
        <div className="flex justify-between">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-600 transition-colors"
            onClick={handleFiltrar}
            disabled={!clienteId.trim()}
            title="Filtrar préstamos"
            aria-label="Filtrar préstamos"
          >
            <FaFilter size={16} /> Filtrar
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600 transition-colors"
            onClick={onClose}
            title="Cerrar modal"
            aria-label="Cerrar modal"
          >
            <FaTimes size={16} /> Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltrarPorClienteModal;