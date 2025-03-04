import React, { useState } from "react";
import { calcularInteresTotal } from "../../api/prestamoApi";

const CalcularInteresModal = ({ isOpen, onClose }) => {
    const [idBuscar, setIdBuscar] = useState("");
    const [interesTotal, setInteresTotal] = useState(null);

    const handleCalcular = async () => {
        const id = parseInt(idBuscar);
        if (!id || id <= 0) {
            alert("Por favor, ingresa un ID de préstamo válido");
            return;
        }

        // Llamar al backend para calcular el interés total
        const interes = await calcularInteresTotal(id);
        if (interes !== null) {
            setInteresTotal(interes);
        } else {
            alert("No se pudo calcular el interés para el préstamo con ID " + id);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Calcular Interés Total</h2>
                <div className="flex gap-2 mb-4">
                    <input
                        type="number"
                        value={idBuscar}
                        onChange={(e) => setIdBuscar(e.target.value)}
                        placeholder="ID del Préstamo"
                        className="border p-2 flex-grow"
                    />
                    <button
                        className="bg-teal-500 text-white px-4 py-2 rounded"
                        onClick={handleCalcular}
                    >
                        Calcular
                    </button>
                </div>
                {interesTotal !== null && (
                    <p className="mt-2">Interés Total: {interesTotal}</p>
                )}
                <div className="flex justify-end mt-4">
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

export default CalcularInteresModal;