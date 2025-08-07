import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerTodosLosPrestamos, actualizarEstadoPrestamo } from "../../api/prestamoApi";
import { verificarYActualizarEstadoPrestamo } from "../../api/pagoApi";
import { toast } from "react-toastify";
import MontoRestante from "../../components/pagos/MontoRestante";
import BotonActualizarLista from "../../components/pagos/BotonActualizarLista";
import ListaPagos from "../../components/pagos/ListaPagos";
import ModalRegistroPago from "../../components/pagos/ModalRegistroPago";
import DetallePagoModal from "../../components/pagos/DetallePagoModal";
// Iconos
import { FaSearch, FaMoneyBillWave, FaUserAlt, FaClock, FaCheckCircle, FaMoneyBillAlt, FaEye, FaPercentage } from "react-icons/fa";
import TimelinePagos from '../../components/pagos/TimelinePagos';
import { usePagoStore } from "../../stores/pagoStore";

const PagosPage = () => {
  const { prestamoId } = useParams();
  const navigate = useNavigate();
  const { pagos, isLoading, error, fetchPagosPorPrestamo, addPago, removePago } = usePagoStore();
  const [prestamos, setPrestamos] = useState([]);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Cargar préstamos al montar el componente o cuando cambia el prestamoId
  useEffect(() => {
    const cargarPrestamos = async () => {
      try {
        // setCargando(true); // Removed, isLoading from store
        const data = await obtenerTodosLosPrestamos();
        setPrestamos(data || []);
        
        // Si hay un prestamoId en la URL, seleccionar ese préstamo
        if (prestamoId) {
          const prestamo = data.find(p => p.id === Number(prestamoId));
          if (prestamo) {
            setPrestamoSeleccionado(prestamo);
            await fetchPagosPorPrestamo(prestamo.id);
          } else {
            // Si el préstamo no se encuentra, redirigir a la lista de pagos
            navigate('/pagos');
            toast.error('Préstamo no encontrado');
          }
        }
      } catch (err) { // Changed error to err to avoid conflict with store's error
        console.error("Error al cargar préstamos:", err);
        toast.error("No se pudieron cargar los préstamos");
      } finally {
        // setCargando(false); // Removed
      }
    };

    cargarPrestamos();
  }, [prestamoId, navigate]);

// Función para cargar los pagos de un préstamo específico
  // Función para cargar los pagos de un préstamo específico
  const cargarPagos = async (id) => {
    if (!id) return;
    try {
      await fetchPagosPorPrestamo(id);
    } catch (err) {
      console.error("Error al cargar los pagos:", err);
      toast.error("Error al cargar los pagos");
    }
  };

  // Calcular el total pagado, monto con intereses y monto restante usando useMemo
  const totalPagado = useMemo(() => {
    if (!pagos || pagos.length === 0) return 0;
    return pagos.reduce((total, pago) => total + (parseFloat(pago.montoPago) || 0), 0);
  }, [pagos]);

  const montoTotalConInteres = useMemo(() => {
    if (!prestamoSeleccionado) return 0;
    const montoBase = parseFloat(prestamoSeleccionado.monto) || 0;
    const interes = parseFloat(prestamoSeleccionado.interes || 0) / 100; // Convertir porcentaje a decimal
    return montoBase + (montoBase * interes);
  }, [prestamoSeleccionado]);

  const montoRestante = useMemo(() => {
    return Math.max(0, montoTotalConInteres - totalPagado);
  }, [montoTotalConInteres, totalPagado]);

  const progreso = useMemo(() => {
    if (!montoTotalConInteres || !totalPagado) return 0;
    if (montoTotalConInteres === 0) return 0;
    return Math.min(100, (totalPagado / montoTotalConInteres) * 100);
  }, [montoTotalConInteres, totalPagado]);

  // Función para registrar un nuevo pago
  const registrarNuevoPago = async (pago) => {
    if (!prestamoSeleccionado?.id) {
      toast.error("No se ha seleccionado un préstamo válido");
      return false;
    }

    try {
      const montoPago = parseFloat(pago.montoPago);
      if (isNaN(montoPago) || montoPago <= 0) {
        toast.error("El monto del pago debe ser un número positivo.");
        return false;
      }

      if (montoPago > montoRestante) {
        toast.warn(`El monto del pago (S/ ${montoPago.toFixed(2)}) no puede exceder el saldo pendiente (S/ ${montoRestante.toFixed(2)}).`);
        return false;
      }

      const exito = await addPago(prestamoSeleccionado.id, pago);

      if (exito) {
        toast.success("Pago registrado con éxito");
        await cargarPagos(prestamoSeleccionado.id);

        // Verificar y actualizar el estado del préstamo
        const prestamoActualizado = await verificarYActualizarEstadoPrestamo(prestamoSeleccionado.id);
        if (prestamoActualizado && prestamoActualizado.estado !== prestamoSeleccionado.estado) {
          setPrestamoSeleccionado(prestamoActualizado);
          toast.info(`El estado del préstamo ha sido actualizado a: ${prestamoActualizado.estado}`);
        }

        setIsModalOpen(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error al registrar el pago:", err);
      toast.error(err.message || "Error al registrar el pago");
      return false;
    }
  };

  // Función para manejar la visualización de detalles del pago
  const handleVerDetalle = (pago) => {
    setPagoSeleccionado(pago);
    setIsDetalleModalOpen(true);
  };

  // Filtrar préstamos según la búsqueda
  const prestamosFiltrados = React.useMemo(() => {
    if (!Array.isArray(prestamos)) {
      return [];
    }
    if (!busqueda) return prestamos;

    const busquedaMin = busqueda.toLowerCase();
    return prestamos.filter(prestamo => {
      // Safely access nested properties
      const clienteNombres = prestamo.cliente?.nombres?.toLowerCase() || '';
      const clienteApellidos = prestamo.cliente?.apellidos?.toLowerCase() || '';
      const prestamoId = prestamo.id?.toString() || '';

      return (
        clienteNombres.includes(busquedaMin) ||
        clienteApellidos.includes(busquedaMin) ||
        prestamoId.includes(busquedaMin)
      );
    });
  }, [prestamos, busqueda]);

  const seleccionarPrestamo = async (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    navigate(`/pagos/${prestamo.id}`);
    // No es necesario cargar los pagos aquí ya que el efecto se disparará con el cambio de prestamoId
  };

  // Vista de selección de préstamo
  if (!prestamoId) {
    return (
      <div className="p-6 min-h-screen">
        <div className="container mx-auto px-4 py-8 bg-gray-800/50 rounded-lg border border-gray-700 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-blue-400">Seleccione un Préstamo</h1>
              <span className="mt-1 text-sm text-gray-400">Selecciona un préstamo para ver o registrar sus pagos.</span>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate('/prestamos')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Préstamo
              </button>
            </div>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre de cliente o ID de préstamo..."
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Lista de préstamos */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando préstamos...</p>
            </div>
          ) : prestamosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prestamosFiltrados.map((prestamo) => (
                <button
                  key={prestamo.id}
                  className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700"
                >
                  <div 
                    onClick={() => seleccionarPrestamo(prestamo)}
                    className="cursor-pointer p-5"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xs font-medium text-blue-400 mb-1">PRÉSTAMO</div>
                        <h3 className="text-xl font-bold text-white">
                          #{prestamo.id}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">Cliente ID: {prestamo.clienteId}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        prestamo.estado === 'PENDIENTE' ? 'bg-yellow-500/20 text-yellow-400' :
                        prestamo.estado === 'PAGADO' ? 'bg-green-500/20 text-green-400' :
                        prestamo.estado === 'APROBADO' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {prestamo.estado || 'SIN ESTADO'}
                      </span>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Monto Total</span>
                        <span className="text-lg font-bold text-white">
                          S/ {prestamo.monto ? prestamo.monto.toFixed(2) : '0.00'}
                        </span>
                      </div>
                      <div className="h-px bg-gray-700 my-2"></div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Fecha de Préstamo</span>
                        <span className="text-gray-300">
                          {prestamo.fechaCreacion ? new Date(prestamo.fechaCreacion).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'No especificada'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Tasa de Interés</span>
                        <span className="text-gray-300">
                          {prestamo.interes !== undefined ? `${prestamo.interes}%` : 'No especificada'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botón de pago */}
                  {prestamo.estado !== 'PAGADO' && (
                    <div className="px-5 pb-5 pt-3 border-t border-gray-700">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await seleccionarPrestamo(prestamo);
                          // Pequeño retraso para asegurar que el estado se actualice
                          setTimeout(() => {
                            setIsModalOpen(true);
                          }, 100);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Registrar Pago
                      </button>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg">
              <div className="text-gray-500">
                <p className="text-gray-300">{busqueda ? 'No se encontraron préstamos que coincidan con la búsqueda' : 'No hay préstamos disponibles'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-3 p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors duration-200"
              title="Volver atrás"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Gestión de Pagos</h1>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-400">Préstamo ID: </span>
                <span className="ml-1 px-2 py-0.5 bg-indigo-900/50 text-indigo-300 text-xs font-medium rounded-full border border-indigo-700">
                  #{prestamoId}
                </span>
              </div>
            </div>
          </div>
        </div>
        {prestamoSeleccionado && prestamoSeleccionado.estado !== 'PAGADO' && (
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Registrar Pago
          </button>
        )}
      </div>

      {/* Sección de resumen con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta de préstamo inicial */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Préstamo Inicial</p>
              <p className="text-2xl font-bold text-white">
                S/ {prestamoSeleccionado?.monto?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full backdrop-blur-sm">
              <FaMoneyBillWave className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">Monto original del préstamo</p>
          </div>
        </div>

        {/* Tarjeta de intereses */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Interés ({prestamoSeleccionado?.interes || 0}%)</p>
              <p className="text-2xl font-bold text-amber-400">
                S/ {(montoTotalConInteres - (prestamoSeleccionado?.monto || 0)).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-full backdrop-blur-sm">
              <FaPercentage className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">Costo por el préstamo</p>
          </div>
        </div>

        {/* Tarjeta de monto total con intereses */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Total a Pagar</p>
              <p className="text-2xl font-bold text-green-400">
                S/ {montoTotalConInteres.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full backdrop-blur-sm">
              <FaMoneyBillAlt className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">Préstamo + intereses</p>
          </div>
        </div>

        {/* Tarjeta de pagos realizados */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Pagado</p>
              <p className="text-2xl font-bold text-green-400">
                S/ {totalPagado.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full backdrop-blur-sm">
              <FaCheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">Total abonado</p>
          </div>
        </div>

        {/* Tarjeta de pendiente */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Por Pagar</p>
              <p className="text-2xl font-bold text-amber-400">
                S/ {montoRestante.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-full backdrop-blur-sm">
              <FaClock className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">Saldo pendiente</p>
          </div>
        </div>
      </div>

      {/* Línea de tiempo de pagos */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Historial de Pagos</h2>
            <p className="text-sm text-gray-400 mt-1">Seguimiento de los pagos realizados</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading || (prestamoSeleccionado?.estado === 'PAGADO')}
            className={`inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
              isLoading || (prestamoSeleccionado?.estado === 'PAGADO') ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaMoneyBillWave className="mr-2" />
            Registrar Pago
          </button>
        </div>
        
        {pagos.length > 0 ? (
          <TimelinePagos 
            pagos={pagos} 
            montoTotal={prestamoSeleccionado?.monto || 0} 
            montoRestante={montoRestante || 0} 
          />
        ) : (
          <div className="text-center py-12 bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-700">
            <FaMoneyBillWave className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-200">No hay pagos registrados</h3>
            <p className="mt-1 text-sm text-gray-400">Comienza registrando un nuevo pago.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading || (prestamoSeleccionado?.estado === 'PAGADO')}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200 ${
                  isLoading || (prestamoSeleccionado?.estado === 'PAGADO')
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                }`}
              >
                <FaMoneyBillWave className="-ml-1 mr-2 h-5 w-5" />
                Registrar Primer Pago
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 text-red-200 rounded-r-lg">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Resumen del Préstamo */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Resumen del Préstamo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 hover:bg-gray-800/70 transition-colors duration-200">
                <h3 className="text-gray-400 text-xs font-medium mb-1">Monto Total</h3>
                <p className="text-xl font-bold text-white">
                  S/ {prestamoSeleccionado?.monto?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                </p>
                <div className="mt-2 text-xs text-gray-400">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                    Préstamo inicial
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 hover:bg-gray-800/70 transition-colors duration-200">
                <h3 className="text-gray-400 text-xs font-medium mb-1">Por Pagar</h3>
                <p className="text-xl font-bold text-amber-400">
                  S/ {montoRestante.toFixed(2)}
                </p>
                <div className="mt-2 text-xs text-gray-400">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                    Saldo pendiente
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 hover:bg-gray-800/70 transition-colors duration-200">
                <h3 className="text-gray-400 text-xs font-medium mb-1">Total pagado</h3>
                <p className="text-xl font-bold text-green-400">
                  S/ {totalPagado.toFixed(2)}
                </p>
                <div className="mt-2 text-xs text-gray-400">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Total abonado
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 hover:bg-gray-800/70 transition-colors duration-200">
                <div className="flex justify-between items-start h-full">
                  <div>
                    <h3 className="text-gray-400 text-xs font-medium mb-2">Estado</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      prestamoSeleccionado?.estado === 'PENDIENTE' ? 'bg-yellow-500/20 text-yellow-400' :
                      prestamoSeleccionado?.estado === 'PAGADO' ? 'bg-green-500/20 text-green-400' :
                      prestamoSeleccionado?.estado === 'APROBADO' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {prestamoSeleccionado?.estado || 'SIN ESTADO'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={isLoading || (prestamoSeleccionado?.estado === 'PAGADO')}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200 ${
                      isLoading || prestamoSeleccionado?.estado === 'PAGADO' 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {prestamoSeleccionado?.estado === 'PAGADO' ? 'Pagado' : 'Pagar'}
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Progreso</span>
                    <span>
                      {prestamoSeleccionado?.monto 
                        ? `${((1 - (montoRestante || 0) / prestamoSeleccionado.monto) * 100).toFixed(1)}%` 
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full" 
                      style={{
                        width: prestamoSeleccionado?.monto 
                          ? `${Math.min(100, ((1 - (montoRestante || 0) / prestamoSeleccionado.monto) * 100))}%` 
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pagos */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Registro de Pagos</h2>
            <p className="text-sm text-gray-400 mt-1">Lista detallada de todos los pagos realizados</p>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <BotonActualizarLista 
              onRefresh={() => cargarPagos(prestamoSeleccionado.id)} 
              disabled={isLoading} 
              className="bg-gray-700 hover:bg-gray-600 text-white"
            />
          </div>
        </div>
        
        {isLoading && pagos.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Cargando pagos...</p>
          </div>
        ) : pagos.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monto</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                {pagos.map((pago) => (
                  <tr key={pago.id} className="hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-300 bg-gray-800 px-2.5 py-1 rounded-full">
                        #{pago.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-green-400 font-medium">
                          S/ {parseFloat(pago.montoPago || 0).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {new Date(pago.fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleVerDetalle(pago)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 p-1.5 rounded-full hover:bg-indigo-900/30"
                          title="Ver detalles"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {}}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 p-1.5 rounded-full hover:bg-blue-900/30"
                          title="Descargar recibo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-700">
            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-200">No hay pagos registrados</h3>
            <p className="mt-1 text-sm text-gray-400">Comienza registrando un nuevo pago.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading || (prestamoSeleccionado?.estado === 'PAGADO')}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200 ${
                  isLoading || (prestamoSeleccionado?.estado === 'PAGADO')
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                }`}
              >
                <FaMoneyBillWave className="-ml-1 mr-2 h-5 w-5" />
                Registrar Primer Pago
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botón flotante para móviles */}
      {prestamoSeleccionado && prestamoSeleccionado.estado !== 'PAGADO' && (
        <div className="fixed bottom-6 right-6 md:hidden">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Registrar pago"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      )}

      {/* Modal de Registro de Pago */}
      <ModalRegistroPago
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPagoRegistrado={registrarNuevoPago}
        cargando={isLoading}
        prestamoId={prestamoSeleccionado?.id}
      />
      
      <DetallePagoModal
        isOpen={isDetalleModalOpen}
        onClose={() => setIsDetalleModalOpen(false)}
        pago={pagoSeleccionado}
      />
    </div>
  );
};

export default PagosPage;
