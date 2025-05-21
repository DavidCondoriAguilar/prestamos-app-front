import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  obtenerPagosPorPrestamo,
  registrarPago,
  calcularMontoRestante,
} from "../../api/pagoApi";
import { obtenerTodosLosPrestamos } from "../../api/prestamoApi";
import { toast } from "react-toastify";
import MontoRestante from "../../components/pagos/MontoRestante";
import BotonActualizarLista from "../../components/pagos/BotonActualizarLista";
import ListaPagos from "../../components/pagos/ListaPagos";
import ModalRegistroPago from "../../components/pagos/ModalRegistroPago";
import DetallePagoModal from "../../components/pagos/DetallePagoModal";
// Iconos
import { FaSearch, FaMoneyBillWave, FaUserAlt, FaClock, FaCheckCircle, FaMoneyBillAlt, FaEye } from "react-icons/fa";
import TimelinePagos from '../../components/pagos/TimelinePagos';

const PagosPage = () => {
  const { prestamoId } = useParams();
  const navigate = useNavigate();
  const [pagos, setPagos] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [montoRestante, setMontoRestante] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Cargar préstamos al montar el componente o cuando cambia el prestamoId
  useEffect(() => {
    const cargarPrestamos = async () => {
      try {
        setCargando(true);
        const data = await obtenerTodosLosPrestamos();
        setPrestamos(data || []);
        
        // Si hay un prestamoId en la URL, seleccionar ese préstamo
        if (prestamoId) {
          const prestamo = data.find(p => p.id === Number(prestamoId));
          if (prestamo) {
            setPrestamoSeleccionado(prestamo);
            // No es necesario navegar si ya estamos en la ruta correcta
            // navigate(`/pagos/${prestamoId}`);
            await cargarPagos();
            await calcularMontoRestantePrestamo();
          } else {
            // Si el préstamo no se encuentra, redirigir a la lista de pagos
            navigate('/pagos');
            toast.error('Préstamo no encontrado');
          }
        }
      } catch (error) {
        console.error("Error al cargar préstamos:", error);
        toast.error("No se pudieron cargar los préstamos");
      } finally {
        setCargando(false);
      }
    };

    cargarPrestamos();
  }, [prestamoId, navigate]);

// Función para cargar los pagos de un préstamo específico
const cargarPagos = async () => {
  if (!prestamoId) return;
  
  setCargando(true);
  setError(null);
  
  try {
    const response = await obtenerPagosPorPrestamo(Number(prestamoId));
    console.log("Datos recibidos del backend:", response);
    
    // La API devuelve un array directo según pagoApi.ts
    if (Array.isArray(response)) {
      setPagos(response);
    } else {
      console.error("La respuesta del backend no es un array:", response);
      toast.error("Error: Formato de respuesta inesperado");
      setPagos([]);
    }
  } catch (error) {
    console.error("Error al cargar los pagos:", error);
    setError("No se pudieron cargar los pagos");
    toast.error("Error al cargar los pagos");
  } finally {
    setCargando(false);
  }
};

  // Función para calcular el monto restante de un préstamo
  const calcularMontoRestantePrestamo = async () => {
    if (!prestamoId) return;
    
    try {
      setCargando(true);
      const monto = await calcularMontoRestante(Number(prestamoId));
      setMontoRestante(monto);
      return monto;
    } catch (error) {
      console.error("Error al calcular el monto restante:", error);
      toast.error("Error al calcular el monto restante");
      return null;
    } finally {
      setCargando(false);
    }
  };

  // Función para registrar un nuevo pago
  const registrarNuevoPago = async (pago) => {
    if (!prestamoSeleccionado?.id) {
      toast.error("No se ha seleccionado un préstamo válido");
      console.error("No hay préstamo seleccionado o el ID es inválido");
      return false;
    }
    
    try {
      setCargando(true);
      
      // Validar el monto
      const montoPago = Number(pago.montoPago);
      if (isNaN(montoPago) || montoPago <= 0) {
        throw new Error("El monto del pago debe ser mayor a cero");
      }
      
      // Validar que el monto no exceda el saldo pendiente
      if (montoPago > montoRestante) {
        throw new Error(`El monto excede el saldo pendiente de S/ ${montoRestante.toFixed(2)}`);
      }
      
      // Crear el objeto de pago con el formato correcto
      const pagoData = {
        montoPago: montoPago,
        fecha: pago.fecha || new Date().toISOString().split('T')[0]
      };
      
      console.log("Intentando registrar pago con datos:", {
        prestamoId: prestamoSeleccionado.id,
        pagoData
      });
      
      // Registrar el pago
      await registrarPago(prestamoSeleccionado.id, pagoData);
      
      // Mostrar mensaje de éxito
      toast.success("✓ Pago registrado correctamente");
      
      // Actualizar la lista de pagos y el monto restante
      await Promise.all([
        cargarPagos(),
        calcularMontoRestantePrestamo()
      ]);
      
      // Cerrar el modal
      setIsModalOpen(false);
      
      return true;
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      
      // Mostrar mensaje de error más descriptivo
      let mensajeError = "Error al registrar el pago";
      if (error.message) {
        mensajeError = error.message;
      } else if (error.response?.data?.message) {
        mensajeError = error.response.data.message;
      } else if (error.response?.data) {
        mensajeError = JSON.stringify(error.response.data);
      }
      
      toast.error(mensajeError);
      return false;
    } finally {
      setCargando(false);
    }
  };

  // Función para manejar la visualización de detalles del pago
  const handleVerDetalle = (pago) => {
    setPagoSeleccionado(pago);
    setIsDetalleModalOpen(true);
  };

  // Filtrar préstamos según la búsqueda
  const prestamosFiltrados = prestamos.filter(prestamo => {
    if (!busqueda) return true;
    const busquedaMin = busqueda.toLowerCase();
    return (
      (prestamo.clienteId?.toString() || '').toLowerCase().includes(busquedaMin) ||
      (prestamo.id?.toString() || '').toLowerCase().includes(busquedaMin) ||
      (prestamo.estado?.toLowerCase() || '').includes(busquedaMin)
    );
  });

  const seleccionarPrestamo = async (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    navigate(`/pagos/${prestamo.id}`);
    // No es necesario cargar los pagos aquí ya que el efecto se disparará con el cambio de prestamoId
  };

  // Vista de selección de préstamo
  if (!prestamoId) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Seleccione un Préstamo</h1>
              <p className="text-gray-600 mt-1">Seleccione un préstamo para ver su historial de pagos</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate('/prestamos')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Lista de préstamos */}
          {cargando ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando préstamos...</p>
            </div>
          ) : prestamosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prestamosFiltrados.map((prestamo) => (
                <div 
                  key={prestamo.id}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
                >
                  <div 
                    onClick={() => seleccionarPrestamo(prestamo)}
                    className="cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          Préstamo #{prestamo.id}
                        </h3>
                        <p className="text-sm text-gray-500">Cliente ID: {prestamo.clienteId}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        prestamo.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                        prestamo.estado === 'PAGADO' || prestamo.estado === 'APROBADO' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {prestamo.estado || 'SIN ESTADO'}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-gray-600">
                        S/ {prestamo.monto ? prestamo.monto.toFixed(2) : '0.00'}
                      </div>
                      <div className="text-gray-500 text-sm">
                        ID: {prestamo.id}
                      </div>
                    </div>
                  </div>
                  
                  {/* Botón de pago */}
                  {prestamo.estado !== 'PAGADO' && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await seleccionarPrestamo(prestamo);
                          // Pequeño retraso para asegurar que el estado se actualice
                          setTimeout(() => {
                            setIsModalOpen(true);
                          }, 100);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Registrar Pago
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                {busqueda ? 'No se encontraron préstamos que coincidan con la búsqueda' : 'No hay préstamos disponibles'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Pagos</h1>
          <p className="text-sm text-gray-600">Préstamo ID: {prestamoId}</p>
        </div>
        {prestamoSeleccionado && prestamoSeleccionado.estado !== 'PAGADO' && (
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={cargando}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Registrar Pago
          </button>
        )}
      </div>

      {/* Sección de resumen con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta de monto total */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Monto Total</p>
              <p className="text-2xl font-bold">
                S/ {prestamoSeleccionado?.monto?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FaMoneyBillAlt className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tarjeta de pagos realizados */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Pagado</p>
              <p className="text-2xl font-bold">
                S/ {((prestamoSeleccionado?.monto || 0) - (montoRestante || 0)).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FaCheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tarjeta de pendiente */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Por Pagar</p>
              <p className="text-2xl font-bold">
                S/ {(montoRestante || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FaClock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Línea de tiempo de pagos */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Historial de Pagos</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={cargando || (prestamoSeleccionado?.estado === 'PAGADO')}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              cargando || (prestamoSeleccionado?.estado === 'PAGADO') ? 'opacity-50 cursor-not-allowed' : ''
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
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaMoneyBillWave className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pagos registrados</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza registrando un nuevo pago.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Resumen del Préstamo */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Resumen del Préstamo</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-blue-100 text-sm">Monto del préstamo</p>
                <p className="text-xl font-semibold">
                  S/ {prestamoSeleccionado?.monto?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Monto restante</p>
                <p className="text-xl font-semibold">
                  S/ {montoRestante?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Total pagado</p>
                <p className="text-xl font-semibold">
                  S/ {prestamoSeleccionado?.monto - (montoRestante || 0) > 0 ? 
                      (prestamoSeleccionado.monto - montoRestante).toLocaleString('es-PE', { minimumFractionDigits: 2 }) : '0.00'}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Estado</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  prestamoSeleccionado?.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                  prestamoSeleccionado?.estado === 'PAGADO' || prestamoSeleccionado?.estado === 'APROBADO' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {prestamoSeleccionado?.estado || 'SIN ESTADO'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={cargando || (prestamoSeleccionado?.estado === 'PAGADO')}
            className={`mt-4 md:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              cargando || prestamoSeleccionado?.estado === 'PAGADO' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {prestamoSeleccionado?.estado === 'PAGADO' ? 'Préstamo Pagado' : 'Registrar Pago'}
          </button>
        </div>
      </div>

      {/* Lista de Pagos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Historial de Pagos</h2>
          <div className="flex space-x-2">
            <BotonActualizarLista 
              onRefresh={cargarPagos} 
              disabled={cargando} 
            />
            <button
              onClick={calcularMontoRestantePrestamo}
              disabled={cargando}
              className={`p-2 text-gray-600 hover:bg-gray-100 rounded-full ${
                cargando ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Actualizar monto restante"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        
        {cargando && pagos.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando pagos...</p>
          </div>
        ) : pagos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagos.map((pago) => (
                  <tr key={pago.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{pago.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      S/ {pago.montoPago?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pago.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleVerDetalle(pago)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Ver detalles"
                      >
                        <FaEye className="inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pagos registrados</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza registrando un nuevo pago.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={cargando || (prestamoSeleccionado?.estado === 'PAGADO')}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  cargando || prestamoSeleccionado?.estado === 'PAGADO' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
              >
                <FaMoneyBillWave className="-ml-1 mr-2 h-5 w-5" />
                Registrar Pago
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
            className="p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
        cargando={cargando}
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