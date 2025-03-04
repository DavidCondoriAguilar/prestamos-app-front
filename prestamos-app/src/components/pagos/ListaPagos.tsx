import React from 'react';
import { Pago } from '../../api/pagoApi';

interface ListaPagosProps {
  pagos: Pago[];
  paginaActual: number;
  totalPaginas: number;
  onPageChange: (pagina: number) => void;
  onEditar: (pago: Pago) => void;
  onVerDetalle: (pago: Pago) => void;
}

const ListaPagos: React.FC<ListaPagosProps> = ({
  pagos,
  paginaActual,
  totalPaginas,
  onPageChange,
  onEditar,
  onVerDetalle,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Lista de Pagos</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Préstamo ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagos.map((pago) => (
              <tr key={pago.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pago.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${pago.montoPago.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(pago.fecha).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pago.prestamoId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onVerDetalle(pago)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEditar(pago)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => onPageChange(paginaActual - 1)}
          disabled={paginaActual === 0}
          className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-3 py-1">
          Página {paginaActual + 1} de {totalPaginas}
        </span>
        <button
          onClick={() => onPageChange(paginaActual + 1)}
          disabled={paginaActual >= totalPaginas - 1}
          className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListaPagos; 