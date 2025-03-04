import axios from "axios";

// URL base del backend para cuentas
const API_URL = "http://localhost:8080/cuentas";

/**
 * Crea una nueva cuenta.
 * @param {Object} cuenta - Datos de la cuenta a crear.
 * @returns {Promise<Object|null>} Respuesta del servidor o null si ocurre un error.
 */
export const crearCuenta = async (cuenta) => {
    try {
        const response = await axios.post(API_URL, cuenta);
        return response.data;
    } catch (error) {
        console.error("Error creando cuenta:", error.response?.data || error.message);
        return null;
    }
};

/**
 * Obtiene una cuenta por el ID del cliente.
 * @param {number} clienteId - ID del cliente.
 * @returns {Promise<Object|null>} Datos de la cuenta o null si no se encuentra.
 */
export const obtenerCuentaPorCliente = async (clienteId) => {
    try {
        const response = await axios.get(`${API_URL}/cliente/${clienteId}`);
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo cuenta para el cliente con ID ${clienteId}:`, error.response?.data || error.message);
        return null;
    }
};

/**
 * Elimina una cuenta por su ID.
 * @param {number} id - ID de la cuenta a eliminar.
 * @returns {Promise<boolean>} `true` si la eliminación fue exitosa, `false` en caso contrario.
 */
export const eliminarCuenta = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return true;
    } catch (error) {
        console.error(`Error eliminando cuenta con ID ${id}:`, error.response?.data || error.message);
        return false;
    }
};