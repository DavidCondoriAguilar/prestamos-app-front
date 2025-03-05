import React, { useState, useEffect } from "react";
import {
  obtenerPagosPorPrestamo,
  registrarPago,
  calcularMontoRestante,
} from "../../api/pagoApi";
import { toast } from "react-toastify";
import MontoRestante from "../../components/pagos/MontoRestante";
import BotonActualizarLista from "../../components/pagos/BotonActualizarLista";
import ListaPagos from "../../components/pagos/ListaPagos";
import ModalRegistroPago from "../../components/pagos/ModalRegistroPago";

const PagosPage = () => {
  const [pagos, setPagos] = useState([]); // Lista de pagos
  const [montoRestante, setMontoRestante] = useState(null); // Monto restante del préstamo
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [idPrestamo, setIdPrestamo] = useState(1); // ID del préstamo seleccionado

  // Cargar pagos al montar el componente
  useEffect(() => {
    cargarPagos();
  }, []);

  // Función para cargar los pagos de un préstamo específico
  // Función para cargar los pagos de un préstamo específico
const cargarPagos = async () => {
  try {
    const response = await obtenerPagosPorPrestamo(idPrestamo);
    console.log("Datos recibidos del backend:", response); // Log para depuración

    // Acceder a la propiedad 'content' para obtener los pagos
    if (response && response.content) {
      setPagos(response.content || []);
    } else {
      console.error("La respuesta del backend no contiene la propiedad 'content'.");
      setPagos([]);
    }
  } catch (error) {
    console.error("Error al cargar los pagos del préstamo:", error);
    toast.error("Error al cargar los pagos del préstamo.");
  }
};

  // Función para calcular el monto restante de un préstamo
  const calcularMontoRestantePrestamo = async () => {
    try {
      const monto = await calcularMontoRestante(idPrestamo);
      setMontoRestante(monto);
      toast.success("Monto restante calculado correctamente.");
    } catch (error) {
      toast.error("Error al calcular el monto restante.");
    }
  };

  // Función para registrar un nuevo pago
  const registrarNuevoPago = async (pago) => {
    try {
      await registrarPago(idPrestamo, pago);
      toast.success("Pago registrado correctamente.");
      cargarPagos(); // Actualizar la lista de pagos
      setIsModalOpen(false); // Cerrar el modal
    } catch (error) {
      toast.error("Error al registrar el pago.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Pagos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Registrar Nuevo Pago
        </button>
      </div>

      {/* Sección de Acciones */}
      <div className="flex justify-between items-center mb-4">
        {/* Mostrar Monto Restante */}
        <MontoRestante montoRestante={montoRestante} />

        {/* Botón para Calcular Monto Restante */}
        <button
          onClick={calcularMontoRestantePrestamo}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Calcular Monto Restante
        </button>

        {/* Botón para Actualizar Lista */}
        <BotonActualizarLista onRefresh={cargarPagos} />
      </div>

      {/* Lista de Pagos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ListaPagos pagos={pagos} onRefresh={cargarPagos} />
      </div>

      {/* Modal para Registrar Pagos */}
      <ModalRegistroPago
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPagoRegistrado={registrarNuevoPago}
      />
    </div>
  );
};

export default PagosPage;