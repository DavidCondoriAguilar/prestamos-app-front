import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiResponse, Cuenta } from "../types/CuentaType";


// URL base del backend para cuentas
const API_URL = "http://localhost:8080/cuentas";

// Interfaces para tipado fuerte


/**
 * Crea una nueva cuenta.
 * @param cuenta - Datos de la cuenta a crear.
 * @returns Promesa que resuelve a los datos de la cuenta creada o null en caso de error.
 */
export const crearCuenta = async (cuenta: Omit<Cuenta, 'id' | 'fechaCreacion' | 'estado'>): Promise<Cuenta | null> => {
    try {
        const response: AxiosResponse<ApiResponse<Cuenta>> = await axios.post(API_URL, cuenta);
        return response.data.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        console.error("Error creando cuenta:", axiosError.response?.data?.message || axiosError.message);
        return null;
    }
};

/**
 * Obtiene una cuenta por el ID del cliente.
 * @param clienteId - ID del cliente.
 * @returns Promesa que resuelve a los datos de la cuenta o null si no se encuentra.
 */
export const obtenerCuentaPorCliente = async (clienteId: number): Promise<Cuenta | null> => {
    try {
        const response: AxiosResponse<ApiResponse<Cuenta>> = await axios.get(`${API_URL}/cliente/${clienteId}`);
        return response.data.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        console.error(
            `Error obteniendo cuenta para el cliente con ID ${clienteId}:`,
            axiosError.response?.data?.message || axiosError.message
        );
        return null;
    }
};

/**
 * Elimina una cuenta por su ID.
 * @param id - ID de la cuenta a eliminar.
 * @returns Promesa que resuelve a `true` si la eliminación fue exitosa, `false` en caso contrario.
 */
export const eliminarCuenta = async (id: number): Promise<boolean> => {
    try {
        await axios.delete<void>(`${API_URL}/${id}`);
        return true;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        console.error(
            `Error eliminando cuenta con ID ${id}:`,
            axiosError.response?.data?.message || axiosError.message
        );
        return false;
    }
};