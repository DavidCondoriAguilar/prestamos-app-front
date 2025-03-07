import React, { useState } from "react";
import { toast } from "react-toastify";
import useClientes from "../../hooks/useClientes";
import BuscadorClientes from "../../components/clientes/BuscadorClientes";
import ListaClientes from "../../components/clientes/ListaClientes";
import ModalDetallesCliente from "../../components/clientes/ModalDetallesCliente";
import { createCliente } from "../../api/clienteApi"; // Importar función para crear cliente
import ModalCrearCliente from "../../components/clientes/ModalCrearCliente";

const ClienteList = () => {
  const { clientes, loading, error, refetch } = useClientes();
  const [filtroNombre, setFiltroNombre] = useState(""); // Estado para el filtro de búsqueda
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Estado para el modal de detalles
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de creación

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="mt-4 text-lg font-medium text-gray-300">Cargando...</p>
      </div>
    );

  if (error)
    return (
      <p className="text-center mt-6 text-lg text-red-500">{error}</p>
    );

  // Filtrar clientes por nombre
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  // Función para abrir el modal de detalles
  const handleVerDetalles = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setClienteSeleccionado(null);
  };

  // Función para crear un cliente
  const handleCrearCliente = async (nuevoCliente) => {
    try {
      await createCliente(nuevoCliente);
      toast.success("Cliente creado correctamente.");
      refetch(); // Refrescar la lista de clientes
      setIsModalOpen(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      toast.error("Error al crear el cliente.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Lista de Clientes</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)} // Abrir modal de creación
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md"
          >
            Crear Cliente
          </button>
          <button
            onClick={() => refetch()} // Refrescar la lista
            className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md"
          >
            Refrescar
          </button>
        </div>
      </div>

      {/* Buscador de Clientes */}
      <BuscadorClientes filtroNombre={filtroNombre} setFiltroNombre={setFiltroNombre} />

      {/* Lista de Clientes */}
      <ListaClientes
        clientes={clientesFiltrados}
        onVerDetalles={handleVerDetalles}
      />

      {/* Modal de Detalles del Cliente */}
      {clienteSeleccionado && (
        <ModalDetallesCliente
          cliente={clienteSeleccionado}
          onClose={handleCloseModal}
        />
      )}

      {/* Modal de Creación de Cliente */}
      {isModalOpen && (
        <ModalCrearCliente
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onClienteCreado={handleCrearCliente}
        />
      )}
    </div>
  );
};

export default ClienteList;