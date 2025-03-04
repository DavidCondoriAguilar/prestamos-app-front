import React, { useState } from "react";
import { toast } from "react-toastify";
import useClientes from "../../hooks/useClientes";
import BuscadorClientes from "../../components/clientes/BuscadorClientes";
import ListaClientes from "../../components/clientes/ListaClientes";
import ModalDetallesCliente from "../../components/clientes/ModalDetallesCliente";

const ClienteList = () => {
  const { clientes, loading, error, refetch } = useClientes();
  const [filtroNombre, setFiltroNombre] = useState(""); // Estado para el filtro de búsqueda
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Estado para el modal de detalles

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Lista de Clientes</h1>
        <button
          onClick={() => refetch()} // Refrescar la lista
          className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md"
        >
          Refrescar
        </button>
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
    </div>
  );
};

export default ClienteList;