import React, { useState, useEffect } from 'react';
import ListaPagos from '../../components/pagos/ListaPagos';
import FormularioPago from '../../components/pagos/FormularioPago';
import DetallePago from '../../components/pagos/DetallePago';
import CalculadoraPago from '../../components/pagos/CalculadoraPago';
import { obtenerTodosLosPagosPaginados } from '../../api/pagoApi';

const PagosPage: React.FC = () => {
  const [pagos, setPagos] = useState<any[]>([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<any>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    cargarPagos();
  }, [paginaActual]);

  const cargarPagos = async () => {
    try {
      const respuesta = await obtenerTodosLosPagosPaginados(paginaActual);
      setPagos(respuesta.content);
      setTotalPaginas(respuesta.totalPages);
    } catch (error) {
      console.error('Error al cargar los pagos:', error);
    }
  };

  const handleNuevoPago = () => {
    setPagoSeleccionado(null);
    setMostrarFormulario(true);
  };

  const handleEditarPago = (pago: any) => {
    setPagoSeleccionado(pago);
    setMostrarFormulario(true);
  };

  const handleVerDetalle = (pago: any) => {
    setPagoSeleccionado(pago);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Pagos</h1>
        <button
          onClick={handleNuevoPago}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nuevo Pago
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ListaPagos
            pagos={pagos}
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onPageChange={setPaginaActual}
            onEditar={handleEditarPago}
            onVerDetalle={handleVerDetalle}
          />
        </div>
        
        <div className="lg:col-span-1">
          <CalculadoraPago />
        </div>
      </div>

      {mostrarFormulario && (
        <FormularioPago
          pago={pagoSeleccionado}
          onClose={() => setMostrarFormulario(false)}
          onGuardar={() => {
            setMostrarFormulario(false);
            cargarPagos();
          }}
        />
      )}

      {pagoSeleccionado && !mostrarFormulario && (
        <DetallePago
          pago={pagoSeleccionado}
          onClose={() => setPagoSeleccionado(null)}
        />
      )}
    </div>
  );
};

export default PagosPage; 