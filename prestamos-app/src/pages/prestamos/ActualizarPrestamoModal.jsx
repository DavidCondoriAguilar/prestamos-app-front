import React, { useState } from "react";
import { actualizarPrestamo } from "../../api/prestamoApi";

const ActualizarPrestamoModal = ({ isOpen, onClose, onActualizado }) => {
    const [id, setId] = useState("");
    const [monto, setMonto] = useState("");
    const [clienteId, setClienteId] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar campos
        if (!id || id <= 0) {
            alert("El ID del préstamo es obligatorio");
            return;
        }
        if (!monto || monto <= 0) {
            alert("El monto debe ser mayor que cero");
            return;
        }
        if (!clienteId || clienteId <= 0) {
            alert("El ID del cliente es obligatorio");
            return;
        }

        // Preparar datos para enviar al backend
        const prestamoActualizado = {
            monto: parseFloat(monto),
            clienteId: parseInt(clienteId),
        };

        console.log("Datos enviados al backend:", prestamoActualizado);

        // Llamar al backend para actualizar el préstamo
        const resultado = await actualizarPrestamo(parseInt(id), prestamoActualizado);
        if (resultado) {
            alert("Préstamo actualizado exitosamente");
            onActualizado(); // Notificar al padre que se actualice la lista
            onClose(); // Cerrar el modal
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Actualizar Préstamo</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Campo para el ID del préstamo */}
                    <input
                        type="number"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="ID del Préstamo"
                        className="border p-2"
                        required
                    />

                    {/* Campo para el nuevo monto */}
                    <input
                        type="number"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        placeholder="Nuevo Monto"
                        className="border p-2"
                        required
                    />

                    {/* Campo para el nuevo ID del cliente */}
                    <input
                        type="number"
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                        placeholder="Nuevo ID del Cliente"
                        className="border p-2"
                        required
                    />

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Actualizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActualizarPrestamoModal;