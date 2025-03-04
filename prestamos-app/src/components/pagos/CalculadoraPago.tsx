import React, { useState } from 'react';
import { calcularMontoRestante } from '../../api/pagoApi';

const CalculadoraPago: React.FC = () => {
  const [prestamoId, setPrestamoId] = useState<number | ''>('');
  const [montoRestante, setMontoRestante] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalcular = async () => {
    if (!prestamoId) {
      setError('Por favor, ingrese el ID del préstamo');
      return;
    }

    try {
      const monto = await calcularMontoRestante(prestamoId);
      setMontoRestante(monto);
      setError(null);
    } catch (error) {
      console.error('Error al calcular el monto restante:', error);
      setError('Error al calcular el monto restante. Por favor, intente nuevamente.');
      setMontoRestante(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Calculadora de Pagos</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ID del Préstamo
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="number"
              value={prestamoId}
              onChange={(e) => setPrestamoId(e.target.value ? Number(e.target.value) : '')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ingrese el ID del préstamo"
            />
            <button
              onClick={handleCalcular}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Calcular
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        {montoRestante !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">
              Monto Restante
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              ${montoRestante.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculadoraPago; 