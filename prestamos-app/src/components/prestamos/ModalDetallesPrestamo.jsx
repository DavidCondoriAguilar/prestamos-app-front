import React from "react";
import { 
  FaTimes, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaUser, 
  FaInfoCircle,
  FaReceipt,
  FaPercentage,
  FaHistory,
  FaUserTie,
  FaCoins,
  FaClock,
  FaCalendarDay
} from "react-icons/fa";
import formatCurrency from "../../utils/formatCurrency";

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha inválida';
  }
};

const StatusBadge = ({ status }) => {
  const statusColors = {
    PENDIENTE: 'bg-yellow-500/20 text-yellow-400',
    ACTIVO: 'bg-green-500/20 text-green-400',
    PAGADO: 'bg-blue-500/20 text-blue-400',
    VENCIDO: 'bg-red-500/20 text-red-400',
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {status}
    </span>
  );
};

const ModalDetallesPrestamo = ({ prestamo, onClose }) => {
  // Debug: Ver datos de fechas en consola
  React.useEffect(() => {
    console.log('Datos del préstamo:', {
      fechaCreacion: prestamo.fechaCreacion,
      fechaVencimiento: prestamo.fechaVencimiento,
      tipoFechaCreacion: typeof prestamo.fechaCreacion,
      tipoFechaVencimiento: typeof prestamo.fechaVencimiento
    });
  }, [prestamo]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FaReceipt size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Detalles del Préstamo</h3>
              <p className="text-sm text-gray-400">ID: {prestamo.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-gray-800 hover:text-white"
            aria-label="Cerrar modal"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Resumen */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <FaUserTie size={18} />
                  </div>
                  <h4 className="font-medium text-gray-300">Información del Cliente</h4>
                </div>
                <div className="space-y-2 pl-11">
                  <p className="text-sm">
                    <span className="text-gray-400">ID:</span>{' '}
                    <span className="text-white">{prestamo.clienteId}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <FaCoins size={18} />
                  </div>
                  <h4 className="font-medium text-gray-300">Monto del Préstamo</h4>
                </div>
                <div className="space-y-2 pl-11">
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(prestamo.monto)}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">
                      Interés: <span className="text-white">{prestamo.interes}%</span>
                    </span>
                    <span className="text-gray-400">
                      Moratorio: <span className="text-white">{prestamo.interesMoratorio}%</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <FaCalendarDay size={18} />
                  </div>
                  <h4 className="font-medium text-gray-300">Fechas</h4>
                </div>
                <div className="space-y-2 pl-11">
                  <p className="text-sm">
                    <span className="text-gray-400">Creación:</span>{' '}
                    <span className="text-white">
                      {formatDate(prestamo.fechaCreacion || prestamo.createdAt)}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">Vencimiento:</span>{' '}
                    <span className="text-white">
                      {formatDate(prestamo.fechaVencimiento || prestamo.fechaVencimiento)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <FaClock size={18} />
                  </div>
                  <h4 className="font-medium text-gray-300">Estado</h4>
                </div>
                <div className="flex flex-wrap items-center justify-between pl-11">
                  <StatusBadge status={prestamo.estado} />
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Deuda restante</p>
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(prestamo.deudaRestante)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historial de Pagos */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <FaHistory size={20} />
              </div>
              <h4 className="text-lg font-semibold text-white">Historial de Pagos</h4>
              <span className="px-3 py-1 text-xs font-medium text-blue-300 bg-blue-900/30 rounded-full">
                {prestamo.pagos?.length || 0} registros
              </span>
            </div>

            {prestamo.pagos && prestamo.pagos.length > 0 ? (
              <div className="overflow-hidden border border-gray-700 rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/80">
                      <tr className="text-xs font-medium text-left text-gray-400 uppercase">
                        <th className="px-6 py-3">ID Pago</th>
                        <th className="px-6 py-3 text-right">Monto</th>
                        <th className="px-6 py-3 text-right">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {prestamo.pagos.map((pago) => (
                        <tr key={pago.id} className="transition-colors hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-medium text-gray-300">#{pago.id}</td>
                          <td className="px-6 py-4 text-right text-green-400">
                            +{formatCurrency(pago.montoPago)}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-400">
                            {formatDate(pago.fecha)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl border-gray-700/50">
                <FaInfoCircle className="w-10 h-10 mb-3 text-gray-600" />
                <p className="text-gray-400">No hay pagos registrados para este préstamo</p>
                <p className="text-sm text-gray-500">Los pagos aparecerán aquí cuando sean registrados</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 p-4 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white transition-colors bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetallesPrestamo;