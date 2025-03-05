import React from "react";

const MontoRestante = ({ montoRestante }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold text-gray-700">Monto Restante:</span>
      <span className="text-xl font-bold text-indigo-600">
        {montoRestante !== null ? `$${montoRestante.toFixed(2)}` : "No calculado"}
      </span>
    </div>
  );
};

export default MontoRestante;