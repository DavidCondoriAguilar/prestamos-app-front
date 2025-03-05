import React, { useState } from "react";
import { FaChevronDown, FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa"; // Iconos

const PrestamoTablaFila = ({ prestamo, onVerDetalles, onEliminar, onActualizarEstado, onActualizarPrestamo }) => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el dropdown
  const estadosPosibles = [
    { valor: "APROBADO", etiqueta: "Aprobado" },
    { valor: "PENDIENTE", etiqueta: "Pendiente" },
    { valor: "RECHAZADO", etiqueta: "Rechazado" },
    { valor: "PAGADO", etiqueta: "Pagado" },
    { valor: "VENCIDO", etiqueta: "Vencido" },
  ];

  return (
    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
      {/* ID */}
      <td className="px-6 py-4 text-center">{prestamo.id}</td>

      {/* ID Cliente */}
      <td className="px-6 py-4 text-center">{prestamo.clienteId}</td>

      {/* Monto */}
      <td className="px-6 py-4 text-center">{prestamo.monto}</td>

      {/* Estado */}
      <td className="px-6 py-4 text-center">{prestamo.estado}</td>

      {/* Acciones */}
      <td className="px-6 py-4 flex gap-4 justify-center items-center">
        {/* Botón para ver detalles */}
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => onVerDetalles(prestamo.id)}
          title="Ver Detalles"
        >
          <FaEdit size={20} />
        </button>

        {/* Dropdown para actualizar el estado */}
        <div className="relative inline-block text-left">
          <button
            className="text-indigo-500 hover:text-indigo-700"
            onClick={() => setIsOpen(!isOpen)}
            title="Cambiar Estado"
          >
            <FaChevronDown size={20} />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 dark:bg-gray-800 dark:border-gray-700">
              {estadosPosibles.map((estado) => (
                <button
                  key={estado.valor}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 dark:hover:bg-gray-600 dark:text-white"
                  onClick={() => {
                    onActualizarEstado(prestamo.id, estado.valor);
                    setIsOpen(false); // Cierra el dropdown después de seleccionar
                  }}
                >
                  {estado.etiqueta}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón para actualizar préstamo */}
        <button
          className="text-green-500 hover:text-green-700"
          onClick={() => onActualizarPrestamo()}
          title="Actualizar Préstamo"
        >
          <FaSyncAlt size={20} />
        </button>

        {/* Botón para eliminar */}
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => onEliminar(prestamo.id)}
          title="Eliminar"
        >
          <FaTrash size={20} />
        </button>
      </td>
    </tr>
  );
};

export default PrestamoTablaFila;