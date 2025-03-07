import { useState, useEffect } from "react";
import {
  createCliente,
  deleteCliente,
  getClienteById,
  getClientes,
  updateCliente,
} from "../api/clienteApi";

const useClientes = () => {
  const [clientes, setClientes] = useState([]); // Lista de clientes
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Función para obtener todos los clientes
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data || []); // Asegúrate de manejar un array vacío si no hay datos
    } catch (err) {
      console.error("Error al cargar los clientes:", err);
      setError("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener un cliente por ID
  const fetchClienteById = async (id) => {
    if (!id || id <= 0) {
      setError("ID de cliente inválido");
      return null;
    }

    try {
      const data = await getClienteById(id);
      return data || null; // Retorna null si no se encuentra el cliente
    } catch (err) {
      console.error(`Error al cargar el cliente con ID ${id}:`, err);
      setError("Error al cargar el cliente");
      return null;
    }
  };

  // Función para crear un cliente
  const addCliente = async (cliente) => {
    try {
      const nuevoCliente = await createCliente(cliente);
      if (nuevoCliente) {
        setClientes((prev) => [...prev, nuevoCliente]); // Agrega el nuevo cliente a la lista
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error al crear el cliente:", err);
      setError("Error al crear el cliente");
      return false;
    }
  };

  // Función para actualizar un cliente
  const editCliente = async (id, cliente) => {
    if (!id || id <= 0) {
      setError("ID de cliente inválido");
      return false;
    }

    try {
      const clienteActualizado = await updateCliente(id, cliente);
      if (clienteActualizado) {
        setClientes((prev) =>
          prev.map((c) => (c.id === id ? clienteActualizado : c))
        ); // Actualiza el cliente en la lista
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Error al actualizar el cliente con ID ${id}:`, err);
      setError("Error al actualizar el cliente");
      return false;
    }
  };

  // Función para eliminar un cliente
  const removeCliente = async (id) => {
    if (!id || id <= 0) {
      setError("ID de cliente inválido");
      return false;
    }

    try {
      await deleteCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id)); // Elimina el cliente de la lista
      return true;
    } catch (err) {
      console.error(`Error al eliminar el cliente con ID ${id}:`, err);
      setError("Error al eliminar el cliente");
      return false;
    }
  };

  // Efecto para cargar los clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    fetchClientes, // Refrescar la lista de clientes
    fetchClienteById, // Obtener un cliente por ID
    addCliente, // Crear un cliente
    editCliente, // Actualizar un cliente
    removeCliente, // Eliminar un cliente
  };
};

export default useClientes;