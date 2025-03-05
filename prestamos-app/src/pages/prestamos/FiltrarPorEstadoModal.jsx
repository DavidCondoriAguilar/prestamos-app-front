import React, { useState } from "react";
import { obtenerPrestamosPorEstado, obtenerPrestamosPorCliente } from "../../api/prestamoApi";
import { FaFilter, FaTimes } from "react-icons/fa"; // Iconos

const FiltrarPorEstadoModal = ({ isOpen, onClose, onFiltrado }) => {
  const [estado, setEstado] = useState(""); // Estado seleccionado
  const [clienteId, setClienteId] = useState(""); // ID del cliente
  const [error, setError] = useState(""); // Mensajes de error

  // Función para manejar el filtrado
  const handleFiltrar = async () => {
    setError(""); // Limpiar errores previos

    // Validar que al menos un campo esté lleno
    if (!estado.trim() && !clienteId.trim()) {
      setError("Por favor, ingresa un estado o un ID de cliente válido.");
      return;
    }

    try {
      let data = [];

      // Filtrar por estado si se proporciona
      if (estado.trim()) {
        const prestamosPorEstado = await obtenerPrestamosPorEstado(estado);
        data = [...data, ...prestamosPorEstado];
      }

      // Filtrar por cliente si se proporciona un ID
      if (clienteId.trim()) {
        const clienteIdNum = parseInt(clienteId, 10);
        if (isNaN(clienteIdNum) || clienteIdNum <= 0) {
          setError("El ID del cliente debe ser un número válido mayor que cero.");
          return;
        }
        const prestamosPorCliente = await obtenerPrestamosPorCliente(clienteIdNum);
        data = [...data, ...prestamosPorCliente];
      }

      // Eliminar duplicados en los resultados combinados
      const resultadosUnicos = Array.from(new Set(data.map((p) => p.id))).map(
        (id) => data.find((p) => p.id === id)
      );

      // Notificar al padre con los resultados únicos
      onFiltrado(resultadosUnicos);

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
          <h2 className="text-xl font-semibold">Filtrar Préstamos</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            title="Cerrar"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Campo para filtrar por estado */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado del Préstamo
          </label>
          <input
            type="text"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            placeholder="Ejemplo: PENDIENTE, APROBADO, PAGADO"
            className="border rounded p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Campo para filtrar por ID de cliente */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID del Cliente
          </label>
          <input
            type="number"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            placeholder="Ejemplo: 123"
            className="border rounded p-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Mensaje de error */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Botones de acción */}
        <div className="flex justify-between">
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-600 transition-colors"
            onClick={handleFiltrar}
          >
            <FaFilter size={16} /> Filtrar
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600 transition-colors"
            onClick={onClose}
          >
            <FaTimes size={16} /> Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltrarPorEstadoModal;