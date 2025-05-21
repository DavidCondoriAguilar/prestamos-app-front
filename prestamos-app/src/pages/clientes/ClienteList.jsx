// components/ClienteList.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useClientes from "../../hooks/useClientes";
import BuscadorClientes from "../../components/clientes/BuscadorClientes";
import ListaClientes from "../../components/clientes/ListaClientes";
import ModalDetallesCliente from "../../components/clientes/ModalDetallesCliente";
import { createCliente } from "../../api/clienteApi";
import ModalCrearCliente from "../../components/clientes/ModalCrearCliente";

const ClienteList = () => {
  const { clientes: clientesIniciales, loading, error } = useClientes();
  const [clientes, setClientes] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setClientes(clientesIniciales);
  }, [clientesIniciales]);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  const totalItems = clientesFiltrados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [clientesFiltrados, totalPages]);

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
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md min-h-[600px] flex flex-col">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-900">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-lg font-medium text-gray-300">Cargando...</p>
        </div>
      ) : error ? (
        <p className="text-center mt-6 text-lg text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Lista de Clientes</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md"
              >
                Crear Cliente
              </button>
            </div>
          </div>

          <BuscadorClientes filtroNombre={filtroNombre} setFiltroNombre={setFiltroNombre} />

          <div className="flex-grow overflow-y-auto max-h-[400px]">
            <ListaClientes clientes={clientesPaginados} onVerDetalles={handleVerDetalles} />
          </div>

          {clienteSeleccionado && (
            <ModalDetallesCliente cliente={clienteSeleccionado} onClose={handleCloseModal} />
          )}

          {isModalOpen && (
            <ModalCrearCliente
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onClienteCreado={handleCrearCliente}
            />
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-white px-4">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClienteList;
