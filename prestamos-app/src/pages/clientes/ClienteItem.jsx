import React from "react";
import { FaEye, FaTrash } from "react-icons/fa";

const ClienteItem = ({ cliente, onVerDetalles }) => {
  return (
    <li className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
      {/* Información del Cliente */}
      <div>
        <p className="text-lg font-semibold text-white">{cliente.nombre}</p>
        <p className="text-sm text-gray-400">{cliente.correo}</p>
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        {/* Botón Ver Detalles */}
        <button
          onClick={() => onVerDetalles(cliente)}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          <FaEye className="mr-1" />
          Ver
        </button>

        {/* Botón Eliminar (opcional, si deseas mantener esta funcionalidad) */}
        {/* 
        <button
          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
        >
          <FaTrash className="mr-1" />
          Eliminar
        </button>
        */}
      </div>
    </li>
  );
};

export default ClienteItem;