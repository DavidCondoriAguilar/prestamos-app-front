import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import clienteApi from '../api/clienteApi';

export const useClienteStore = create(devtools((set, get) => ({
  clientes: [],
  isLoading: false,
  error: null,

  // Acción para buscar todos los clientes
  fetchClientes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await clienteApi.getAll();
      set({ clientes: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Acción para añadir un nuevo cliente
  addCliente: async (newClienteData) => {
    set({ isLoading: true, error: null });
    try {
      const clienteCreado = await clienteApi.create(newClienteData);
      if (clienteCreado) {
        set((state) => ({
          clientes: [...state.clientes, clienteCreado],
          isLoading: false,
        }));
        return clienteCreado; // Return the created client for further processing
      } else {
        set({ error: "Error al crear el cliente: No se recibieron datos", isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error; // Re-throw to handle in the component
    }
  },

  // Acción para actualizar un cliente existente
  updateCliente: async (id, updatedClienteData) => {
    set({ isLoading: true, error: null });
    try {
      const clienteActualizado = await clienteApi.update(id, updatedClienteData);
      if (clienteActualizado) {
        set((state) => ({
          clientes: state.clientes.map((cliente) =>
            cliente.id === id ? clienteActualizado : cliente
          ),
          isLoading: false,
        }));
        return clienteActualizado;
      } else {
        set({ error: "Error al actualizar el cliente: No se recibieron datos", isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Acción para eliminar un cliente
  deleteCliente: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await clienteApi.delete(id);
      set((state) => ({
        clientes: state.clientes.filter((cliente) => cliente.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Acción para buscar clientes
  searchClientes: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const resultados = await clienteApi.search(query);
      set({ clientes: resultados, isLoading: false });
      return resultados;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
})));
