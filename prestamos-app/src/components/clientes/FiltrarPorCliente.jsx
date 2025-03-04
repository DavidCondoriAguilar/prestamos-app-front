import React, { useState } from "react";
import { obtenerPrestamosPorCliente } from "../../api/prestamoApi";

const FiltrarPorCliente = ({ onFiltrado }) => {
    const [clienteId, setClienteId] = useState("");

    const handleFiltrar = async () => {
        const id = parseInt(clienteId);
        const data = await obtenerPrestamosPorCliente(id);
        onFiltrado(data); // Notificar al padre con los resultados
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Filtrar Préstamos por Cliente</h2>
            <div className="flex gap-2">
                <input
                    type="number"
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    placeholder="ID del Cliente"
                    className="border p-2 text-red-500"
                />
                <button
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                    onClick={handleFiltrar}
                >
                    Filtrar
                </button>
            </div>
        </div>
    );
};

export default FiltrarPorCliente;