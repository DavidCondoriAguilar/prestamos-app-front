import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { obtenerPagosPorPrestamo, registrarPago, eliminarPago } from '../api/pagoApi';

export const usePagoStore = create(devtools((set, get) => ({
  pagos: [],
  isLoading: false,
  error: null,
  // Acción para buscar los pagos de un préstamo específico
  fetchPagosPorPrestamo: async (prestamoId) => {
    if (!prestamoId) {
      set({ pagos: [], isLoading: false, error: null });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const pagosData = await obtenerPagosPorPrestamo(prestamoId);
      set({ pagos: pagosData, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Acción para registrar un nuevo pago
  addPago: async (prestamoId, pagoData) => {
    set({ isLoading: true, error: null });
    try {
      const nuevoPago = await registrarPago(prestamoId, pagoData);
      // Después de añadir, podríamos querer refrescar la lista o añadirlo directamente
      // Por simplicidad, lo añadiremos al estado actual si no estamos paginando o si es relevante
      // Si se usa paginación, lo más seguro es volver a llamar a fetchPagosPaginados
      set((state) => ({
        pagos: [...state.pagos, nuevoPago],
        isLoading: false,
      }));
      return nuevoPago;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error; // Re-throw para que el componente que llama pueda manejarlo
    }
  },

  // Acción para eliminar un pago
  removePago: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await eliminarPago(id);
      set((state) => ({
        pagos: state.pagos.filter((pago) => pago.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error; // Re-throw para que el componente que llama pueda manejarlo
    }
  },
})));
