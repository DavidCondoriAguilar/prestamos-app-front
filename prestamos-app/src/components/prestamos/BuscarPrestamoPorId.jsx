import React, { useState } from "react";
import { obtenerPrestamoPorId } from "../../api/prestamoApi";

const BuscarPrestamoPorId = () => {
    const [idBuscar, setIdBuscar] = useState("");
    const [prestamoEncontrado, setPrestamoEncontrado] = useState(null);

    const handleBuscar = async () => {
        const id = parseInt(idBuscar);
        const prestamo = await obtenerPrestamoPorId(id);
        setPrestamoEncontrado(prestamo);
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Buscar Préstamo por ID</h2>
            <div className="flex gap-2">
                <input
                    type="number"
                    value={idBuscar}
                    onChange={(e) => setIdBuscar(e.target.value)}
                    placeholder="ID del Préstamo"
                    className="border p-2"
                />
                <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                    onClick={handleBuscar}
                >
                    Buscar
                </button>
            </div>
            {prestamoEncontrado && (
                <div className="mt-2 p-2 bg-gray-100">
                    <p>ID: {prestamoEncontrado.id}</p>
                    <p>Monto: {prestamoEncontrado.monto}</p>
                    <p>Estado: {prestamoEncontrado.estado}</p>
                </div>
            )}
        </div>
    );
};

export default BuscarPrestamoPorId;