import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiMail, FiCreditCard, FiDollarSign, FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";
import formatCurrency from "../../utils/formatCurrency";

const ModalDetallesCliente = ({ cliente, onClose, formatDate }) => {
  // Función para obtener el icono según el estado del préstamo
  const getStatusIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return <FiCheckCircle className="text-green-500" />;
      case 'pendiente':
        return <FiClock className="text-amber-500" />;
      case 'vencido':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiInfo className="text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Detalles del Cliente
              </h2>
              <p className="text-sm text-gray-400 mt-1">ID: {cliente.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-8">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="flex items-center text-lg font-semibold text-white">
              <FiUser className="mr-2 text-blue-400" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <p className="text-sm text-gray-400">Nombre Completo</p>
                <p className="text-white font-medium">{cliente.nombre}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <p className="text-sm text-gray-400 flex items-center">
                  <FiMail className="mr-1.5" /> Correo Electrónico
                </p>
                <p className="text-white font-medium truncate">{cliente.correo}</p>
              </div>
            </div>
          </div>

          {/* Cuenta Bancaria */}
          {cliente.cuenta ? (
            <div className="space-y-4">
              <h3 className="flex items-center text-lg font-semibold text-white">
                <FiCreditCard className="mr-2 text-green-400" />
                Cuenta Bancaria
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-sm text-gray-400">Número de Cuenta</p>
                  <p className="text-white font-mono font-medium">{cliente.cuenta.numeroCuenta}</p>
                </div>
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-4 rounded-xl border border-green-500/20">
                  <p className="text-sm text-green-400">Saldo Disponible</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(cliente.cuenta.saldo || 0)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-start">
                <FiAlertCircle className="text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-yellow-300 text-sm">
                  Este cliente no tiene una cuenta bancaria asociada.
                </p>
              </div>
            </div>
          )}

          {/* Préstamos */}
          <div className="space-y-4">
            <h3 className="flex items-center text-lg font-semibold text-white">
              <FiDollarSign className="mr-2 text-purple-400" />
              Préstamos
              {cliente.prestamos?.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-200 rounded-full">
                  {cliente.prestamos.length} préstamo{cliente.prestamos.length !== 1 ? 's' : ''}
                </span>
              )}
            </h3>

            {cliente.prestamos?.length > 0 ? (
              <div className="space-y-3">
                {cliente.prestamos.map((prestamo) => (
                  <div key={prestamo.id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">Préstamo #{prestamo.id}</span>
                          <span className="flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300">
                            {getStatusIcon(prestamo.estado)}
                            <span className="ml-1 capitalize">{prestamo.estado || 'Sin estado'}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {formatDate ? formatDate(prestamo.fechaSolicitud) : 'Sin fecha'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">
                          {formatCurrency(prestamo.monto || 0)}
                        </p>
                        {prestamo.tasaInteres && (
                          <p className="text-xs text-gray-400">
                            {prestamo.tasaInteres}% TEA
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/30 border border-dashed border-gray-700/50 rounded-xl p-8 text-center">
                <FiDollarSign className="mx-auto h-10 w-10 text-gray-500" />
                <h4 className="mt-2 text-sm font-medium text-gray-300">Sin préstamos</h4>
                <p className="mt-1 text-xs text-gray-500">
                  Este cliente no tiene préstamos registrados.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800/50 rounded-b-2xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                // Aquí podrías agregar la lógica para editar el cliente
                console.log('Editar cliente:', cliente.id);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Editar Cliente
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalDetallesCliente;