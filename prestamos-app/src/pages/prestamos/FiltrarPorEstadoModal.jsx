import React, { useState } from "react";
import { obtenerPrestamosPorEstado } from "../../api/prestamoApi";

const FiltrarPorEstadoModal = ({ isOpen, onClose, onFiltrado }) => {
    const [estado, setEstado] = useState("");

    const handleFiltrar = async () => {
        if (!estado.trim()) {
            alert("Por favor, ingresa un estado válido");
            return;
        }

        // Llamar al backend para obtener los préstamos por estado
        const data = await obtenerPrestamosPorEstado(estado);
        onFiltrado(data); // Notificar al padre con los resultados
        onClose(); // Cerrar el modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Filtrar Préstamos por Estado</h2>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        placeholder="Estado (PENDIENTE, APROBADO, PAGADO)"
                        className="border rounded p-2 flex-grow text-black"
                    />
                    <button
                        className="bg-indigo-500 text-white px-4 py-2 rounded"
                        onClick={handleFiltrar}
                    >
                        Filtrar
                    </button>
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FiltrarPorEstadoModal;