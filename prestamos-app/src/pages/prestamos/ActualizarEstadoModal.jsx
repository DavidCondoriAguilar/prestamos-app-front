import React, { useState } from "react";
import { actualizarEstadoPrestamo } from "../../api/prestamoApi";

const ActualizarEstadoModal = ({ isOpen, onClose, onActualizado, prestamoId }) => {
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("");

    const estados = [
        "Aprobado",
        "Pendiente",
        "Rechazado",
        "Pagado",
        "Vencido"
    ];

    const handleSubmit = async () => {
        try {
            // Realizar la solicitud PUT a la API para actualizar el estado
            await actualizarEstadoPrestamo(prestamoId, estadoSeleccionado);
            onActualizado();  // Llamamos a la función onActualizado para recargar los préstamos
            onClose();  // Cerramos el modal
        } catch (error) {
            console.error("Error al actualizar el estado del préstamo", error);
        }
    };

    return (
        <div
            className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 ${isOpen ? "" : "hidden"}`}
        >
            <div className="bg-white p-6 rounded-md">
                <h2 className="text-xl font-bold mb-4">Actualizar Estado del Préstamo</h2>
                <div className="mb-4">
                    <label htmlFor="estado" className="block text-sm font-medium mb-2">Seleccionar Estado</label>
                    <select
                        id="estado"
                        value={estadoSeleccionado}
                        onChange={(e) => setEstadoSeleccionado(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Selecciona un estado</option>
                        {estados.map((estado) => (
                            <option key={estado} value={estado}>
                                {estado}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded-md"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!estadoSeleccionado}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActualizarEstadoModal;
