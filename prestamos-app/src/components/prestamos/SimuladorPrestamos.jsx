import React, { useState } from "react";
import { FaCalculator, FaDollarSign, FaCalendarAlt } from "react-icons/fa";

const SimuladorPrestamos = () => {
  const [monto, setMonto] = useState("");
  const [interes, setInteres] = useState("");
  const [plazo, setPlazo] = useState("");
  const [resultado, setResultado] = useState(null);

  const calcularCuota = () => {
    if (!monto || !interes || !plazo) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const montoNumerico = parseFloat(monto);
    const interesNumerico = parseFloat(interes) / 100 / 12; // Tasa mensual
    const plazoNumerico = parseInt(plazo);

    if (montoNumerico <= 0 || interesNumerico <= 0 || plazoNumerico <= 0) {
      alert("Ingresa valores válidos mayores que cero.");
      return;
    }

    // Fórmula para calcular la cuota mensual: Cuota = M * (i * (1 + i)^n) / ((1 + i)^n - 1)
    const cuota =
      (montoNumerico *
        interesNumerico *
        Math.pow(1 + interesNumerico, plazoNumerico)) /
      (Math.pow(1 + interesNumerico, plazoNumerico) - 1);

    const totalAPagar = cuota * plazoNumerico;

    setResultado({
      cuotaMensual: cuota.toFixed(2),
      totalAPagar: totalAPagar.toFixed(2),
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto mt-12">
      {/* Título */}
      <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6 flex items-center justify-center gap-2">
        <FaCalculator size={24} /> Simulador de Préstamos
      </h3>

      {/* Formulario */}
      <div className="space-y-4">
        {/* Monto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 flex items-center gap-2">
            <FaDollarSign size={20} /> Monto del Préstamo
          </label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ejemplo: 1000"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />
        </div>

        {/* Interés */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 flex items-center gap-2">
            <FaDollarSign size={20} /> Tasa de Interés Anual (%)
          </label>
          <input
            type="number"
            value={interes}
            onChange={(e) => setInteres(e.target.value)}
            placeholder="Ejemplo: 12"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />
        </div>

        {/* Plazo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 flex items-center gap-2">
            <FaCalendarAlt size={20} /> Plazo (meses)
          </label>
          <input
            type="number"
            value={plazo}
            onChange={(e) => setPlazo(e.target.value)}
            placeholder="Ejemplo: 12"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />
        </div>

        {/* Botón de Cálculo */}
        <button
          className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors"
          onClick={calcularCuota}
        >
          Calcular Cuota
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="mt-6 space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FaDollarSign size={20} /> Cuota Mensual: ${resultado.cuotaMensual}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FaDollarSign size={20} /> Total a Pagar: ${resultado.totalAPagar}
          </p>
        </div>
      )}
    </div>
  );
};

export default SimuladorPrestamos;