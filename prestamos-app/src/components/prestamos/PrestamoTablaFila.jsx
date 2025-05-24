import React, { useState } from "react";
import { FiChevronDown, FiEdit, FiTrash2, FiRefreshCw, FiEye, FiMoreVertical, FiX, FiAlertTriangle } from "react-icons/fi";

const PrestamoTablaFila = ({ prestamo, onVerDetalles, onEliminar, onActualizarEstado, onActualizarPrestamo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const estadosPosibles = [
    { valor: "APROBADO", etiqueta: "Aprobado", color: "bg-blue-500/20 text-blue-300" },
    { valor: "PENDIENTE", etiqueta: "Pendiente", color: "bg-yellow-500/20 text-yellow-300" },
    { valor: "RECHAZADO", etiqueta: "Rechazado", color: "bg-red-500/20 text-red-300" },
    { valor: "PAGADO", etiqueta: "Pagado", color: "bg-green-500/20 text-green-300" },
    { valor: "VENCIDO", etiqueta: "Vencido", color: "bg-red-500/20 text-red-300" },
  ];

  const getEstadoStyle = (estado) => {
    const estadoObj = estadosPosibles.find(e => e.valor === estado) || { color: 'bg-gray-500/20 text-gray-300' };
    return `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${estadoObj.color}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onEliminar(prestamo.id);
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <tr className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-colors">
        {/* ID */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-100">#{prestamo.id}</div>
        </td>

        {/* ID Cliente */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-300">Cliente #{prestamo.clienteId}</div>
        </td>

        {/* Monto */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-100">
            {formatCurrency(prestamo.monto || 0)}
          </div>
        </td>

        {/* Estado */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={getEstadoStyle(prestamo.estado)}>
            {prestamo.estado || 'SIN ESTADO'}
          </span>
        </td>

        {/* Acciones */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            {/* Botón para ver detalles */}
            <button
              onClick={() => onVerDetalles(prestamo.id)}
              className="text-blue-400 hover:text-blue-300 p-1.5 rounded-full hover:bg-blue-900/30 transition-colors"
              title="Ver Detalles"
            >
              <FiEye className="h-4 w-4" />
            </button>

            {/* Botón para actualizar préstamo */}
            <button
              onClick={() => onActualizarPrestamo()}
              className="text-green-400 hover:text-green-300 p-1.5 rounded-full hover:bg-green-900/30 transition-colors"
              title="Actualizar Préstamo"
            >
              <FiRefreshCw className="h-4 w-4" />
            </button>

            {/* Dropdown para actualizar el estado */}
            <div className="relative inline-block text-left">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-purple-400 hover:text-purple-300 p-1.5 rounded-full hover:bg-purple-900/30 transition-colors"
                title="Cambiar Estado"
              >
                <FiMoreVertical className="h-4 w-4" />
              </button>
              
              {isOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  tabIndex="-1"
                >
                  <div className="py-1" role="none">
                    <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                      Cambiar estado a:
                    </div>
                    {estadosPosibles.map((estado) => (
                      <button
                        key={estado.valor}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center ${
                          estado.valor === prestamo.estado 
                            ? 'bg-gray-700/80 text-white' 
                            : 'text-gray-300 hover:bg-gray-700/50'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onActualizarEstado(prestamo.id, estado.valor);
                          setIsOpen(false);
                        }}
                      >
                        <span 
                          className={`w-2 h-2 rounded-full mr-3 ${
                            estado.color.split(' ')[1].replace('500', '400')
                          }`}
                        ></span>
                        {estado.etiqueta}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botón para eliminar */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-red-900/30 transition-colors"
              title="Eliminar"
              disabled={deleting}
            >
              {deleting ? (
                <div className="animate-spin h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full"></div>
              ) : (
                <FiTrash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-red-500/10 text-red-400 mr-3">
                    <FiAlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">¿Eliminar préstamo?</h3>
                </div>
                <button
                  onClick={() => !deleting && setShowDeleteConfirm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={deleting}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-300 mb-6 pl-11">
                ¿Estás seguro de que deseas eliminar el préstamo #{prestamo.id}? 
                <span className="block text-sm text-gray-400 mt-1">Esta acción no se puede deshacer.</span>
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600/80 rounded-lg transition-colors"
                  disabled={deleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="mr-2" /> Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrestamoTablaFila;