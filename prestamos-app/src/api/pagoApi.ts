import axios from "axios";

// URL base del backend para pagos
const API_URL = "http://localhost:8080/pagos";

// Interfaces para tipar los datos
export interface Pago {
  id?: number;
  montoPago: number;
  fecha: string;
  prestamoId: number;
}

interface PaginacionResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

/**
 * Función genérica para manejar solicitudes HTTP
 * @param url - URL del endpoint.
 * @param method - Método HTTP (GET, POST, DELETE, etc.).
 * @param data - Datos a enviar en caso de POST o PUT.
 * @returns Respuesta con datos o error.
 */
const fetchData = async <T>(
  url: string,
  method: "GET" | "POST" | "DELETE" = "GET",
  data: any = null
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const response = await axios({
      url,
      method,
      data,
    });
    return { data: response.data as T, error: null };
  } catch (error: any) {
    console.error(`Error en solicitud ${method} a ${url}:`, error.message);
    return { data: null, error: "Ocurrió un error en la solicitud. Inténtalo de nuevo más tarde." };
  }
};

/**
 * Obtiene todos los pagos disponibles.
 * @returns Lista de pagos o un array vacío si ocurre un error.
 */
export const obtenerTodosLosPagos = async (): Promise<Pago[]> => {
  const { data, error } = await fetchData<Pago[]>(API_URL);
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
};

/**
 * Obtiene un pago por su ID.
 * @param id - ID del pago.
 * @returns Datos del pago o null si ocurre un error.
 */
export const obtenerPagoPorId = async (id: number): Promise<Pago | null> => {
  if (!id || id <= 0) {
    console.error("ID de pago inválido.");
    return null;
  }

  const { data, error } = await fetchData<Pago>(`${API_URL}/${id}`);
  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
};

/**
 * Registra un nuevo pago.
 * @param prestamoId - ID del préstamo asociado.
 * @param pago - Datos del pago a registrar.
 * @returns Datos del pago registrado o null si ocurre un error.
 */
export const registrarPago = async (prestamoId: number, pago: Partial<Pago>): Promise<Pago | null> => {
  if (!prestamoId || prestamoId <= 0) {
    console.error("ID de préstamo inválido.");
    return null;
  }

  if (!pago.montoPago || !pago.fecha) {
    console.error("Datos de pago incompletos.");
    return null;
  }

  const { data, error } = await fetchData<Pago>(`${API_URL}/${prestamoId}`, "POST", pago);
  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
};

/**
 * Elimina un pago por su ID.
 * @param id - ID del pago a eliminar.
 * @returns void
 */
export const eliminarPago = async (id: number): Promise<void> => {
  if (!id || id <= 0) {
    console.error("ID de pago inválido.");
    return;
  }

  const { error } = await fetchData(`${API_URL}/${id}`, "DELETE");
  if (error) {
    console.error(error);
  }
};

/**
 * Obtiene los pagos asociados a un préstamo específico.
 * @param prestamoId - ID del préstamo.
 * @returns Lista de pagos del préstamo o un array vacío si ocurre un error.
 */
export const obtenerPagosPorPrestamo = async (prestamoId: number): Promise<Pago[]> => {
  if (!prestamoId || prestamoId <= 0) {
    console.error("ID de préstamo inválido.");
    return [];
  }

  const { data, error } = await fetchData<Pago[]>(`${API_URL}/prestamo/${prestamoId}`);
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
};

/**
 * Calcula el monto restante de un préstamo.
 * @param prestamoId - ID del préstamo.
 * @returns Monto restante o null si ocurre un error.
 */
export const calcularMontoRestante = async (prestamoId: number): Promise<number | null> => {
  if (!prestamoId || prestamoId <= 0) {
    console.error("ID de préstamo inválido.");
    return null;
  }

  const { data, error } = await fetchData<number>(`${API_URL}/monto-restante/${prestamoId}`);
  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
};

/**
 * Obtiene todos los pagos disponibles con paginación.
 * @param page - Número de página (comienza desde 0).
 * @param size - Tamaño de la página (número de elementos por página).
 * @returns Datos de la página de pagos o un objeto vacío si ocurre un error.
 */
export const obtenerTodosLosPagosPaginados = async (
  page: number = 0,
  size: number = 10
): Promise<PaginacionResponse<Pago>> => {
  if (page < 0 || size <= 0) {
    console.error("Parámetros de paginación inválidos.");
    return { content: [], totalPages: 0, totalElements: 0, size: 0, number: 0 };
  }

  const { data, error } = await fetchData<PaginacionResponse<Pago>>(`${API_URL}?page=${page}&size=${size}`, "GET");
  if (error) {
    console.error(error);
    return { content: [], totalPages: 0, totalElements: 0, size: 0, number: 0 };
  }
  return data || { content: [], totalPages: 0, totalElements: 0, size: 0, number: 0 };
};