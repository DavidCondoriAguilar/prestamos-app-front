import React from "react";
import { motion } from "framer-motion";
import { FiEye, FiMail, FiPhone, FiCalendar, FiUser, FiDollarSign } from "react-icons/fi";

const ClienteItem = ({ cliente, onVerDetalles, formatDate }) => {
  // Función para obtener las iniciales del nombre
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para generar un color de fondo basado en el nombre
  const getAvatarColor = (name) => {
    if (!name) return "bg-gradient-to-r from-blue-500 to-indigo-600";
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-green-500 to-emerald-600",
      "from-purple-500 to-fuchsia-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
      "from-cyan-500 to-sky-600",
      "from-violet-500 to-purple-600",
    ];
    const charSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  return (
    <motion.li 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200 rounded-xl overflow-hidden border border-gray-700/50"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${getAvatarColor(cliente.nombre)} flex items-center justify-center text-white font-medium text-lg`}>
              {getInitials(cliente.nombre)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{cliente.nombre}</h3>
              <p className="text-sm text-gray-400 flex items-center mt-1">
                <FiMail className="mr-2 text-gray-500" />
                {cliente.correo || "No especificado"}
              </p>
              
              <div className="flex items-center space-x-4 mt-2">
                {cliente.telefono && (
                  <span className="text-sm text-gray-400 flex items-center">
                    <FiPhone className="mr-1.5 text-gray-500" />
                    {cliente.telefono}
                  </span>
                )}
                
                {cliente.fechaRegistro && (
                  <span className="text-sm text-gray-400 flex items-center">
                    <FiCalendar className="mr-1.5 text-gray-500" />
                    {formatDate ? formatDate(cliente.fechaRegistro) : 'Sin fecha'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onVerDetalles(cliente)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FiEye className="mr-2" />
            Ver detalles
          </motion.button>
        </div>
        
        {/* Información adicional */}
        {(cliente.direccion || cliente.notas) && (
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cliente.direccion && (
                <div className="text-sm">
                  <p className="text-gray-400 mb-1">Dirección</p>
                  <p className="text-gray-300">{cliente.direccion}</p>
                </div>
              )}
              
              {cliente.notas && (
                <div className="text-sm">
                  <p className="text-gray-400 mb-1">Notas</p>
                  <p className="text-gray-300 line-clamp-2">{cliente.notas}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.li>
  );
};

export default ClienteItem;