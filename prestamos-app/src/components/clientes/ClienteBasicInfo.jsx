import React from "react";
import { FaUserAlt } from "react-icons/fa";

const ClienteBasicInfo = ({ nombre, correo, setNombre, setCorreo }) => {
  return (
    <div className="space-y-4">
      {/* Campo Nombre */}
      <div className="relative">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-700 rounded bg-gray-900 text-white focus:outline-none focus:border-blue-500"
          required
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaUserAlt />
        </span>
      </div>

      {/* Campo Correo */}
      <div className="relative">
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-700 rounded bg-gray-900 text-white focus:outline-none focus:border-blue-500"
          required
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          📧
        </span>
      </div>
    </div>
  );
};

export default ClienteBasicInfo;
