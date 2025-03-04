import React, { useState } from "react";
import { crearPrestamo } from "../../api/prestamoApi";
import { PrestamoModel } from "../../models/PrestamoModel";
import { toast } from "react-toastify"; // Importa toast desde react-toastify

const CrearPrestamoForm = ({ onCreado }) => {
    const [prestamo, setPrestamo] = useState({ ...PrestamoModel });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPrestamo((prev) => ({
            ...prev,
            [name]: name === "monto" || name === "clienteId" ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar campos obligatorios
        if (!prestamo.monto || prestamo.monto <= 0) {
            toast.error("El monto debe ser mayor que cero", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
        if (!prestamo.clienteId || prestamo.clienteId <= 0) {
            toast.error("El ID del cliente es obligatorio", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            // Enviar solicitud al backend
            const resultado = await crearPrestamo(prestamo);
            if (resultado) {
                toast.success("Préstamo creado exitosamente", {
                    position: "top-right",
                    autoClose: 3000,
                });
                onCreado(); // Notificar al padre que se actualice la lista
            }
        } catch (error) {
            toast.error("Error al crear el préstamo", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Crear Nuevo Préstamo</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                    type="number"
                    name="monto"
                    value={prestamo.monto}
                    onChange={handleChange}
                    placeholder="Monto"
                    className="border p-2"
                    required
                />
                <input
                    type="number"
                    name="clienteId"
                    value={prestamo.clienteId}
                    onChange={handleChange}
                    placeholder="ID del Cliente"
                    className="border p-2"
                    required
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Crear Préstamo
                </button>
            </form>
        </div>
    );
};

export default CrearPrestamoForm;