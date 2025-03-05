import React from "react";

const BotonActualizarLista = ({ onRefresh }) => {
  return (
    <button
      onClick={onRefresh}
      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
    >
      Actualizar Lista
    </button>
  );
};

export default BotonActualizarLista;