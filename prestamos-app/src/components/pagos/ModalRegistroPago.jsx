import React, { useState } from "react";
import { FaSave } from "react-icons/fa";

const ModalRegistroPago = ({ isOpen, onClose, onPagoRegistrado }) => {
  const [monto, setMonto] = useState("");

  const handleGuardar = () => {
    if (!monto || parseFloat(monto) <= 0) {
      alert("Por favor, ingresa un monto válido.");
      return;
    }

    const nuevoPago = { monto: parseFloat(monto), fecha: new Date().toISOString() };
    onPagoRegistrado(nuevoPago);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar Nuevo Pago</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Monto del Pago</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ejemplo: 100"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleGuardar}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300 flex items-center gap-2"
          >
            <FaSave /> Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistroPago;