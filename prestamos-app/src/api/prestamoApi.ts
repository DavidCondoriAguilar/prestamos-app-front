import axios from "axios";
import { CrearPrestamo, Prestamo } from "../types/prestamoType";
import API_URLS from "../config/apiConfig";

const API_URL = API_URLS.PRESTAMOS;

/**
 * Función genérica para manejar solicitudes HTTP
 * @param url - URL del endpoint.
 * @param method - Método HTTP (GET, POST, PUT, DELETE).
 * @param data - Datos a enviar en caso de POST o PUT.
 * @returns Respuesta con datos o error.
 */
const fetchData = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data: any = null
): Promise<{ data: T | null; error: string | null }> => {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    const response = await axios({
      url,
      method,
      data,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });

    return { data: response.data as T, error: null };
  } catch (error: any) {
    console.error(`Error en solicitud ${method} a ${url}:`, error.message);
    if (error.response?.status === 401) {
      // Si el token es inválido o ha expirado, redirigir al login
      window.location.href = '/login';
    }
    return { 
      data: null, 
      error: error.response?.data?.message || "Ocurrió un error en la solicitud. Inténtalo de nuevo más tarde." 
    };
  }
};

/**
 * Obtiene todos los préstamos disponibles.
 * @returns Lista de préstamos o un array vacío si ocurre un error.
 */
export const obtenerTodosLosPrestamos = async (): Promise<Prestamo[]> => {
  const { data, error } = await fetchData<Prestamo[]>(API_URL);
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
};

/**
 * Obtiene un préstamo por su ID.
 * @param id - ID del préstamo.
 * @returns Datos del préstamo o null si ocurre un error.
 */
export const obtenerPrestamoPorId = async (id: number): Promise<Prestamo | null> => {
  if (!id || id <= 0) {
    console.error("ID de préstamo inválido.");
    return null;
  }

  const { data, error } = await fetchData<Prestamo>(`${API_URL}/${id}`);
  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
};

/**
 * Crea un nuevo préstamo.
 * @param prestamo - Datos del préstamo a crear.
 * @returns Datos del préstamo creado o null si ocurre un error.
 */
export const crearPrestamo = async (prestamo: CrearPrestamo): Promise<Prestamo | null> => {
  console.log("Datos enviados al backend:", prestamo);

  if (
    !prestamo.clienteId ||
    !prestamo.monto ||
    !prestamo.interes ||
    !prestamo.fechaVencimiento ||
    !prestamo.estado
  ) {
    console.error("Datos de préstamo incompletos.");
    return null;
  }

  const { data, error } = await fetchData<Prestamo>(API_URL, "POST", prestamo);
  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
};

/**
 * Actualiza un préstamo existente.
 * @param id - ID del préstamo a actualizar.
 * @param prestamo - Datos actualizados del préstamo.
 * @returns Datos del préstamo actualizado o null si ocurre un error.
 */
export const actualizarPrestamo = async (id: number, prestamo: Partial<Prestamo>): Promise<Prestamo | null> => {
  if (!id || id <= 0) {
    console.error("ID de préstamo inválido.");
    return null;
  }

  if (!prestamo.clienteId && !prestamo.monto && !prestamo.interes && !prestamo.estado) {
    console.error("No se proporcionaron datos para actualizar.");
    return null;
  }

  const { data, error } = await fetchData<Prestamo>(`${API_URL}/${id}`, "PUT", prestamo);
  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
};

/**
 * Actualiza el estado de un préstamo.
 * @param id - ID del préstamo a actualizar.
 * @param nuevoEstado - Nuevo estado del préstamo.
 */
export const actualizarEstadoPrestamo = async (id: number, nuevoEstado: string): Promise<void> => {
  if (!id || id <= 0) {
    console.error("ID de préstamo inválido.");
    throw new Error("ID de préstamo inválido.");
  }

  if (!nuevoEstado) {
    console.error("El nuevo estado no puede estar vacío.");
    throw new Error("El nuevo estado no puede estar vacío.");
  }

  const endpoint = `${API_URL}/${id}/estado`;
  const { error } = await fetchData(endpoint, "PUT", { nuevoEstado });

  if (error) {
    console.error(error);
    throw new Error(error);
  }
};

/**
 * Elimina un préstamo por su ID.
 * @param id - ID del préstamo a eliminar.
 * @returns void
 */
export const eliminarPrestamo = async (id: number): Promise<void> => {
  if (!id || id <= 0) {
    console.error("ID de préstamo inválido.");
    return;
  }

  const { error } = await fetchData(`${API_URL}/${id}`, "DELETE");
  if (error) {
    console.error(error);
  }
};

/**
 * Obtiene los préstamos asociados a un cliente específico.
 * @param clienteId - ID del cliente.
 * @returns Lista de préstamos del cliente o un array vacío si ocurre un error.
 */
export const obtenerPrestamosPorCliente = async (clienteId: number): Promise<Prestamo[]> => {
  if (!clienteId || clienteId <= 0) {
    console.error("ID de cliente inválido.");
    return [];
  }

  const { data, error } = await fetchData<Prestamo[]>(`${API_URL}/cliente/${clienteId}`);
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
};

/**
 * Obtiene los préstamos filtrados por estado.
 * @param estado - Estado del préstamo (APROBADO, PENDIENTE, etc.).
 * @returns Lista de préstamos con el estado especificado o un array vacío si ocurre un error.
 */
export const obtenerPrestamosPorEstado = async (estado: string): Promise<Prestamo[]> => {
  if (!estado) {
    console.error("Estado de préstamo inválido.");
    return [];
  }

  const { data, error } = await fetchData<Prestamo[]>(`${API_URL}/estado/${estado}`);
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
};

/**
 * Calcula el interés total de un préstamo.
 * @param id - ID del préstamo.
 * @returns Interés total o null si ocurre un error.
 */
export const calcularInteresTotal = async (id: number): Promise<number | null> => {
  if (!id || id <= 0) {
    console.error("ID de préstamo inválido.");
    return null;
  }

  const { data, error } = await fetchData<number>(`${API_URL}/${id}/interes`);
  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
};

/**
 * Calcula el monto restante de un préstamo.
 * @param id - ID del préstamo.
 * @returns Monto restante o null si ocurre un error.
 */
export const calcularMontoRestante = async (id: number): Promise<number | null> => {
  if (!id || id <= 0) {
    console.error("ID de préstamo inválido.");
    return null;
  }

  const { data, error } = await fetchData<number>(`${API_URL}/${id}/monto-restante`);
  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
};