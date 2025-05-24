// components/ClienteList.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useClientes from "../../hooks/useClientes";
import BuscadorClientes from "../../components/clientes/BuscadorClientes";
import ListaClientes from "../../components/clientes/ListaClientes";
import ModalDetallesCliente from "../../components/clientes/ModalDetallesCliente";
import { createCliente, deleteCliente } from "../../api/clienteApi";
import ModalCrearCliente from "../../components/clientes/ModalCrearCliente";
import { FiPlus, FiChevronLeft, FiChevronRight, FiUser, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ClienteList = () => {
  const { clientes: clientesIniciales, loading, error } = useClientes();
  const [clientes, setClientes] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setClientes(clientesIniciales);
  }, [clientesIniciales]);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) ||
    (cliente.correo && cliente.correo.toLowerCase().includes(filtroNombre.toLowerCase()))
  );

  const totalItems = clientesFiltrados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [clientesFiltrados, totalPages, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const clientesPaginados = clientesFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const handleVerDetalles = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  const handleCloseModal = () => {
    setClienteSeleccionado(null);
  };

  const handleCrearCliente = async (nuevoCliente) => {
    if (!nuevoCliente.nombre || !nuevoCliente.correo) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }
  
    try {
      const clienteCreado = await createCliente(nuevoCliente);
      toast.success("Cliente creado correctamente.");
      
      // Actualizamos el estado para que se refleje inmediatamente en la UI
      setClientes((prevClientes) => [...prevClientes, clienteCreado]);
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      toast.error(error.message || "Error al crear el cliente.");
    }
  };

  // Función para eliminar un cliente
  const handleEliminarCliente = async (id) => {
    try {
      await deleteCliente(id);
      // Actualizar el estado eliminando el cliente
      setClientes(prevClientes => prevClientes.filter(cliente => cliente.id !== id));
      toast.success("Cliente eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      toast.error(error.message || "Error al eliminar el cliente.");
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl min-h-[calc(100vh-4rem)] flex flex-col">
      <AnimatePresence>
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 flex items-center justify-center">
                <FiUser className="text-white text-2xl" />
              </div>
              <div className="h-4 bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-32"></div>
            </div>
            <p className="mt-6 text-lg font-medium text-gray-400">Cargando clientes...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-lg"
          >
            <p className="text-red-300 font-medium">Error al cargar los clientes</p>
            <p className="text-red-400 text-sm mt-1">{error}</p>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Gestión de Clientes
                </h1>
                <p className="text-gray-400 mt-1">
                  {totalItems} {totalItems === 1 ? 'cliente registrado' : 'clientes registrados'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="text-lg" />
                Nuevo Cliente
              </motion.button>
            </div>

            <div className="mb-6">
              <BuscadorClientes filtroNombre={filtroNombre} setFiltroNombre={setFiltroNombre} />
            </div>

            <div className="bg-gray-800/50 rounded-xl p-1 border border-gray-700/50 flex-1 flex flex-col">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="col-span-5 md:col-span-4">Cliente</div>
                <div className="col-span-4 md:col-span-3">Correo</div>
                <div className="col-span-3 hidden md:block">Cuenta Bancaria</div>
                <div className="col-span-4 md:col-span-2 text-right">Acciones</div>
              </div>
              
              <div className="flex-grow overflow-y-auto max-h-[calc(100vh-350px)] custom-scrollbar">
                {clientesPaginados.length > 0 ? (
                  <ListaClientes 
                    clientes={clientesPaginados} 
                    onVerDetalles={handleVerDetalles}
                    onEliminar={handleEliminarCliente}
                    formatDate={formatDate}
                  />
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 px-4 text-center"
                  >
                    <div className="bg-gray-700/50 p-6 rounded-full mb-4">
                      <FiUser className="text-gray-500 text-3xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-1">No se encontraron clientes</h3>
                    <p className="text-gray-500 max-w-md">
                      {filtroNombre 
                        ? `No hay clientes que coincidan con "${filtroNombre}"`
                        : 'Comienza agregando tu primer cliente'}
                    </p>
                    {!filtroNombre && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-all duration-200"
                      >
                        <FiPlus />
                        Agregar Cliente
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </div>
              
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-700/50 mt-auto">
                  <p className="text-sm text-gray-400 mb-2 sm:mb-0">
                    Mostrando <span className="font-medium text-white">{clientesPaginados.length}</span> de <span className="font-medium text-white">{totalItems}</span> clientes
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronLeft className="text-gray-300" />
                    </button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                        const pageNum = currentPage <= 3 ? idx + 1 : 
                                        currentPage >= totalPages - 2 ? totalPages - 4 + idx :
                                        currentPage - 2 + idx;
                        if (pageNum < 1 || pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                              currentPage === pageNum 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-400 hover:bg-gray-700/50'
                            } transition-colors`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronRight className="text-gray-300" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {clienteSeleccionado && (
              <ModalDetallesCliente 
                cliente={clienteSeleccionado} 
                onClose={handleCloseModal} 
                formatDate={formatDate}
              />
            )}

            {isModalOpen && (
              <ModalCrearCliente
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onClienteCreado={handleCrearCliente}
              />
            )}
          </>
        )}
      </AnimatePresence>
      
      {/* Estilos personalizados para la barra de desplazamiento */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ClienteList;
