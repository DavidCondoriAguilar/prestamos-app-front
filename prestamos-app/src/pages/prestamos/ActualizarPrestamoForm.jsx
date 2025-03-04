import React, { useState } from "react";
import { actualizarPrestamo } from "../../api/prestamoApi";

const ActualizarPrestamoForm = ({ onActualizado }) => {
    const [id, setId] = useState("");
    const [monto, setMonto] = useState("");
    const [clienteId, setClienteId] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const prestamoActualizado = { monto: parseFloat(monto), clienteId: parseInt(clienteId) };
        const resultado = await actualizarPrestamo(parseInt(id), prestamoActualizado);
        if (resultado) {
            alert("Préstamo actualizado exitosamente");
            onActualizado(); // Notificar al padre que se actualice la lista
        }
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Actualizar Préstamo</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                    type="number"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="ID del Préstamo"
                    className="border p-2"
                    required
                />
                <input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="Nuevo Monto"
                    className="border p-2"
                    required
                />
                <input
                    type="number"
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    placeholder="Nuevo ID del Cliente"
                    className="border p-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Actualizar Préstamo
                </button>
            </form>
        </div>
    );
};

export default ActualizarPrestamoForm;