import React from "react";

const PrestamoBtnAccionModal = ({ onCancel }) => {
  return (
    <div className="flex justify-end gap-2">
      {/* Botón Cancelar */}
      <button
        type="button"
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
        onClick={onCancel}
      >
        Cancelar
      </button>
      {/* Botón Crear */}
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
      >
        Crear
      </button>
    </div>
  );
};

export default PrestamoBtnAccionModal;