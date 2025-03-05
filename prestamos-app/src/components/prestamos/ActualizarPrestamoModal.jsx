import React, { useState } from "react";
import { FaSave, FaTimesCircle } from "react-icons/fa"; // Iconos
import { actualizarPrestamo } from "../../api/prestamoApi";
import { toast } from "react-toastify"; // Para notificaciones
import "react-toastify/dist/ReactToastify.css";

const ActualizarPrestamoModal = ({ prestamo, isOpen, onClose, onActualizado }) => {
  const [formData, setFormData] = useState({
    monto: prestamo.monto || "",
    interes: prestamo.interes || "",
    estado: prestamo.estado || "",
  });
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleActualizar = async () => {
    try {
      setIsLoading(true); // Activar el estado de carga

      const datosActualizados = {
        clienteId: prestamo.clienteId, // Mantener el ID del cliente
        monto: parseFloat(formData.monto),
        interes: parseFloat(formData.interes),
        estado: formData.estado,
      };

      // Mostrar notificación de carga
      const promesaActualizacion = actualizarPrestamo(prestamo.id, datosActualizados).then(
        (prestamoActualizado) => {
          if (!prestamoActualizado) {
            throw new Error("Error al actualizar el préstamo");
          }
        }
      );

      // Forzar un mínimo de 1.5 segundos de loading
      const tiempoMinimo = new Promise((resolve) => setTimeout(resolve, 1500));

      // Esperar tanto la promesa de actualización como el tiempo mínimo
      await Promise.all([promesaActualizacion, tiempoMinimo]);

      // Notificar éxito
      toast.success("Cambios guardados correctamente");

      // Refrescar la lista y cerrar el modal
      onActualizado(); // Notificar al padre para refrescar la lista
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error al actualizar el préstamo:", error);
      toast.error("Hubo un error al guardar los cambios");
    } finally {
      setIsLoading(false); // Desactivar el estado de carga
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
        {/* Botón de Cierre */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <FaTimesCircle size={20} />
        </button>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FaSave /> Actualizar Préstamo
        </h3>

        {/* Formulario */}
        <form className="space-y-4">
          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Monto Solicitado
            </label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              placeholder="Ejemplo: 1000"
              className="border rounded p-2 w-full text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Interés */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Interés (%)
            </label>
            <input
              type="number"
              name="interes"
              value={formData.interes}
              onChange={handleChange}
              placeholder="Ejemplo: 5"
              className="border rounded p-2 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="border rounded p-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700"
            >
              <option value="">Selecciona un estado</option>
              <option value="APROBADO">Aprobado</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="RECHAZADO">Rechazado</option>
              <option value="PAGADO">Pagado</option>
              <option value="VENCIDO">Vencido</option>
            </select>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              className={`bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-600 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleActualizar}
              disabled={isLoading} // Desactivar el botón durante la carga
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Guardando...
                </div>
              ) : (
                <>
                  <FaSave size={16} /> Guardar Cambios
                </>
              )}
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600 transition-colors"
              onClick={onClose}
            >
              <FaTimesCircle size={16} /> Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActualizarPrestamoModal;