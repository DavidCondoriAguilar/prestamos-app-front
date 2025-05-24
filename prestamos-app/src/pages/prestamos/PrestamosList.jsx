import React, { useState } from "react";
import { obtenerPrestamoPorId, eliminarPrestamo, actualizarEstadoPrestamo } from "../../api/prestamoApi";
import { toast } from "react-toastify"; // Para notificaciones
import "react-toastify/dist/ReactToastify.css";
import { FiDollarSign } from "react-icons/fi";
import ModalDetallesPrestamo from "../../components/prestamos/ModalDetallesPrestamo";
import PrestamoTablaFila from "../../components/prestamos/PrestamoTablaFila";
import ActualizarPrestamoModal from "../../components/prestamos/ActualizarPrestamoModal";

const PrestamosList = ({ prestamos, onEliminar }) => {
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null); // Estado para el modal de detalles
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de actualización
  const [paginaActual, setPaginaActual] = useState(1);
  const prestamosPorPagina = 7;

  // Función para abrir el modal de detalles
  const handleVerDetalles = async (id) => {
    try {
      const prestamo = await obtenerPrestamoPorId(id);
      setPrestamoSeleccionado(prestamo);
    } catch (error) {
      console.error("Error al cargar detalles del préstamo:", error);
    }
  };

  // Función para cerrar el modal de detalles
  const handleCloseModal = () => {
    setPrestamoSeleccionado(null);
  };

  // Función para abrir el modal de actualización
  const handleAbrirModalActualizar = (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal de actualización
  const handleCerrarModalActualizar = () => {
    setIsModalOpen(false);
    setPrestamoSeleccionado(null);
  };

  // Función para eliminar un préstamo con notificación moderna
  const handleEliminarPrestamo = async (id) => {
    toast.promise(
      eliminarPrestamo(id).then(() => {
        onEliminar(id); // Actualizar la lista de préstamos
      }),
      {
        pending: "Eliminando préstamo...",
        success: "Préstamo eliminado correctamente",
        error: "Error al eliminar el préstamo",
      }
    );
  };

  // Función para actualizar el estado de un préstamo
  const handleActualizarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPrestamo(id, nuevoEstado); // Llama al endpoint
      toast.success("Estado del préstamo actualizado correctamente"); // Notificación de éxito
      onEliminar(); // Refresca la lista de préstamos
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast.error("Hubo un error al actualizar el estado del préstamo");
    }
  };

  // Lógica de paginación
  const indexUltimoPrestamo = paginaActual * prestamosPorPagina;
  const indexPrimerPrestamo = indexUltimoPrestamo - prestamosPorPagina;
  const prestamosActuales = prestamos.slice(indexPrimerPrestamo, indexUltimoPrestamo);
  const totalPaginas = Math.ceil(prestamos.length / prestamosPorPagina);

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);
  const paginaAnterior = () => setPaginaActual(prev => Math.max(prev - 1, 1));
  const paginaSiguiente = () => setPaginaActual(prev => Math.min(prev + 1, totalPaginas));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6">
      {/* Tarjeta contenedora */}
      <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Encabezado */}
        <div className="px-6 py-5 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 mr-3">
                <FiDollarSign className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  Lista de Préstamos
                </h2>
                <p className="text-sm text-gray-400">Administra todos los préstamos registrados</p>
              </div>
            </div>
            <div className="mt-3 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700/50 text-blue-300 border border-gray-600/50">
                <span className="flex w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                {prestamos.length} {prestamos.length === 1 ? 'préstamo' : 'préstamos'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              {/* Encabezado de la tabla */}
              <thead className="bg-gray-800/60">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Monto
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>

              {/* Cuerpo de la tabla */}
              <tbody className="divide-y divide-gray-700/30">
                {prestamosActuales.length > 0 ? (
                  prestamosActuales.map((prestamo) => (
                    <PrestamoTablaFila
                      key={prestamo.id}
                      prestamo={prestamo}
                      onVerDetalles={handleVerDetalles}
                      onEliminar={handleEliminarPrestamo}
                      onActualizarEstado={handleActualizarEstado}
                      onActualizarPrestamo={() => handleAbrirModalActualizar(prestamo)}
                      className="hover:bg-gray-700/30 transition-colors duration-150"
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                          <FiDollarSign className="h-10 w-10 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-200 mb-1">No hay préstamos registrados</h3>
                        <p className="text-gray-400 max-w-md">
                          Parece que aún no has registrado ningún préstamo. Comienza creando uno nuevo para empezar a gestionar tus préstamos.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pie de tabla */}
          {prestamos.length > 0 && (
            <div className="px-6 py-3 bg-gray-800/50 border-t border-gray-700/50 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <p className="text-xs text-gray-400">
                Mostrando <span className="text-blue-300 font-medium">{indexPrimerPrestamo + 1}-{Math.min(indexUltimoPrestamo, prestamos.length)}</span> de <span className="text-blue-300 font-medium">{prestamos.length}</span> préstamos
              </p>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={paginaAnterior}
                  disabled={paginaActual === 1}
                  className={`px-3 py-1 text-xs rounded-md ${paginaActual === 1 ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'} transition-colors`}
                >
                  Anterior
                </button>
                {Array.from({ length: Math.min(3, totalPaginas) }, (_, i) => {
                  const numeroPagina = Math.max(1, Math.min(paginaActual - 1, totalPaginas - 2)) + i;
                  return (
                    <button
                      key={numeroPagina}
                      onClick={() => cambiarPagina(numeroPagina)}
                      className={`w-8 h-8 text-xs rounded-md ${paginaActual === numeroPagina 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'} transition-colors`}
                    >
                      {numeroPagina}
                    </button>
                  );
                })}
                <button 
                  onClick={paginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                  className={`px-3 py-1 text-xs rounded-md ${paginaActual === totalPaginas ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'} transition-colors`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      {prestamoSeleccionado && (
        <ModalDetallesPrestamo
          prestamo={prestamoSeleccionado}
          onClose={handleCloseModal}
        />
      )}

      {/* Modal de Actualización */}
      {isModalOpen && prestamoSeleccionado && (
        <ActualizarPrestamoModal
          prestamo={prestamoSeleccionado}
          isOpen={isModalOpen}
          onClose={handleCerrarModalActualizar}
          onActualizado={onEliminar} // Refrescar la lista después de actualizar
        />
      )}
    </div>
  );
};

export default PrestamosList;