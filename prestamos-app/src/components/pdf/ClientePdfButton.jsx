// src/components/pdf/ClientePdfButton.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { generarPDFCliente } from '../../api/pdfApi';

const ClientePdfButton = ({
  clienteId,
  clienteName = 'cliente',
  className = '',
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  children,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!clienteId) {
      toast.error('ID de cliente no proporcionado');
      return;
    }

    setIsLoading(true);
    try {
      await generarPDFCliente(clienteId);
      toast.success(`Reporte de ${clienteName} generado correctamente`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      const errorMessage = error.response?.data?.message || 'Error al generar el PDF';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-2.5',
  };

  const variantClasses = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    ghost: 'bg-transparent hover:bg-red-600/10 text-red-600 hover:text-red-700 border border-red-600/30',
    outline: 'bg-white border-2 border-red-600 text-red-600 hover:bg-red-50',
  };

  return (
    <motion.button
      onClick={handleDownload}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-md'} 
        ${className}`}
      disabled={isLoading}
      title={`Descargar PDF de ${clienteName}`}
      aria-label={`Descargar reporte de ${clienteName}`}
      {...props}
    >
      {isLoading ? (
        <>
          <FaSpinner className="animate-spin mr-1.5" />
          {!iconOnly && 'Generando...'}
        </>
      ) : (
        <>
          <FaFilePdf className="flex-shrink-0" />
          {!iconOnly && (children || 'Descargar PDF')}
        </>
      )}
    </motion.button>
  );
};

// Prop types for better development experience
ClientePdfButton.propTypes = {
  clienteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  clienteName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  iconOnly: PropTypes.bool,
  children: PropTypes.node,
};

export default React.memo(ClientePdfButton);