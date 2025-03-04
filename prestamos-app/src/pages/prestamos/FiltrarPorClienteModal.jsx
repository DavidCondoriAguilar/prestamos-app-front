import React, { useState } from "react";
import { obtenerPrestamosPorCliente } from "../../api/prestamoApi";

const FiltrarPorClienteModal = ({ isOpen, onClose, onFiltrado }) => {
    const [clienteId, setClienteId] = useState("");

    const handleFiltrar = async () => {
        const id = parseInt(clienteId);
        if (!id || id <= 0) {
            alert("Por favor, ingresa un ID de cliente válido");
            return;
        }

        // Llamar al backend para obtener los préstamos del cliente
        const data = await obtenerPrestamosPorCliente(id);
        onFiltrado(data); // Notificar al padre con los resultados
        onClose(); // Cerrar el modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Filtrar Préstamos por Cliente</h2>
                <div className="flex gap-2 mb-4">
                    <input
                        type="number"
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                        placeholder="ID del Cliente"
                        className="border text-black rounded p-2 flex-grow rounded-br-2xl"
                    />
                    <button
                        className="bg-purple-500 text-white px-4 py-2 rounded"
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

export default FiltrarPorClienteModal;