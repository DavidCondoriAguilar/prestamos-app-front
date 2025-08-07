import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiCreditCard, FiTrash2, FiFileText, FiMail } from "react-icons/fi";
import ConfirmationDelete from "./ConfirmationDelete";
import ClientePdfButton from "../pdf/ClientePdfButton";

const ListaClientes = ({ clientes, onVerDetalles, onEliminar }) => {
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEliminarClick = (e, cliente) => {
    e.stopPropagation();
    setClienteAEliminar(cliente);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmarEliminar = () => {
    if (clienteAEliminar) {
      onEliminar(clienteAEliminar.id);
      setClienteAEliminar(null);
      setIsDeleteModalOpen(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (name) => {
    if (!name) return "from-gray-500 to-gray-600";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  if (clientes.length === 0) {
    return (
      <div className="text-center py-12">
        <FiUser className="mx-auto text-5xl text-gray-500" />
        <h3 className="mt-2 text-lg font-medium text-white">No hay clientes</h3>
        <p className="mt-1 text-sm text-gray-400">
          Comienza creando un nuevo cliente para registrar préstamos.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.ul
        className="divide-y divide-gray-700/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {clientes.map((cliente) => (
            <motion.li
              key={cliente.id}
              variants={itemVariants}
              exit="exit"
              className="hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer"
              onClick={() => onVerDetalles(cliente)}
            >
              <div className="grid grid-cols-12 gap-4 items-center px-6 py-4">
                <div className="col-span-6 md:col-span-4 flex items-center space-x-4">
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r ${getAvatarColor(
                      cliente.nombre
                    )} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {getInitials(cliente.nombre)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{cliente.nombre}</p>
                    <p className="text-xs text-gray-400">ID: {cliente.id}</p>
                  </div>
                </div>

                <div className="col-span-6 md:col-span-3 hidden sm:flex items-center space-x-2">
                  <FiMail className="text-gray-500 text-sm flex-shrink-0" />
                  <p className="text-sm text-gray-300 truncate">
                    {cliente.correo || "Sin correo"}
                  </p>
                </div>

                <div className="col-span-3 hidden md:flex items-center space-x-2">
                  <FiCreditCard className="text-gray-500 text-sm flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    {cliente.cuenta?.numeroCuenta
                      ? `•••• ${cliente.cuenta.numeroCuenta.slice(-4)}`
                      : "Sin cuenta"}
                  </p>
                </div>

                <div className="col-span-6 md:col-span-2 flex justify-end space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onVerDetalles(cliente);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-gray-300 bg-gray-800/60 hover:bg-blue-600/20 hover:text-blue-300 transition-all duration-200 group"
                  >
                    <FiEye className="mr-1.5 h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    <span className="hidden sm:inline">Ver</span>
                  </motion.button>
                  
                  <ClientePdfButton 
                    clienteId={cliente.id}
                    clienteName={cliente.nombre}
                    variant="ghost"
                    size="sm"
                    iconOnly={true}
                    className="inline-flex items-center px-2 py-1.5 border border-transparent rounded-lg text-sm font-medium text-gray-300 bg-gray-800/60 transition-all duration-200"
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleEliminarClick(e, cliente)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-gray-300 bg-gray-800/60 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group"
                  >
                    <FiTrash2 className="h-4 w-4 text-gray-400 group-hover:text-red-400 sm:mr-1.5" />
                    <span className="hidden sm:inline">Eliminar</span>
                  </motion.button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <ConfirmationDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmarEliminar}
        title={`Eliminar a ${clienteAEliminar?.nombre || "este cliente"}`}
        message={`¿Estás seguro de que deseas eliminar este cliente? Todos los préstamos y pagos asociados también serán eliminados. Esta acción no se puede deshacer.`}
      />
    </>
  );
};

export default ListaClientes;