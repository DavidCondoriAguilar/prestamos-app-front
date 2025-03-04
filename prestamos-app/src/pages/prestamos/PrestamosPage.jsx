import React, { useEffect, useState } from "react";
import FiltrarPorClienteModal from "./FiltrarPorClienteModal";
import FiltrarPorEstadoModal from "./FiltrarPorEstadoModal";
import CalcularInteresModal from "./CalcularInteresModal";
import CalcularMontoRestanteModal from "./CalcularMontoRestanteModal";
import PrestamosList from "./PrestamosList";
import ActualizarPrestamoModal from "./ActualizarPrestamoModal";
import BuscarPrestamoModal from "./BuscarPrestamoModal";
import CrearPrestamoModal from "./CrearPrestamoModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { actualizarEstadoPrestamo, obtenerTodosLosPrestamos } from "../../api/prestamoApi";
const PrestamosPage = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState({
        crear: false,
        actualizar: false,
        buscar: false,
        filtrarCliente: false,
        filtrarEstado: false,
        calcularInteres: false,
        calcularMontoRestante: false,
    });

    // Obtener todos los préstamos al cargar la página
    useEffect(() => {
        fetchPrestamos();
    }, []);

    const fetchPrestamos = async () => {
        const data = await obtenerTodosLosPrestamos();
        setPrestamos(data);
    };

    const actualizarEstado = async (id, nuevoEstado) => {
        try {
            await actualizarEstadoPrestamo(id, nuevoEstado); // Llama al endpoint
            toast.success("Estado del préstamo actualizado correctamente"); // Notificación de éxito
            fetchPrestamos(); // Refresca la lista de préstamos
        } catch (error) {
            console.error("Error al actualizar el estado:", error);
            toast.error("Hubo un error al actualizar el estado del préstamo");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Sistema de Gestión de Préstamos</h1>

            {/* Botones para abrir modales */}
            <div className="flex justify-center gap-4 mb-6">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen({ ...isModalOpen, crear: true })}
                >
                    Crear Préstamo
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen({ ...isModalOpen, buscar: true })}
                >
                    Buscar Préstamo
                </button>
                <button
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen({ ...isModalOpen, filtrarCliente: true })}
                >
                    Filtrar por Cliente
                </button>
                <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen({ ...isModalOpen, filtrarEstado: true })}
                >
                    Filtrar por Estado
                </button>
            </div>

            {/* Lista de Préstamos */}
            <PrestamosList
                prestamos={prestamos}
                onEliminar={fetchPrestamos}
                onActualizarEstado={actualizarEstado} 
            />

            {/* Modales */}
            <CrearPrestamoModal
                isOpen={isModalOpen.crear}
                onClose={() => setIsModalOpen({ ...isModalOpen, crear: false })}
                onCreado={fetchPrestamos}
            />
            <ActualizarPrestamoModal
                isOpen={isModalOpen.actualizar}
                onClose={() => setIsModalOpen({ ...isModalOpen, actualizar: false })}
                onActualizado={fetchPrestamos}
            />
            <BuscarPrestamoModal
                isOpen={isModalOpen.buscar}
                onClose={() => setIsModalOpen({ ...isModalOpen, buscar: false })}
            />
            <FiltrarPorClienteModal
                isOpen={isModalOpen.filtrarCliente}
                onClose={() => setIsModalOpen({ ...isModalOpen, filtrarCliente: false })}
                onFiltrado={setPrestamos}
            />
            <FiltrarPorEstadoModal
                isOpen={isModalOpen.filtrarEstado}
                onClose={() => setIsModalOpen({ ...isModalOpen, filtrarEstado: false })}
                onFiltrado={setPrestamos}
            />
            <CalcularInteresModal
                isOpen={isModalOpen.calcularInteres}
                onClose={() => setIsModalOpen({ ...isModalOpen, calcularInteres: false })}
            />
            <CalcularMontoRestanteModal
                isOpen={isModalOpen.calcularMontoRestante}
                onClose={() => setIsModalOpen({ ...isModalOpen, calcularMontoRestante: false })}
            />
        </div>
    );
};

export default PrestamosPage;