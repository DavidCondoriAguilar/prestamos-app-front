import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TimelinePagos = ({ pagos, montoTotal, montoRestante }) => {
  // Calcular el progreso del pago
  const montoPagado = montoTotal - montoRestante;
  const porcentajePagado = (montoPagado / montoTotal) * 100;

  // Ordenar pagos por fecha (más reciente primero)
  const pagosOrdenados = [...pagos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  // Función para formatear fechas
  const formatearFecha = (fecha) => {
    return format(new Date(fecha), "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Barra de progreso */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso del préstamo</span>
          <span className="text-sm font-semibold text-indigo-600">{porcentajePagado.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${porcentajePagado}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">Pagado: S/ {montoPagado.toFixed(2)}</span>
          <span className="text-xs text-gray-500">Total: S/ {montoTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Línea de tiempo */}
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
        
        <div className="space-y-8">
          {pagosOrdenados.map((pago, index) => (
            <div key={pago.id} className="relative pl-12">
              {/* Punto de la línea de tiempo */}
              <div className="absolute left-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              </div>
              
              {/* Tarjeta de pago */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Pago #{pagosOrdenados.length - index}</h3>
                    <p className="text-sm text-gray-500">{formatearFecha(pago.fecha)}</p>
                  </div>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Completado
                  </span>
                </div>
                
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    S/ {pago.montoPago.toFixed(2)}
                  </span>
                  <button 
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    onClick={() => console.log('Ver recibo', pago.id)}
                  >
                    Ver recibo
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Próximo pago */}
          {montoRestante > 0 && (
            <div className="relative pl-12">
              <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-dashed border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-blue-900">Próximo pago</h3>
                    <p className="text-sm text-blue-600">Pendiente de pago</p>
                  </div>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Pendiente
                  </span>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-blue-700">
                    Monto restante: <span className="font-semibold">S/ {montoRestante.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelinePagos;
