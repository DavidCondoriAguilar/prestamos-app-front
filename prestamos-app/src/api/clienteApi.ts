import axios from "axios";
import { ActualizarCliente, Cliente, CrearCliente } from "../types/clienteType";

const API_URL = "http://localhost:8080/clientes";

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
  console.log("Datos enviados al backend:", cliente);

  const { data, error } = await fetchData<Cliente>(API_URL, "POST", cliente);
  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
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