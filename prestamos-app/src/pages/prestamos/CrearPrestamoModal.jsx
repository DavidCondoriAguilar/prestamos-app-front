import React, { useState } from "react";
import { crearPrestamo } from "../../api/prestamoApi";
import { toast } from "react-toastify"; // Importa toast desde react-toastify
import FormularioCrearPrestamo from "../../components/prestamos/FormularioCrearPrestamo";

const CrearPrestamoModal = ({ isOpen, onClose, onCreado }) => {
  const handleSubmit = async (nuevoPrestamo) => {
    try {
      // Llamar al backend para crear el préstamo
      const resultado = await crearPrestamo(nuevoPrestamo);
      if (resultado) {
        toast.success("Préstamo creado exitosamente", {
          position: "top-right",
          autoClose: 3000,
        });
        onCreado(); // Notificar al padre que se actualice la lista
        onClose(); // Cerrar el modal
      }
    } catch (error) {
      toast.error("Error al crear el préstamo", {
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