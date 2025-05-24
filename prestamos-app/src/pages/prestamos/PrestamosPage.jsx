import React, { useEffect, useState } from "react";
import FiltrarPorClienteModal from "./FiltrarPorClienteModal";
import FiltrarPorEstadoModal from "./FiltrarPorEstadoModal";
import CalcularInteresModal from "./CalcularInteresModal";
import CalcularMontoRestanteModal from "./CalcularMontoRestanteModal";
import PrestamosList from "./PrestamosList";
import ActualizarPrestamoModal from "./ActualizarPrestamoModal";
import BuscarPrestamoModal from "./BuscarPrestamoModal";
import CrearPrestamoModal from "./CrearPrestamoModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiUser,
  FiList,
  FiDollarSign,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiDollarSign as FiDollar,
  FiCreditCard,
  FiPercent,
  FiCalendar,
  FiX
} from "react-icons/fi";
import { actualizarEstadoPrestamo, obtenerTodosLosPrestamos } from "../../api/prestamoApi";

const PrestamosPage = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState({
    crear: false,
    actualizar: false,
    buscar: false,
    filtrarCliente: false,
    filtrarEstado: false,
    calcularInteres: false,
    calcularMontoRestante: false,
  });

  // Obtener todos los préstamos al cargar la página
  useEffect(() => {
    fetchPrestamos();
  }, []);

  const fetchPrestamos = async () => {
    try {
      const data = await obtenerTodosLosPrestamos();
      setPrestamos(data);
    } catch (error) {
      console.error("Error al obtener los préstamos:", error);
      toast.error("Hubo un error al cargar los préstamos");
    }
  };

  // Función para actualizar el estado de un préstamo
  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPrestamo(id, nuevoEstado); // Llama al endpoint
      toast.success("Estado del préstamo actualizado correctamente"); // Notificación de éxito
      fetchPrestamos(); // Refresca la lista de préstamos
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast.error("Hubo un error al actualizar el estado del préstamo");
    }
  };

  // Filtrar préstamos basado en el término de búsqueda
  const filteredPrestamos = prestamos.filter(prestamo => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (prestamo.cliente?.nombres?.toLowerCase().includes(searchLower)) ||
      (prestamo.cliente?.apellidos?.toLowerCase().includes(searchLower)) ||
      (prestamo.id?.toString().includes(searchTerm)) ||
      (prestamo.monto?.toString().includes(searchTerm)) ||
      (prestamo.estado?.toLowerCase().includes(searchLower))
    );
  });

  // Calcular estadísticas
  const estadisticas = {
    total: filteredPrestamos.length,
    pagados: filteredPrestamos.filter(p => p.estado === 'PAGADO').length,
    pendientes: filteredPrestamos.filter(p => p.estado === 'PENDIENTE').length,
    vencidos: filteredPrestamos.filter(p => p.estado === 'VENCIDO').length,
    montoTotal: filteredPrestamos.reduce((sum, p) => sum + (p.monto || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Gestión de Préstamos
            </h1>
            <p className="mt-1 text-sm text-gray-400">Administra y realiza un seguimiento de todos los préstamos</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={fetchPrestamos}
              className="p-2 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              title="Actualizar lista"
            >
              <FiRefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsModalOpen({ ...isModalOpen, crear: true })}
              className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Nuevo Préstamo
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Préstamos */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-2xl shadow-xl p-5 border border-gray-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Préstamos</p>
                <p className="text-2xl font-bold text-white">{estadisticas.total}</p>
                <p className="text-xs text-gray-400 mt-2">Monto total: S/ {estadisticas.montoTotal.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <FiDollar className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Préstamos Pagados */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-2xl shadow-xl p-5 border border-gray-700/50 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Pagados</p>
                <p className="text-2xl font-bold text-white">{estadisticas.pagados}</p>
                <p className="text-xs text-gray-400 mt-2">{estadisticas.total > 0 ? Math.round((estadisticas.pagados / estadisticas.total) * 100) : 0}% del total</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                <FiCheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Préstamos Pendientes */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-2xl shadow-xl p-5 border border-gray-700/50 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Pendientes</p>
                <p className="text-2xl font-bold text-white">{estadisticas.pendientes}</p>
                <p className="text-xs text-gray-400 mt-2">Por aprobar o en proceso</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
                <FiClock className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Préstamos Vencidos */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-2xl shadow-xl p-5 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Vencidos</p>
                <p className="text-2xl font-bold text-white">{estadisticas.vencidos}</p>
                <p className="text-xs text-gray-400 mt-2">Requieren atención</p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
                <FiAlertCircle className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700/30 transition-all duration-300 hover:border-gray-600/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-blue-400/80" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-800/30 backdrop-blur-sm border-2 border-gray-700/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/70 transition-all duration-200"
                placeholder="Buscar préstamos por ID, monto o estado..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  title="Limpiar búsqueda"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsModalOpen({ ...isModalOpen, filtrarCliente: true })}
                className="inline-flex items-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 text-sm font-medium rounded-xl hover:border-blue-400/50 hover:text-blue-300 transition-all duration-200"
              >
                <FiUser className="mr-2 h-4 w-4" />
                Cliente
              </button>
              <button
                onClick={() => setIsModalOpen({ ...isModalOpen, filtrarEstado: true })}
                className="inline-flex items-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 text-sm font-medium rounded-xl hover:border-purple-400/50 hover:text-purple-300 transition-all duration-200"
              >
                <FiList className="mr-2 h-4 w-4" />
                Estado
              </button>
              <button
                onClick={() => setIsModalOpen({ ...isModalOpen, buscar: true })}
                className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white text-sm font-medium rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200"
              >
                Búsqueda Avanzada
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Préstamos */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <PrestamosList
              prestamos={filteredPrestamos}
              onEliminar={fetchPrestamos}
              onActualizarEstado={actualizarEstado}
            />
          </div>
        </div>

        {/* Modales */}
        <CrearPrestamoModal
          isOpen={isModalOpen.crear}
          onClose={() => setIsModalOpen({ ...isModalOpen, crear: false })}
          onCreado={fetchPrestamos}
        />
        <ActualizarPrestamoModal
          isOpen={isModalOpen.actualizar}
          onClose={() => setIsModalOpen({ ...isModalOpen, actualizar: false })}
          onActualizado={fetchPrestamos}
        />
        <BuscarPrestamoModal
          isOpen={isModalOpen.buscar}
          onClose={() => setIsModalOpen({ ...isModalOpen, buscar: false })}
        />
        <FiltrarPorClienteModal
          isOpen={isModalOpen.filtrarCliente}
          onClose={() => setIsModalOpen({ ...isModalOpen, filtrarCliente: false })}
          onFiltrado={setPrestamos}
        />
        <FiltrarPorEstadoModal
          isOpen={isModalOpen.filtrarEstado}
          onClose={() => setIsModalOpen({ ...isModalOpen, filtrarEstado: false })}
          onFiltrado={setPrestamos}
        />
        <CalcularInteresModal
          isOpen={isModalOpen.calcularInteres}
          onClose={() => setIsModalOpen({ ...isModalOpen, calcularInteres: false })}
        />
        <CalcularMontoRestanteModal
          isOpen={isModalOpen.calcularMontoRestante}
          onClose={() =>
            setIsModalOpen({ ...isModalOpen, calcularMontoRestante: false })
          }
        />
      </div>
    </div>
  );
};

export default PrestamosPage;