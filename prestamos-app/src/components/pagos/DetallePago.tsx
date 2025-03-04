import React from 'react';
import { Pago } from '../../api/pagoApi';
import { eliminarPago } from '../../api/pagoApi';

interface DetallePagoProps {
  pago: Pago;
  onClose: () => void;
}

const DetallePago: React.FC<DetallePagoProps> = ({ pago, onClose }) => {
  const handleEliminar = async () => {
    if (window.confirm('¿Está seguro de que desea eliminar este pago?')) {
      try {
        if (pago.id) {
          await eliminarPago(pago.id);
          onClose();
        }
      } catch (error) {
        console.error('Error al eliminar el pago:', error);
        alert('Error al eliminar el pago. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detalles del Pago</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              ID del Pago
            </label>
            <p className="mt-1 text-sm text-gray-900">{pago.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Monto del Pago
            </label>
            <p className="mt-1 text-sm text-gray-900">
              ${pago.montoPago.toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Fecha
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(pago.fecha).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              ID del Préstamo
            </label>
            <p className="mt-1 text-sm text-gray-900">{pago.prestamoId}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleEliminar}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallePago; 