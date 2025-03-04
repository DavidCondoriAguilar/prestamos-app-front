import React, { useState } from "react";
import { toast } from "react-toastify"; // Importa toast para notificaciones
import { obtenerPrestamoPorId } from "../../api/prestamoApi";

const BuscarPrestamoModal = ({ isOpen, onClose }) => {
    const [idBuscar, setIdBuscar] = useState("");
    const [prestamoEncontrado, setPrestamoEncontrado] = useState(null);

    const handleBuscar = async () => {
        const id = parseInt(idBuscar);
        if (!id || id <= 0) {
            toast.error("Por favor, ingresa un ID válido", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            const prestamo = await obtenerPrestamoPorId(id);
            if (prestamo) {
                // Asegúrate de que todos los campos tengan valores predeterminados
                const prestamoConValoresPredeterminados = {
                    id: prestamo.id || "N/A",
                    monto: prestamo.monto || 0,
                    interes: prestamo.interes || 0,
                    interesMoratorio: prestamo.interesMoratorio || 0,
                    fechaCreacion: prestamo.fechaCreacion || "N/A",
                    fechaVencimiento: prestamo.fechaVencimiento || "N/A",
                    estado: prestamo.estado || "N/A",
                    clienteId: prestamo.clienteId || "N/A",
                    deudaRestante: prestamo.deudaRestante || 0,
                    pagos: prestamo.pagos || [],
                };
                setPrestamoEncontrado(prestamoConValoresPredeterminados);
                toast.success("Préstamo encontrado exitosamente", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.error("No se encontró ningún préstamo con ese ID", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Error al buscar préstamo:", error);
            toast.error("Ocurrió un error al buscar el préstamo", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Contenedor del Modal */}
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
                {/* Título */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Buscar Préstamo por ID</h2>

                {/* Formulario de Búsqueda */}
                <div className="flex gap-3 mb-4">
                    <input
                        type="number"
                        value={idBuscar}
                        onChange={(e) => setIdBuscar(e.target.value)}
                        placeholder="ID del Préstamo"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-black"
                    />
                    <button
                        onClick={handleBuscar}
                        className="px-5 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 ease-in-out"
                    >
                        Buscar
                    </button>
                </div>

                {/* Resultado de la Búsqueda */}
                {prestamoEncontrado && (
                    <div className="p-4 bg-gray-100 rounded-lg shadow-inner space-y-2">
                        <p className="text-lg font-semibold text-gray-800">ID: {prestamoEncontrado.id}</p>
                        <p className="text-gray-700">Monto: ${prestamoEncontrado.monto.toFixed(2)}</p>
                        <p className="text-gray-700">Interés (%): {prestamoEncontrado.interes.toFixed(2)}%</p>
                        <p className="text-gray-700">
                            Interés Moratorio (%): {prestamoEncontrado.interesMoratorio.toFixed(2)}%
                        </p>
                        <p className="text-gray-700">Fecha de Creación: {prestamoEncontrado.fechaCreacion}</p>
                        <p className="text-gray-700">Fecha de Vencimiento: {prestamoEncontrado.fechaVencimiento}</p>
                        <p className="text-gray-700">Estado: {prestamoEncontrado.estado}</p>
                        <p className="text-gray-700">Cliente ID: {prestamoEncontrado.clienteId}</p>
                        <p className="text-gray-700">Deuda Restante: ${prestamoEncontrado.deudaRestante.toFixed(2)}</p>
                        <div>
                            <p className="text-gray-700 font-medium">Pagos:</p>
                            {prestamoEncontrado.pagos.length > 0 ? (
                                <ul className="list-disc pl-5">
                                    {prestamoEncontrado.pagos.map((pago, index) => (
                                        <li key={index} className="text-gray-700">
                                            Monto: ${pago.monto?.toFixed(2) || "N/A"}, Fecha: {pago.fecha || "N/A"}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No hay pagos registrados.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Botón Cerrar */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuscarPrestamoModal;