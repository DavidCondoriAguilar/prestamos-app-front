import { ActualizarCliente, Cliente, CrearCliente } from "../types/clienteType";
import API_URLS from "../config/apiConfig";
import { fetchWithAuth, createApiUrl } from "./apiInterceptor";

const API_URL = createApiUrl(API_URLS.CLIENTES);

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
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data);
    }

    const response = await fetchWithAuth(url, options);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const responseData = await response.json();
    return { data: responseData as T, error: null };
  } catch (error: any) {
    console.error(`Error en solicitud ${method} a ${url}:`, error.message);
    return { data: null, error: "Ocurrió un error en la solicitud. Inténtalo de nuevo más tarde." };
  }
};

/**
 * Obtiene todos los clientes disponibles.
 * @returns Lista de clientes o un array vacío si ocurre un error.
 */
export const getClientes = async (): Promise<Cliente[]> => {
  const { data, error } = await fetchData<Cliente[]>(API_URL);
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
};

/**
 * Obtiene un cliente por su ID.
 * @param id - ID del cliente.
 * @returns Datos del cliente o null si ocurre un error.
 */
export const getClienteById = async (id: number): Promise<Cliente | null> => {
  if (!id || id <= 0) {
    console.error("ID de cliente inválido.");
    return null;
  }

  const { data, error } = await fetchData<Cliente>(`${API_URL}/${id}`);
  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
};

/**
 * Crea un nuevo cliente.
 * @param cliente - Datos del cliente a crear.
 * @returns Datos del cliente creado o null si ocurre un error.
 */
export const createCliente = async (cliente: CrearCliente): Promise<Cliente | null> => {
  if (!cliente) {
    console.error("Datos del cliente inválidos.");
    return null;
  }

  try {
    const { data, error } = await fetchData<Cliente>(API_URL, "POST", cliente);
    if (error) {
      console.error(error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    return null;
  }
};

/**
 * Actualiza un cliente existente.
 * @param id - ID del cliente a actualizar.
 * @param cliente - Datos actualizados del cliente.
 * @returns Datos del cliente actualizado o null si ocurre un error.
 */
export const updateCliente = async (
  id: number,
  cliente: ActualizarCliente
): Promise<Cliente | null> => {
  if (!id || id <= 0) {
    console.error("ID de cliente inválido.");
    return null;
  }

  if (!cliente.nombre && !cliente.correo && !cliente.cuenta) {
    console.error("No se proporcionaron datos para actualizar.");
    return null;
  }

  const { data, error } = await fetchData<Cliente>(`${API_URL}/${id}`, "PUT", cliente);
  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
};

/**
 * Elimina un cliente por su ID.
 * @param id - ID del cliente a eliminar.
 * @returns void
 */
export const deleteCliente = async (id: number): Promise<void> => {
  if (!id || id <= 0) {
    console.error("ID de cliente inválido.");
    return;
  }

  const { error } = await fetchData(`${API_URL}/${id}`, "DELETE");
  if (error) {
    console.error(error);
  }
};