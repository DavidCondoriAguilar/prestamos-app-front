import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { obtenerPrestamoPorId } from "../../api/prestamoApi";
import { FaSearch, FaTimes, FaFileInvoiceDollar, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

    const modalRef = useRef(null);

    // Cerrar modal al presionar Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Cerrar al hacer clic fuera del modal
    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        ref={modalRef}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-700/50"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Encabezado */}
                        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900/80">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-400 mr-3">
                                        <FaFileInvoiceDollar className="text-lg" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-400">
                                            Buscar Préstamo
                                        </h2>
                                        <p className="text-sm text-gray-400">Ingresa el ID del préstamo a buscar</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-gray-700/50 transition-colors"
                                    title="Cerrar"
                                    aria-label="Cerrar modal"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Contenido con scroll */}
                        <div className="flex flex-col h-[70vh] max-h-[600px]">
                            <div className="p-6 pb-0">
                                {/* Campo de búsqueda */}
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaSearch className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="number"
                                        value={idBuscar}
                                        onChange={(e) => setIdBuscar(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                                        placeholder="Ejemplo: 123"
                                        className="block w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all duration-200"
                                        aria-label="ID del préstamo"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Área de resultados con scroll */}
                            <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
                                {/* Resultado de la búsqueda */}
                                {prestamoEncontrado && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 space-y-5"
                                    >
                                        {/* Resumen del préstamo */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-semibold text-white">Resumen del Préstamo</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    prestamoEncontrado.estado === 'PAGADO' ? 'bg-green-900/30 text-green-400' :
                                                    prestamoEncontrado.estado === 'PENDIENTE' ? 'bg-yellow-900/30 text-yellow-400' :
                                                    'bg-red-900/30 text-red-400'
                                                }`}>
                                                    {prestamoEncontrado.estado}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2 p-3 bg-gray-700/30 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-400">ID del Préstamo</p>
                                                    <p className="text-white font-mono">#{prestamoEncontrado.id}</p>
                                                </div>
                                                <div className="space-y-2 p-3 bg-gray-700/30 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-400">Monto Principal</p>
                                                    <p className="text-white font-mono">${prestamoEncontrado.monto.toFixed(2)}</p>
                                                </div>
                                                <div className="space-y-2 p-3 bg-gray-700/30 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-400">Tasa de Interés</p>
                                                    <p className="text-white">{prestamoEncontrado.interes.toFixed(2)}%</p>
                                                </div>
                                                <div className="space-y-2 p-3 bg-gray-700/30 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-400">Interés Moratorio</p>
                                                    <p className="text-white">{prestamoEncontrado.interesMoratorio.toFixed(2)}%</p>
                                                </div>
                                                <div className="space-y-2 p-3 bg-gray-700/30 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-400">Saldo Pendiente</p>
                                                    <p className={`font-mono ${
                                                        parseFloat(prestamoEncontrado.deudaRestante) <= 0 
                                                            ? 'text-green-400' 
                                                            : 'text-white'
                                                    }`}>
                                                        ${Math.abs(prestamoEncontrado.deudaRestante).toFixed(2)}
                                                        {parseFloat(prestamoEncontrado.deudaRestante) < 0 && ' (A favor)'}
                                                    </p>
                                                </div>
                                                <div className="space-y-2 p-3 bg-gray-700/30 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-400">Cliente ID</p>
                                                    <p className="text-white">{prestamoEncontrado.clienteId}</p>
                                                </div>
                                            </div>

                                            {/* Fechas */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                <div className="space-y-2 p-3 bg-gray-800/40 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-400">Fecha de Desembolso</p>
                                                    <p className="text-white">{new Date(prestamoEncontrado.fechaCreacion).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</p>
                                                </div>
                                                <div className="space-y-2 p-3 bg-gray-800/40 rounded-lg">
                                                    <p className="text-xs font-medium text-gray-400">Fecha de Vencimiento</p>
                                                    <p className="text-white">{new Date(prestamoEncontrado.fechaVencimiento).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sección de Pagos */}
                                        <div className="mt-6 pt-4 border-t border-gray-700/50">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-base font-semibold text-white">Historial de Pagos</h4>
                                                <span className="text-xs px-2.5 py-1 bg-blue-900/30 text-blue-400 rounded-full">
                                                    {prestamoEncontrado.pagos?.length || 0} {prestamoEncontrado.pagos?.length === 1 ? 'pago' : 'pagos'}
                                                </span>
                                            </div>
                                            
                                            {prestamoEncontrado.pagos?.length > 0 ? (
                                                <div className="space-y-3">
                                                    {prestamoEncontrado.pagos.map((pago, index) => {
                                                        const montoPago = parseFloat(pago.monto || pago.montoPago || 0);
                                                        const fechaPago = pago.fecha || pago.fechaPago || new Date().toISOString();
                                                        
                                                        return (
                                                            <div key={index} className="flex justify-between items-center p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                                        <span className="text-xs font-medium">#{index + 1}</span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-white">
                                                                            Pago de ${montoPago.toFixed(2)}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400">
                                                                            {new Date(fechaPago).toLocaleString('es-ES', {
                                                                                year: 'numeric',
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-sm font-medium text-green-400">
                                                                    +${montoPago.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 bg-gray-800/30 rounded-lg border border-dashed border-gray-700/50">
                                                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-3">
                                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-400 text-sm">No hay pagos registrados para este préstamo</p>
                                                    <p className="text-gray-500 text-xs mt-1">Los pagos aparecerán aquí cuando se realicen</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            
                            {/* Pie del modal */}
                            <div className="p-6 pt-0">
                                <div className="mt-6 flex justify-between items-center">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600/50 transition-colors flex items-center gap-2"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                        Cerrar
                                    </button>
                                    <button
                                        onClick={handleBuscar}
                                        disabled={!idBuscar.trim()}
                                        className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                            idBuscar.trim()
                                                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg shadow-yellow-500/20'
                                                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        Buscar préstamo
                                        <FaArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BuscarPrestamoModal;