import React, { useState } from "react";
import { obtenerPrestamoPorId, eliminarPrestamo, actualizarEstadoPrestamo } from "../../api/prestamoApi";
import { toast } from "react-toastify"; // Para notificaciones
import "react-toastify/dist/ReactToastify.css";
import ModalDetallesPrestamo from "../../components/prestamos/ModalDetallesPrestamo";
import PrestamoTablaFila from "../../components/prestamos/PrestamoTablaFila";
import ActualizarPrestamoModal from "../../components/prestamos/ActualizarPrestamoModal";

const PrestamosList = ({ prestamos, onEliminar }) => {
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null); // Estado para el modal de detalles
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de actualización

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

  return (
    <div className="mb-6 overflow-x-auto">
      {/* Título */}
      <h2 className="text-3xl font-bold text-center text-white mb-6">Lista de Préstamos</h2>

      {/* Tabla */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
          {/* Encabezado */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">ID</th>
              <th scope="col" className="px-6 py-3 text-center">ID Cliente</th>
              <th scope="col" className="px-6 py-3 text-center">Monto</th>
              <th scope="col" className="px-6 py-3 text-center">Estado</th>
              <th scope="col" className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          {/* Cuerpo */}
          <tbody>
            {prestamos.map((prestamo) => (
              <PrestamoTablaFila
                key={prestamo.id}
                prestamo={prestamo}
                onVerDetalles={handleVerDetalles}
                onEliminar={handleEliminarPrestamo}
                onActualizarEstado={handleActualizarEstado}
                onActualizarPrestamo={() => handleAbrirModalActualizar(prestamo)} // Nuevo evento
              />
            ))}
          </tbody>
        </table>
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