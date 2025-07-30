import axios from "./axiosConfig";

// Endpoint base para pagos
const PAGOS_ENDPOINT = '/api/pagos';

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
  const { data, error } = await fetchData<Pago[]>(PAGOS_ENDPOINT);
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

  const { data, error } = await fetchData<Pago>(`${PAGOS_ENDPOINT}/${id}`);
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

  // Usar la fecha proporcionada o la fecha actual con hora
  const fechaPago = pagoData.fecha || new Date().toISOString();

  // Crear el objeto de pago con la estructura que espera el backend
  // Basado en el error 404, es posible que el backend espere el pago en el cuerpo sin el ID
  const pagoParaEnviar = {
    monto: montoPago,
    fechaPago: fechaPago
    // No incluimos idPrestamo aquí ya que ya está en la URL
  };

  console.log('Enviando pago al servidor:', pagoParaEnviar);

  try {
    // Construir la URL correcta con el ID del préstamo
    const url = `${PAGOS_ENDPOINT}/${idPrestamo}`;
    
    console.log('Enviando pago a:', url);
    console.log('Datos del pago:', pagoParaEnviar);
    
    // Realizar la petición POST al endpoint correcto
    const response = await axios.post<Pago>(
      url,
      pagoParaEnviar,
      {
        validateStatus: (status) => status < 500 // Aceptar códigos de estado menores a 500 como exitosos
      }
    );
    
    // Verificar si la respuesta es exitosa (código 2xx)
    if (response.status >= 200 && response.status < 300) {
      if (!response.data) {
        console.warn('La respuesta del servidor no contiene datos');
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      
      console.log('Pago registrado exitosamente:', response.data);
      return response.data;
    }
    
    // Manejar códigos de estado de error específicos
    if (response.status === 400) {
      throw new Error('Datos de pago inválidos. Verifica la información proporcionada.');
    } else if (response.status === 401) {
      throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    } else if (response.status === 403) {
      throw new Error('No tienes permiso para realizar esta acción.');
    } else if (response.status === 404) {
      throw new Error('No se encontró el recurso solicitado. Verifica el ID del préstamo.');
    } else {
      throw new Error(`Error en el servidor: ${response.status} ${response.statusText}`);
    }
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
    throw new Error("ID de pago inválido");
  }

  const { error } = await fetchData<void>(
    `${PAGOS_ENDPOINT}/${id}`,
    "DELETE"
  );

  if (error) {
    throw new Error(error);
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

  const { data, error } = await fetchData<Pago[]>(
    `${PAGOS_ENDPOINT}/prestamo/${prestamoId}`
  );

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

  const { data, error } = await fetchData<{ montoRestante: number }>(
    `${PAGOS_ENDPOINT}/monto-restante/${prestamoId}`
  );

  if (error) {
    console.error(error);
    return null;
  }

  return data?.montoRestante ?? null;
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
  const { data, error } = await fetchData<PaginacionResponse<Pago>>(
    `${PAGOS_ENDPOINT}/paginados?page=${page}&size=${size}`
  );

  if (error || !data) {
    console.error(error || "No se pudieron obtener los pagos paginados");
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      size: 0,
      number: 0,
    };
  }

  return data;
};