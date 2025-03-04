import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatCurrency ";

const ModalDetallesCliente = ({ cliente, onClose }) => {
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
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Detalles del Cliente
        </h3>

        {/* Información General */}
        <div className="space-y-4">
          <p>
            <strong>ID:</strong> {cliente.id}
          </p>
          <p>
            <strong>Nombre:</strong> {cliente.nombre}
          </p>
          <p>
            <strong>Correo:</strong> {cliente.correo}
          </p>
        </div>

        {/* Cuenta Bancaria */}
        {cliente.cuenta && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Cuenta Bancaria
            </h4>
            <div className="space-y-2">
              <p>
                <strong>Número de Cuenta:</strong> {cliente.cuenta.numeroCuenta}
              </p>
              <p>
                <strong>Saldo:</strong> {formatCurrency(cliente.cuenta.saldo)}
              </p>
            </div>
          </div>
        )}

        {/* Préstamos Asociados */}
        {cliente.prestamos && cliente.prestamos.length > 0 ? (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Préstamos Asociados
            </h4>
            <table className="w-full text-sm text-left text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-2">ID</th>
                  <th scope="col" className="px-4 py-2">Monto</th>
                  <th scope="col" className="px-4 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {cliente.prestamos.map((prestamo) => (
                  <tr key={prestamo.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">{prestamo.id}</td>
                    <td className="px-4 py-2">{formatCurrency(prestamo.monto)}</td>
                    <td className="px-4 py-2">{prestamo.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-6 text-gray-500 dark:text-gray-400">
            No hay préstamos asociados a este cliente.
          </p>
        )}
      </div>
    </div>
  );
};

export default ModalDetallesCliente;