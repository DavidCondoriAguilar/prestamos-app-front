import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import formatCurrency from "../../utils/formatCurrency";
import { FiUser, FiMail, FiDollarSign, FiEye, FiCreditCard } from "react-icons/fi";

const ListaClientes = ({ clientes, onVerDetalles, formatDate }) => {
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
    if (!name) return "from-blue-500 to-indigo-600";
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

  if (clientes.length === 0) {
    return (
      <p className="text-center text-lg text-gray-400">
        No hay clientes registrados.
      </p>
    );
  }

  return (
    <AnimatePresence>
      <ul className="divide-y divide-gray-700/50">
        {clientes.map((cliente, index) => (
          <motion.li
            key={cliente.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="hover:bg-gray-800/30 transition-colors duration-200"
          >
            <div className="grid grid-cols-12 gap-4 items-center px-6 py-4">
              {/* Avatar y Nombre */}
              <div className="col-span-5 md:col-span-4 flex items-center space-x-3">
                <div 
                  className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r ${getAvatarColor(cliente.nombre)} flex items-center justify-center text-white font-medium text-sm`}
                >
                  {getInitials(cliente.nombre)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{cliente.nombre}</p>
                  <p className="text-xs text-gray-400">ID: {cliente.id}</p>
                </div>
              </div>

              {/* Correo */}
              <div className="col-span-4 md:col-span-3">
                <div className="flex items-center space-x-2">
                  <FiMail className="text-gray-500 text-sm flex-shrink-0" />
                  <p className="text-sm text-gray-300 truncate">
                    {cliente.correo || "Sin correo"}
                  </p>
                </div>
              </div>

              {/* Cuenta Bancaria */}
              <div className="col-span-3 hidden md:block">
                <div className="flex items-center space-x-2">
                  <FiCreditCard className="text-gray-500 text-sm flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    {cliente.cuenta?.numeroCuenta ? `•••• ${cliente.cuenta.numeroCuenta.slice(-4)}` : "Sin cuenta"}
                  </p>
                </div>
              </div>

              {/* Acciones */}
              <div className="col-span-4 md:col-span-2 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onVerDetalles(cliente)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-blue-600/20 hover:border-blue-500/50 transition-colors duration-200 group"
                >
                  <FiEye className="mr-1.5 group-hover:text-blue-400" />
                  <span className="hidden sm:inline">Ver</span>
                </motion.button>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </AnimatePresence>
  );
};

export default ListaClientes;