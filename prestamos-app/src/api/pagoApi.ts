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
export const registrarPago = async (prestamoId: number, pagoData: Omit<Pago, 'id' | 'prestamoId'>): Promise<Pago> => {
  console.log('Datos recibidos para registrar pago:', { prestamoId, pagoData });
  
  // Validar que el prestamoId sea un número válido
  const idPrestamo = Number(prestamoId);
  if (isNaN(idPrestamo) || idPrestamo <= 0) {
    const errorMsg = `ID de préstamo inválido: ${prestamoId}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Validar el monto del pago
  const montoPago = Number(pagoData.montoPago);
  if (isNaN(montoPago) || montoPago <= 0) {
    const errorMsg = `Monto de pago inválido: ${pagoData.montoPago}`;
    console.error(errorMsg);
    throw new Error('El monto del pago debe ser mayor a cero');
  }

  // Asegurar que la fecha tenga el formato correcto
  const fechaPago = pagoData.fecha || new Date().toISOString().split('T')[0];

  // Crear el objeto de pago que coincida exactamente con PagoModel del backend
  const pagoParaEnviar = {
    // El ID no es necesario para crear un nuevo pago
    montoPago: montoPago, // Usamos montoPago que es el nombre del campo en PagoModel
    fecha: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    prestamoId: idPrestamo // El ID del préstamo al que pertenece el pago
  };

  console.log('Enviando pago al servidor:', pagoParaEnviar);

  try {
    // Según el ejemplo de Postman, la URL debe incluir el ID del préstamo
    const url = `${API_URL}/${idPrestamo}`;
    
    console.log('Enviando pago a:', url);
    console.log('Datos del pago:', pagoParaEnviar);
    
    const response = await axios.post<Pago>(
      url,
      pagoParaEnviar,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      }
    );
    
    if (!response.data) {
      throw new Error('No se recibieron datos en la respuesta del servidor');
    }
    
    console.log('Pago registrado exitosamente:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error completo al registrar pago:', error);
    
    let errorMessage = 'Error al registrar el pago';
    
    if (error.response) {
      // El servidor respondió con un error
      console.error('Respuesta de error del servidor:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      
      // Intentar obtener un mensaje de error más descriptivo
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
        }
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else {
      // Error en la configuración de la solicitud
      console.error('Error al configurar la solicitud:', error.message);
      errorMessage = `Error de configuración: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
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