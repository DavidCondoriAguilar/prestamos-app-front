import React from "react";
import { FaCreditCard, FaMoneyBillAlt } from "react-icons/fa";

const CuentaForm = ({ numeroCuenta, saldo, setNumeroCuenta, setSaldo }) => {
  return (
    <div className="space-y-4">
      {/* Número de Cuenta */}
      <div className="relative">
        <input
          type="text"
          placeholder="Número de Cuenta"
          value={numeroCuenta}
          onChange={(e) => setNumeroCuenta(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-700 rounded bg-gray-900 text-white focus:outline-none focus:border-blue-500"
          required
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaCreditCard />
        </span>
      </div>

      {/* Saldo */}
      <div className="relative">
        <input
          type="number"
          placeholder="Saldo"
          value={saldo}
          onChange={(e) => setSaldo(parseFloat(e.target.value) || 0)}
          className="w-full p-3 pl-10 border border-gray-700 rounded bg-gray-900 text-white focus:outline-none focus:border-blue-500"
          required
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaMoneyBillAlt />
        </span>
      </div>
    </div>
  );
};

export default CuentaForm;
