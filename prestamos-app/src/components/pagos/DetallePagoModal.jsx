import React, { useState, useEffect } from 'react';
import { FaTimes, FaPrint, FaFilePdf, FaCalendarAlt, FaMoneyBillWave, FaIdBadge, FaCheckCircle, FaFileInvoiceDollar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DetallePagoModal = ({ isOpen, onClose, pago }) => {
  if (!isOpen || !pago) return null;

  // Formatear la fecha para mostrarla en hora de Lima, Perú (UTC-5)
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'No disponible';
    
    try {
      // Crear la fecha a partir del string ISO
      const fecha = new Date(fechaString);
      
      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        console.error('Fecha inválida:', fechaString);
        return 'Fecha inválida';
      }
      
      // Obtener los componentes de la fecha en la zona horaria de Lima (UTC-5)
      const opciones = {
        timeZone: 'America/Lima',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      
      // Formatear la fecha según la zona horaria de Lima
      const formateador = new Intl.DateTimeFormat('es-PE', opciones);
      const partes = formateador.formatToParts(fecha);
      
      // Extraer las partes de la fecha formateada
      const dia = partes.find(p => p.type === 'day').value;
      const mes = partes.find(p => p.type === 'month').value;
      const anio = partes.find(p => p.type === 'year').value;
      let horas = partes.find(p => p.type === 'hour').value;
      const minutos = partes.find(p => p.type === 'minute').value;
      const periodo = partes.find(p => p.type === 'dayPeriod').value;
      
      return `${dia}/${mes}/${anio}, ${horas}:${minutos} ${periodo}`;
      
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return 'Error en fecha';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/70 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-indigo-100"
      >
        {/* Encabezado */}
        <div className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaFileInvoiceDollar className="text-xl" />
            <h2 className="text-lg font-bold">Detalles del Pago</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 bg-white">
          {/* Sección de Monto */}
          <div className="flex items-center justify-between bg-indigo-50 p-5 rounded-xl border border-indigo-100 mb-6">
            <div>
              <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">Monto del Pago</p>
              <p className="text-4xl font-extrabold text-indigo-900 mt-1">S/ {pago.montoPago?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center shadow-sm">
              <FaCheckCircle className="mr-1" /> Completado
            </div>
          </div>

          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Columna Izquierda */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 border-b pb-2 mb-2 flex items-center">
                <FaIdBadge className="text-indigo-500 mr-2" />
                Información del Pago
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">ID de Pago:</span>
                  <span className="font-semibold text-gray-900">#{pago.id || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Fecha y Hora:</span>
                  <span className="font-medium text-gray-900">{formatearFecha(pago.fecha)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Método de Pago:</span>
                  <span className="font-medium text-gray-900 flex items-center">
                    <FaMoneyBillWave className="text-green-600 mr-2" /> Efectivo
                  </span>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 border-b pb-2 mb-2 flex items-center">
                <FaFileInvoiceDollar className="text-indigo-500 mr-2" />
                Detalles del Préstamo
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">ID Préstamo:</span>
                  <span className="font-semibold text-gray-900">#{pago.prestamoId || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Estado:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Activo
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Tipo:</span>
                  <span className="font-medium text-gray-900">Personal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notas adicionales */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg text-sm">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-4">
                <p className="text-blue-900 font-semibold">Importante</p>
                <p className="text-blue-800 mt-1">Guarda este comprobante como respaldo de tu transacción.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pie de página */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cerrar
          </button>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <FaPrint className="mr-2 h-4 w-4" />
              Imprimir
            </button>
            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <FaFilePdf className="mr-2 h-4 w-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DetallePagoModal;
