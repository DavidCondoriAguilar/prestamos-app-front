import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";

const BuscadorClientes = ({ filtroNombre, setFiltroNombre }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(filtroNombre);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltroNombre(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setFiltroNombre]);

  const handleClear = () => {
    setInputValue("");
    setFiltroNombre("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div 
        className={`relative flex items-center transition-all duration-200 ${isFocused ? 'ring-2 ring-blue-500' : ''} bg-gray-800/50 border ${isFocused ? 'border-blue-500/50' : 'border-gray-700/50'} rounded-xl overflow-hidden`}
      >
        
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Buscar cliente por nombre o correo..."
          className="w-full bg-transparent border-none focus:ring-0 text-gray-200 placeholder-gray-500 pl-12 pr-10 py-3 text-base"
        />
        
        <AnimatePresence>
          {inputValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-2 p-1 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <FiX className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {filtroNombre && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-gray-400 text-right"
          >
            {filtroNombre ? `Mostrando resultados para: "${filtroNombre}"` : ''}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuscadorClientes;