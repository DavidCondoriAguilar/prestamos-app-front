import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatCurrency ";

const ModalDetallesPrestamo = ({ prestamo, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        {/* Botón de Cierre */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <FaTimesCircle size={20} />
        </button>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detalles del Préstamo</h3>

        {/* Información General */}
        <div className="space-y-4">
          <p>
            <strong>ID:</strong> {prestamo.id}
          </p>
          <p>
            <strong>Monto Solicitado:</strong> {formatCurrency(prestamo.monto)}
          </p>
          <p>
            <strong>Interés (%):</strong> {prestamo.interes}%
          </p>
          <p>
            <strong>Interés Moratorio (%):</strong> {prestamo.interesMoratorio}%
          </p>
          <p>
            <strong>Fecha de Creación:</strong> {prestamo.fechaCreacion}
          </p>
          <p>
            <strong>Fecha de Vencimiento:</strong> {prestamo.fechaVencimiento}
          </p>
          <p>
            <strong>Estado:</strong> {prestamo.estado}
          </p>
          <p>
            <strong>ID del Cliente:</strong> {prestamo.clienteId}
          </p>
          <p>
            <strong>Deuda Restante:</strong> {formatCurrency(prestamo.deudaRestante)}
          </p>
        </div>

        {/* Pagos Asociados */}
        {prestamo.pagos && prestamo.pagos.length > 0 ? (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pagos Realizados</h4>
            <table className="w-full text-sm text-left text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-2">ID Pago</th>
                  <th scope="col" className="px-4 py-2">Monto Pagado</th>
                  <th scope="col" className="px-4 py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {prestamo.pagos.map((pago) => (
                  <tr key={pago.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">{pago.id}</td>
                    <td className="px-4 py-2">{formatCurrency(pago.montoPago)}</td>
                    <td className="px-4 py-2">{pago.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-6 text-gray-500 dark:text-gray-400">No hay pagos registrados para este préstamo.</p>
        )}
      </div>
    </div>
  );
};

export default ModalDetallesPrestamo;