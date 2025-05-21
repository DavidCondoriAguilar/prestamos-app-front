import React, { useState, useEffect } from 'react';
import { FaChartLine, FaMoneyBillWave, FaUsers, FaCalendarAlt, FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';

// Datos de ejemplo - Reemplazar con datos reales de tu API
const datosEjemplo = {
  totalPrestamos: 125000,
  totalPagos: 87500,
  clientesActivos: 42,
  proximosVencimientos: 7,
  tendenciaMensual: [
    { mes: 'Ene', prestamos: 4000, pagos: 3000 },
    { mes: 'Feb', prestamos: 3000, pagos: 2000 },
    { mes: 'Mar', prestamos: 5000, pagos: 4000 },
    { mes: 'Abr', prestamos: 7000, pagos: 5000 },
    { mes: 'May', prestamos: 6000, pagos: 4500 },
    { mes: 'Jun', prestamos: 8000, pagos: 6000 },
  ],
  distribucionPorTipo: [
    { name: 'Personal', value: 45 },
    { name: 'Negocio', value: 30 },
    { name: 'Emergencia', value: 25 },
  ]
};

const TarjetaEstadistica = ({ titulo, valor, icono, color, variacion }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{titulo}</p>
        <p className="text-2xl font-bold mt-1">
          {typeof valor === 'number' ? `S/ ${valor.toLocaleString()}` : valor}
        </p>
        {variacion && (
          <div className={`mt-2 text-sm flex items-center ${variacion > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {variacion > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
            {Math.abs(variacion)}% vs mes anterior
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
        {React.cloneElement(icono, { className: 'text-2xl' })}
      </div>
    </div>
  </div>
);

const GraficoBarras = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(item => Math.max(item.prestamos, item.pagos)));
  
  return (
    <div className="mt-4" style={{ height: `${height}px` }}>
      <div className="flex items-end h-full space-x-2">
        {data.map((item, index) => {
          const alturaPrestamos = (item.prestamos / maxValue) * 100;
          const alturaPagos = (item.pagos / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="flex items-end w-full h-full" style={{ height: '90%' }}>
                <div 
                  className="w-1/2 bg-blue-200 hover:bg-blue-300 transition-colors rounded-t"
                  style={{ height: `${alturaPrestamos}%` }}
                  title={`Préstamos: S/ ${item.prestamos}`}
                />
                <div 
                  className="w-1/2 bg-green-200 hover:bg-green-300 transition-colors rounded-t ml-0.5"
                  style={{ height: `${alturaPagos}%` }}
                  title={`Pagos: S/ ${item.pagos}`}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">{item.mes}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center space-x-6 mt-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span className="text-xs">Préstamos</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span className="text-xs">Pagos</span>
        </div>
      </div>
    </div>
  );
};

const GraficoTorta = ({ data, width = 200, height = 200 }) => {
  const radio = Math.min(width, height) / 2 - 10;
  const centroX = width / 2;
  const centroY = height / 2;
  
  let acumuladoAngulo = -90;
  const colores = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const calcularCoordenadas = (angulo, radio) => {
    const radianes = (angulo * Math.PI) / 180;
    return {
      x: centroX + radio * Math.cos(radianes),
      y: centroY + radio * Math.sin(radianes)
    };
  };
  
  const crearArco = (startAngle, angle, color, index) => {
    if (angle <= 0) return null;
    
    const start = calcularCoordenadas(startAngle, radio);
    const end = calcularCoordenadas(startAngle + angle, radio);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centroX} ${centroY}`,
      `L ${start.x} ${start.y}`,
      `A ${radio} ${radio} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z'
    ].join(' ');
    
    return (
      <path
        key={index}
        d={pathData}
        fill={color}
        stroke="#fff"
        strokeWidth="1"
        className="hover:opacity-90 transition-opacity"
      />
    );
  };
  
  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height}>
        {data.map((item, index) => {
          const angulo = (item.value / total) * 360;
          const arco = crearArco(acumuladoAngulo, angulo, colores[index % colores.length], index);
          acumuladoAngulo += angulo;
          return arco;
        })}
      </svg>
      <div className="mt-4 space-y-2 w-full">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: colores[index % colores.length] }}
            />
            <span className="text-sm">
              {item.name}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Estadisticas = () => {
  const [datos, setDatos] = useState(datosEjemplo);
  const [cargando, setCargando] = useState(true);
  
  // Aquí iría la llamada a tu API para obtener los datos reales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Reemplazar con llamada real a tu API
        // const respuesta = await fetch('/api/estadisticas');
        // const datosReales = await respuesta.json();
        // setDatos(datosReales);
        setTimeout(() => {
          setCargando(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, []);
  
  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Estadísticas</h1>
      
      {/* Resumen de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <TarjetaEstadistica 
          titulo="Total Prestados" 
          valor={datos.totalPrestamos} 
          icon={<FaMoneyBillWave />} 
          color="text-blue-500"
          variacion={12.5}
        />
        <TarjetaEstadistica 
          titulo="Total Recuperado" 
          valor={datos.totalPagos} 
          icon={<FaExchangeAlt />} 
          color="text-green-500"
          variacion={8.3}
        />
        <TarjetaEstadistica 
          titulo="Clientes Activos" 
          valor={datos.clientesActivos} 
          icon={<FaUsers />} 
          color="text-purple-500"
          variacion={5.2}
        />
        <TarjetaEstadistica 
          titulo="Próximos Vencimientos" 
          valor={datos.proximosVencimientos} 
          icon={<FaCalendarAlt />} 
          color="text-yellow-500"
        />
      </div>
      
      {/* Gráfico de tendencia mensual */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Tendencia Mensual</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
              Mes
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 rounded-md hover:bg-gray-100">
              Año
            </button>
          </div>
        </div>
        <GraficoBarras data={datos.tendenciaMensual} />
      </div>
      
      {/* Gráficos inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Distribución por tipo de préstamo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribución por Tipo</h2>
          <div className="flex justify-center">
            <GraficoTorta data={datos.distribucionPorTipo} width={200} height={200} />
          </div>
        </div>
        
        {/* Últimos movimientos */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimos Movimientos</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <FaExchangeAlt className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Pago registrado</p>
                    <p className="text-sm text-gray-500">Hace 2 horas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">S/ 1,200.00</p>
                  <p className="text-sm text-green-500">Completado</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">
            Ver todos los movimientos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;