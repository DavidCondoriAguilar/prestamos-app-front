import { useState, useEffect } from "react";
import { createCliente, deleteCliente, getClienteById, getClientes, updateCliente } from "../api/clienteApi";

const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener todos los clientes
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      setError("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  // Obtener cliente por ID
  const fetchClienteById = async (id) => {
    try {
      const data = await getClienteById(id);
      return data;
    } catch (err) {
      setError("Error al cargar el cliente");
      return null;
    }
  };

  // Crear cliente
  const addCliente = async (cliente) => {
    try {
      const nuevoCliente = await createCliente(cliente);
      setClientes((prev) => [...prev, nuevoCliente]);
      return true;
    } catch (err) {
      setError("Error al crear el cliente");
      return false;
    }
  };

  // Actualizar cliente
  const editCliente = async (id, cliente) => {
    try {
      const clienteActualizado = await updateCliente(id, cliente);
      setClientes((prev) =>
        prev.map((c) => (c.id === id ? clienteActualizado : c))
      );
      return true;
    } catch (err) {
      setError("Error al actualizar el cliente");
      return false;
    }
  };

  // Eliminar cliente
  const removeCliente = async (id) => {
    try {
      await deleteCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      setError("Error al eliminar el cliente");
      return false;
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return { clientes, loading, error, fetchClienteById, addCliente, editCliente, removeCliente };
};

export default useClientes;
