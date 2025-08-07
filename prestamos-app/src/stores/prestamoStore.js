import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  obtenerTodosLosPrestamos,
  obtenerPrestamoPorId,
  crearPrestamo,
  actualizarPrestamo,
  actualizarEstadoPrestamo,
  eliminarPrestamo,
  obtenerPrestamosPorCliente,
  obtenerPrestamosPorEstado,
  calcularInteresTotal,
  calcularMontoRestante,
} from '../api/prestamoApi';

export const usePrestamoStore = create(devtools((set, get) => ({
  prestamos: [],
  prestamoSeleccionado: null,
  isLoading: false,
  error: null,

  // Acción para obtener todos los préstamos
  fetchPrestamos: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await obtenerTodosLosPrestamos();
      set({ prestamos: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Acción para obtener un préstamo por ID
  fetchPrestamoById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await obtenerPrestamoPorId(id);
      set({ prestamoSeleccionado: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // Acción para crear un préstamo
  addPrestamo: async (prestamoData) => {
    set({ isLoading: true, error: null });
    try {
      const { data: nuevoPrestamo, error } = await crearPrestamo(prestamoData);
      if (error) {
        throw new Error(error);
      }
      set((state) => ({
        prestamos: [...state.prestamos, nuevoPrestamo],
        isLoading: false,
      }));
      return nuevoPrestamo;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Acción para actualizar un préstamo
  updatePrestamo: async (id, prestamoData) => {
    set({ isLoading: true, error: null });
    try {
      const prestamoActualizado = await actualizarPrestamo(id, prestamoData);
      set((state) => ({
        prestamos: state.prestamos.map((p) =>
          p.id === id ? prestamoActualizado : p
        ),
        prestamoSeleccionado: prestamoActualizado, // Actualizar si es el seleccionado
        isLoading: false,
      }));
      return prestamoActualizado;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Acción para actualizar el estado de un préstamo
  updatePrestamoEstado: async (id, nuevoEstado) => {
    set({ isLoading: true, error: null });
    try {
      await actualizarEstadoPrestamo(id, nuevoEstado);
      set((state) => ({
        prestamos: state.prestamos.map((p) =>
          p.id === id ? { ...p, estado: nuevoEstado } : p
        ),
        prestamoSeleccionado: state.prestamoSeleccionado?.id === id ? { ...state.prestamoSeleccionado, estado: nuevoEstado } : state.prestamoSeleccionado,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Acción para eliminar un préstamo
  removePrestamo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await eliminarPrestamo(id);
      set((state) => ({
        prestamos: state.prestamos.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Acción para obtener préstamos por cliente
  fetchPrestamosByCliente: async (clienteId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await obtenerPrestamosPorCliente(clienteId);
      set({ prestamos: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // Acción para obtener préstamos por estado
  fetchPrestamosByEstado: async (estado) => {
    set({ isLoading: true, error: null });
    try {
      const data = await obtenerPrestamosPorEstado(estado);
      set({ prestamos: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // Acción para calcular el interés total de un préstamo
  calculateInteresTotal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await calcularInteresTotal(id);
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // Acción para calcular el monto restante de un préstamo
  calculateMontoRestante: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await calcularMontoRestante(id);
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
})));
