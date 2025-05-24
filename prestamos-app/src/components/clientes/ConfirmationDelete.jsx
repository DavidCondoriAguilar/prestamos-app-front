import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAlertTriangle, FiTrash2 } from "react-icons/fi";

const ConfirmationDelete = ({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Eliminar cliente?",
  message = "Esta acción no se puede deshacer. ¿Estás seguro de que deseas continuar?",
  confirmText = "Eliminar",
  cancelText = "Cancelar"
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 text-left shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <FiAlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-white">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-md bg-gray-700/50 p-1.5 text-gray-400 hover:bg-gray-600/50 hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              {/* Message */}
              <div className="mt-4">
                <p className="text-sm text-gray-300">{message}</p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col space-y-3 sm:flex-row-reverse sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="inline-flex w-full justify-center rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all"
                >
                  <FiTrash2 className="mr-2 h-5 w-5" />
                  {confirmText}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex w-full justify-center rounded-lg border border-gray-600 bg-transparent px-4 py-2.5 text-sm font-medium text-gray-300 shadow-sm hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationDelete;
