import React, { useState } from "react";
import { crearPrestamo } from "../../api/prestamoApi.ts";
import { toast } from "react-toastify"; // Importa toast desde react-toastify
import FormularioCrearPrestamo from "../../components/prestamos/FormularioCrearPrestamo";

const CrearPrestamoModal = ({ isOpen, onClose, onCreado }) => {
  const handleSubmit = async (nuevoPrestamo) => {
    try {
      const { data, error } = await crearPrestamo(nuevoPrestamo);

      if (error) {
        toast.error(error, {
          position: "top-right",
          autoClose: 5000, // Más tiempo para leer el error
        });
      } else if (data) {
        toast.success("Préstamo creado exitosamente", {
          position: "top-right",
          autoClose: 3000,
        });
        if (onCreado) {
          onCreado(); // Notificar al padre para actualizar
        }
        onClose(); // Cerrar el modal
      }
    } catch (error) {
      console.error("Error inesperado al crear el préstamo:", error);
      toast.error("Ocurrió un error inesperado. Inténtelo de nuevo.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Contenedor del Modal */}
      <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-lg shadow-lg w-96 max-w-md">
        {/* Título */}
        <h2 className="text-2xl font-bold text-white mb-4">Crear Nuevo Préstamo</h2>
        {/* Formulario */}
        <FormularioCrearPrestamo onSubmit={handleSubmit} onClose={onClose} />
      </div>
    </div>
  );
};

export default CrearPrestamoModal;