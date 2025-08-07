import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiClock, 
  FiCheckCircle, 
  FiUsers,
  FiAlertTriangle,
  FiRefreshCw,
  FiInfo,
  FiPieChart,
  FiBarChart2,
  FiAlertCircle
} from 'react-icons/fi';
import { FaExclamationTriangle } from 'react-icons/fa';
import MoraSummaryCard from '../../components/dashboard/MoraSummaryCard';
import { obtenerTodosLosPrestamos } from '../../api/prestamoApi';
import DonutChart from '../../components/charts/DonutChart';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';

// Componente de tarjeta de estadística
const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend = 0, 
  trendLabel = '',
  loading = false,
  delay = 0 
}) => {
  const isPositive = trend >= 0;
  const trendColor = isPositive ? 'text-green-400' : 'text-red-400';
  const bgColor = isPositive ? 'from-green-900/20 to-green-900/10' : 'from-red-900/20 to-red-900/10';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`p-5 rounded-2xl bg-gradient-to-br ${bgColor} border border-gray-700/50 backdrop-blur-sm 
        hover:border-gray-600/50 transition-all duration-300 group relative overflow-hidden`}
    >
      {/* Efecto de brillo al pasar el mouse */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            {loading ? (
              <div className="h-8 w-24 mt-2 bg-gray-700/50 rounded-md animate-pulse"></div>
            ) : (
              <h3 className="mt-1 text-2xl font-bold text-white">{value}</h3>
            )}
          </div>
          <div className={`p-2.5 rounded-xl backdrop-blur-sm ${isPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            {React.cloneElement(icon, { 
              className: `w-5 h-5 ${isPositive ? 'text-green-400' : 'text-red-400'}` 
            })}
          </div>
        </div>
        
        {!isNaN(trend) && trend !== 0 && !loading && (
          <div className="mt-3 flex items-center">
            <span className={`text-xs font-medium ${trendColor} flex items-center`}>
              {isPositive ? (
                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {Math.abs(trend)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {trendLabel}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [chartView, setChartView] = useState('donut');
  const [chartDataType, setChartDataType] = useState('monto');
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    pagados: 0,
    vencidos: 0,
    montoTotal: 0,
    montoPagado: 0,
    montoPendiente: 0,
    clientesUnicos: 0,
    morosidad: 0,
    eficiencia: 0,
    rotacion: 0,
    ticketPromedio: 0,
    tendenciaMonto: 0,
    tendenciaPendientes: 0,
    tendenciaPagados: 0,
    tendenciaVencidos: 0
  });
  
  const [chartData, setChartData] = useState({
    estados: [],
    tendencia: [],
    distribucion: []
  });

  // Función para calcular estadísticas
  const calcularEstadisticas = (prestamos) => {
    const total = prestamos.length;
    const pendientes = prestamos.filter(p => p.estado === 'PENDIENTE').length;
    const pagados = prestamos.filter(p => p.estado === 'PAGADO').length;
    const vencidos = prestamos.filter(p => p.estado === 'VENCIDO').length;
    
    const montoTotal = prestamos.reduce((sum, p) => sum + parseFloat(p.monto), 0);
    const montoPagado = prestamos
      .filter(p => p.estado === 'PAGADO')
      .reduce((sum, p) => sum + parseFloat(p.monto), 0);
    
    const montoPendiente = montoTotal - montoPagado;
    const promedioPrestamo = total > 0 ? montoTotal / total : 0;
    const clientesUnicos = new Set(prestamos.map(p => p.clienteId)).size;
    
    // Calcular métricas adicionales
    const morosidad = total > 0 ? (vencidos / total) * 100 : 0;
    const eficiencia = total > 0 ? (pagados / total) * 100 : 0;
    const rotacion = clientesUnicos > 0 ? total / clientesUnicos : 0;
    const ticketPromedio = total > 0 ? montoTotal / total : 0;
    
    // Datos simulados para tendencia (en una aplicación real, estos vendrían de la API)
    const tendenciaMonto = Math.random() > 0.5 ? 
      (Math.random() * 15 + 5).toFixed(1) : 
      -(Math.random() * 10 + 2).toFixed(1);
      
    const tendenciaPendientes = Math.random() > 0.5 ? 
      (Math.random() * 10 + 2).toFixed(1) : 
      -(Math.random() * 5 + 1).toFixed(1);
      
    const tendenciaPagados = Math.random() > 0.5 ? 
      (Math.random() * 12 + 3).toFixed(1) : 
      -(Math.random() * 8 + 2).toFixed(1);
      
    const tendenciaVencidos = Math.random() > 0.5 ? 
      (Math.random() * 8 + 2).toFixed(1) : 
      -(Math.random() * 12 + 3).toFixed(1);
    
    return {
      total,
      pendientes,
      pagados,
      vencidos,
      montoTotal,
      montoPagado,
      montoPendiente,
      promedioPrestamo,
      clientesUnicos,
      morosidad,
      eficiencia,
      rotacion,
      ticketPromedio,
      tendenciaMonto: parseFloat(tendenciaMonto),
      tendenciaPendientes: parseFloat(tendenciaPendientes),
      tendenciaPagados: parseFloat(tendenciaPagados),
      tendenciaVencidos: parseFloat(tendenciaVencidos)
    };
  };

  // Función para generar datos de gráficos
  const generarDatosGraficos = (prestamos) => {
    // Datos para el gráfico de estados
    const estados = [
      { label: 'Pendientes', value: prestamos.filter(p => p.estado === 'PENDIENTE').length, color: '#F59E0B' },
      { label: 'Pagados', value: prestamos.filter(p => p.estado === 'PAGADO').length, color: '#10B981' },
      { label: 'Vencidos', value: prestamos.filter(p => p.estado === 'VENCIDO').length, color: '#EF4444' }
    ];
    
    // Datos simulados para la tendencia (últimos 6 meses)
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const tendencia = meses.map((mes, i) => {
      const base = Math.random() * 5000 + 5000;
      const factor = 1 + (i * 0.1);
      return {
        name: mes,
        monto: Math.round(base * factor),
        cantidad: Math.round((base * factor) / 500),
        clientes: Math.round((base * factor) / 1000)
      };
    });
    
    // Datos para la distribución (ejemplo por monto)
    const distribucion = [
      { rango: 'S/ 0 - 500', cantidad: Math.floor(Math.random() * 50) + 10 },
      { rango: 'S/ 501 - 1,000', cantidad: Math.floor(Math.random() * 40) + 5 },
      { rango: 'S/ 1,001 - 2,000', cantidad: Math.floor(Math.random() * 30) + 3 },
      { rango: 'S/ 2,001 - 5,000', cantidad: Math.floor(Math.random() * 20) + 2 },
      { rango: 'S/ 5,001+', cantidad: Math.floor(Math.random() * 10) + 1 },
    ];
    
    return { estados, tendencia, distribucion };
  };

  // Función para cargar los datos
  const cargarDatos = async () => {
    try {
      setCargando(true);
      const response = await obtenerTodosLosPrestamos();
      
      // Ensure we're working with an array
      const data = Array.isArray(response) ? response : [];
      
      setPrestamos(data);
      
      // Only calculate stats if we have data
      if (data.length > 0) {
        const stats = calcularEstadisticas(data);
        setEstadisticas(stats);
        
        const graficos = generarDatosGraficos(data);
        setChartData(graficos);
      } else {
        // Set default/empty values if no data
        setEstadisticas({
          total: 0,
          pendientes: 0,
          pagados: 0,
          vencidos: 0,
          montoTotal: 0,
          montoPagado: 0,
          montoPendiente: 0,
          clientesUnicos: 0,
          morosidad: 0,
          eficiencia: 0,
          rotacion: 0,
          ticketPromedio: 0,
          tendenciaMonto: 0,
          tendenciaPendientes: 0,
          tendenciaPagados: 0,
          tendenciaVencidos: 0
        });
        setChartData({
          estados: [],
          tendencia: [],
          distribucion: []
        });
      }
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar los préstamos:', err);
      setError('Error al cargar los préstamos. Por favor, intente de nuevo más tarde.');
    } finally {
      setCargando(false);
      setIsRefreshing(false);
    }
  };
  
  // Función para refrescar los datos
  const refrescarDatos = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    cargarDatos();
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
    
    // Configurar actualización automática cada 5 minutos
    const intervalo = setInterval(() => {
      if (document.visibilityState === 'visible') {
        cargarDatos();
      }
    }, 5 * 60 * 1000);
    
    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalo);
  }, []);

  // Función para formatear montos en soles
  const formatCurrency = (value) => {
    if (isNaN(Number(value))) return 'S/ 0.00';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value));
  };

  // Función para formatear porcentajes
  const formatPercent = (value) => {
    if (isNaN(Number(value))) return '0.0%';
    const numValue = Number(value);
    return new Intl.NumberFormat('es-PE', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(numValue / 100);
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Extraer estadísticas del estado
  const { 
    total, 
    pendientes, 
    pagados, 
    vencidos, 
    montoTotal, 
    montoPagado, 
    montoPendiente,
    promedioPrestamo = 0, 
    clientesUnicos, 
    morosidad, 
    eficiencia, 
    rotacion, 
    ticketPromedio,
    tendenciaMonto,
    tendenciaPendientes,
    tendenciaPagados,
    tendenciaVencidos,
    porcentajePagado = 0
  } = estadisticas;
  
  // Extraer datos para gráficos
  const { estados, tendencia, distribucion } = chartData;

  return (
    <div className="p-4 md:p-6 bg-gray-900/50 rounded-2xl w-full overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Panel de Control</h1>
        <p className="text-gray-400">Resumen general de tu cartera de préstamos</p>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 w-full">
        <StatCard
          title="Total Préstamos"
          value={total}
          icon={<FiDollarSign />}
          trend={tendenciaPendientes}
          trendLabel="vs mes pasado"
          loading={cargando}
        />
        <StatCard
          title="Monto Total"
          value={formatCurrency(montoTotal)}
          icon={<FiTrendingUp />}
          trend={tendenciaMonto}
          trendLabel="vs mes pasado"
          loading={cargando}
        />
        <StatCard
          title="Clientes Únicos"
          value={clientesUnicos}
          icon={<FiUsers />}
          trend={5.2}
          trendLabel="vs mes pasado"
          loading={cargando}
        />
        <StatCard
          title="Tasa de Morosidad"
          value={formatPercent(morosidad)}
          icon={morosidad > 10 ? <FiAlertTriangle /> : <FiCheckCircle />}
          trend={morosidad > 10 ? 12.5 : -3.2}
          trendLabel={morosidad > 10 ? "¡Atención!" : "Bajo control"}
          loading={cargando}
        />
      </div>
      
      {/* Segunda fila de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 w-full">
        <StatCard
          title="Pendientes"
          value={pendientes}
          icon={<FiClock />}
          trend={tendenciaPendientes}
          trendLabel="vs mes pasado"
          loading={cargando}
        />
        <StatCard
          title="Pagados"
          value={pagados}
          icon={<FiCheckCircle />}
          trend={tendenciaPagados}
          trendLabel="vs mes pasado"
          loading={cargando}
        />
        <StatCard
          title="Vencidos"
          value={vencidos}
          icon={<FiAlertTriangle />}
          trend={tendenciaVencidos}
          trendLabel={vencidos > 0 ? "¡Atención!" : "Sin vencidos"}
          loading={cargando}
        />
        {/* Reemplazamos la tarjeta de Ticket Promedio por la de Préstamos en Mora */}
        <motion.div 
          className="bg-gradient-to-br from-red-900/30 to-red-800/20 p-5 rounded-xl border border-red-900/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-sm font-medium text-red-300 uppercase tracking-wider">En Morosos</h3>
              <p className="text-2xl font-bold text-white">
                {cargando ? '...' : vencidos}
              </p>
            </div>
            <div className="p-2 bg-red-500/20 rounded-lg">
              <FaExclamationTriangle className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center text-xs text-red-300">
              <FiAlertCircle className="mr-1" />
              <span>{vencidos > 0 ? "¡Acción requerida!" : "Todo bajo control"}</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Tercera fila con la tarjeta de resumen de mora */}
      <div className="grid grid-cols-1 gap-5 mb-8 w-full">
        <MoraSummaryCard />
      </div>

      {/* Sección de gráficos interactivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8 w-full">
        {/* Gráfico de dona interactivo */}
        <motion.div 
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
          whileHover={{ y: -5, scale: 1.01 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Distribución de Préstamos</h3>
              <p className="text-sm text-gray-400">Por estado actual</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className={`p-1.5 rounded-lg ${chartView === 'donut' ? 'bg-blue-500/20' : 'bg-gray-700/50'} hover:bg-gray-600/50 transition-colors`}
                onClick={() => setChartView('donut')}
                aria-label="Ver como gráfico de dona"
              >
                <FiPieChart className="w-4 h-4" />
              </button>
              <button 
                className={`p-1.5 rounded-lg ${chartView === 'bars' ? 'bg-blue-500/20' : 'bg-gray-700/50'} hover:bg-gray-600/50 transition-colors`}
                onClick={() => setChartView('bars')}
                aria-label="Ver como barras"
              >
                <FiBarChart2 className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                onClick={refrescarDatos}
                disabled={isRefreshing}
                aria-label="Actualizar datos"
              >
                <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="h-80 flex flex-col lg:flex-row items-center justify-center gap-6">
            {cargando ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse text-gray-500">Cargando datos...</div>
              </div>
            ) : (
              <>
                <div className={`w-64 h-64 transition-all duration-500 ${chartView === 'donut' ? 'scale-100' : 'scale-0 absolute'}`}>
                  <div className="relative w-full h-full">
                    <DonutChart 
                      data={estados} 
                      onSegmentHover={setHoveredSegment}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-white">
                        {hoveredSegment ? hoveredSegment.value : estados.reduce((sum, item) => sum + item.value, 0)}
                      </span>
                      <span className="text-sm text-gray-400">
                        {hoveredSegment ? hoveredSegment.label : 'Total'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`w-full transition-all duration-500 ${chartView === 'bars' ? 'scale-100' : 'scale-0 absolute'}`}>
                  <BarChart 
                    data={estados} 
                    height={280}
                    onBarHover={setHoveredSegment}
                  />
                </div>
                
                {/* Leyenda interactiva */}
                <div className="w-full max-w-xs space-y-3">
                  {estados.map((estado) => (
                    <motion.div 
                      key={estado.label}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        hoveredSegment?.label === estado.label 
                          ? 'bg-gray-700/80 scale-105' 
                          : 'bg-gray-800/50 hover:bg-gray-700/70'
                      }`}
                      onMouseEnter={() => setHoveredSegment(estado)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-3" 
                            style={{ backgroundColor: estado.color }}
                          />
                          <span className="text-sm font-medium text-gray-300">
                            {estado.label}
                          </span>
                        </div>
                        <span className="text-white font-semibold">
                          {estado.value}
                          <span className="text-xs text-gray-400 ml-1">
                            ({total > 0 ? (estado.value / total * 100).toFixed(1) : 0}%)
                          </span>
                        </span>
                      </div>
                      {hoveredSegment?.label === estado.label && (
                        <motion.div 
                          className="mt-2 text-xs text-gray-400"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {estado.label === 'Pendientes' && 'Préstamos que están en proceso de pago'}
                          {estado.label === 'Pagados' && 'Préstamos completamente pagados'}
                          {estado.label === 'Vencidos' && 'Préstamos con pagos atrasados'}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
        
        {/* Gráfico de líneas con controles */}
        <motion.div 
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
          whileHover={{ y: -5, scale: 1.01 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Tendencia de Préstamos</h3>
              <p className="text-sm text-gray-400">Últimos 6 meses</p>
            </div>
            <div className="flex items-center space-x-2 bg-gray-800/70 p-1 rounded-lg">
              {['Monto', 'Cantidad', 'Clientes'].map((type) => {
                const typeLower = type.toLowerCase();
                return (
                  <motion.button
                    key={typeLower}
                    onClick={() => setChartDataType(typeLower)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      chartDataType === typeLower 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {type}
                  </motion.button>
                );
              })}
              <button 
                className="p-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                onClick={refrescarDatos}
                disabled={isRefreshing}
                aria-label="Actualizar datos"
              >
                <FiRefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="h-80">
            {cargando ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse text-gray-500">Cargando datos...</div>
              </div>
            ) : (
              <LineChart 
                data={tendencia} 
                selectedType={chartDataType}
                colors={{
                  monto: '#3B82F6',
                  cantidad: '#10B981',
                  clientes: '#8B5CF6'
                }}
              />
            )}
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-400 gap-2">
            <div className="flex items-center">
              <FiInfo className="mr-1.5 flex-shrink-0" />
              <span>Haz clic en la leyenda para mostrar/ocultar líneas</span>
            </div>
            <div className="flex items-center text-xs">
              <FiRefreshCw className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Actualizado hace {Math.floor(Math.random() * 5) + 1} min</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
        <motion.div 
          className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-6 rounded-xl border border-purple-500/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center mb-2">
            <FiDollarSign className="text-purple-400 mr-2" />
            <h4 className="text-sm font-medium text-purple-400">Promedio por Préstamo</h4>
          </div>
          <p className="text-2xl font-bold text-white">
            S/ {promedioPrestamo.toLocaleString('es-PE', { maximumFractionDigits: 2 })}
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-6 rounded-xl border border-blue-500/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
        >
          <div className="flex items-center mb-2">
            <FiCheckCircle className="text-blue-400 mr-2" />
            <h4 className="text-sm font-medium text-blue-400">Tasa de Finalización</h4>
          </div>
          <p className="text-2xl font-bold text-white">{porcentajePagado}%</p>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-6 rounded-xl border border-green-500/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
        >
          <div className="flex items-center mb-2">
            <FiUsers className="text-green-400 mr-2" />
            <h4 className="text-sm font-medium text-green-400">Clientes Activos</h4>
          </div>
          <p className="text-2xl font-bold text-white">
            {clientesUnicos}
          </p>
        </motion.div>
      </div>

      {/* Sección de préstamos recientes */}
      <div className="mt-8 md:mt-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-2">
          <h2 className="text-xl font-bold text-white">Préstamos Recientes</h2>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            Ver todos →
          </button>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-700 w-full">
              <thead className="bg-gray-800/80">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Monto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {prestamos.slice(0, 5).map((prestamo) => (
                  <tr key={prestamo.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      #{prestamo.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      Cliente {prestamo.clienteId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      S/ {parseFloat(prestamo.monto).toLocaleString('es-PE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        prestamo.estado === 'PAGADO' ? 'bg-green-500/20 text-green-400' :
                        prestamo.estado === 'PENDIENTE' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {prestamo.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(prestamo.fechaSolicitud).toLocaleDateString('es-PE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;