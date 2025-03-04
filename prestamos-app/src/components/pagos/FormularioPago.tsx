import React, { useState, useEffect } from 'react';
import { Pago } from '../../api/pagoApi';
import { registrarPago } from '../../api/pagoApi';

interface FormularioPagoProps {
  pago?: Pago;
  onClose: () => void;
  onGuardar: () => void;
}

const FormularioPago: React.FC<FormularioPagoProps> = ({ pago, onClose, onGuardar }) => {
  const [formData, setFormData] = useState<Partial<Pago>>({
    montoPago: 0,
    fecha: new Date().toISOString().split('T')[0],
    prestamoId: 0,
  });

  useEffect(() => {
    if (pago) {
      setFormData(pago);
    }
  }, [pago]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.prestamoId) {
        alert('Por favor, ingrese el ID del préstamo');
        return;
      }

      await registrarPago(formData.prestamoId, formData);
      onGuardar();
    } catch (error) {
      console.error('Error al guardar el pago:', error);
      alert('Error al guardar el pago. Por favor, intente nuevamente.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'montoPago' ? parseFloat(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          {pago ? 'Editar Pago' : 'Nuevo Pago'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID del Préstamo
            </label>
            <input
              type="number"
              name="prestamoId"
              value={formData.prestamoId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monto del Pago
            </label>
            <input
              type="number"
              name="montoPago"
              value={formData.montoPago}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPago; 