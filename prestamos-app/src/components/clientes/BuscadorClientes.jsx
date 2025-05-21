import React from "react";

const BuscadorClientes = ({ filtroNombre, setFiltroNombre }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={filtroNombre}
        onChange={(e) => setFiltroNombre(e.target.value)}
        placeholder="Cliente por nombre..."
        className="w-fulls px-6 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
      />
    </div>
  );
};

export default BuscadorClientes;