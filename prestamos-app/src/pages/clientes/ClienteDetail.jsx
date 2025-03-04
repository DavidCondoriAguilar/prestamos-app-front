import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaInfoCircle, FaWallet, FaMoneyCheckAlt } from "react-icons/fa";
import useClientes from "../../hooks/useClientes";

const ClienteDetail = () => {
  const { id } = useParams();
  const { fetchClienteById } = useClientes();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    const fetchCliente = async () => {
      const data = await fetchClienteById(id);
      setCliente(data);
    };
    fetchCliente();
  }, [id, fetchClienteById]);

  if (!cliente) return <p className="text-center mt-6 text-lg">Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded shadow">
      {/* Datos generales del cliente */}
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <FaInfoCircle className="mr-2" /> Detalles del Cliente
      </h1>
      <div className="mb-4">
        <p className="mb-2">
          <span className="font-semibold">ID:</span> {cliente.id}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Nombre:</span> {cliente.nombre}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Correo:</span> {cliente.correo}
        </p>
      </div>

      {/* Información de la cuenta */}
      {cliente.cuenta && (
        <div className="mb-6 p-4 bg-gray-700 rounded">
          <h2 className="text-xl font-bold flex items-center mb-2">
            <FaWallet className="mr-2" /> Cuenta
          </h2>
          <p className="mb-1">
            <span className="font-semibold">Número de Cuenta:</span> {cliente.cuenta.numeroCuenta}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Saldo:</span> ${cliente.cuenta.saldo.toFixed(2)}
          </p>
        </div>
      )}

      {/* Información de los préstamos */}
      {cliente.prestamos && cliente.prestamos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center mb-2">
            <FaMoneyCheckAlt className="mr-2" /> Préstamos
          </h2>
          {cliente.prestamos.map((prestamo) => (
            <div key={prestamo.id} className="mb-4 p-4 bg-gray-700 rounded">
              <p className="mb-1">
                <span className="font-semibold">ID Préstamo:</span> {prestamo.id}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Monto:</span> ${prestamo.monto.toFixed(2)}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Interés:</span> {prestamo.interes}%
              </p>
              <p className="mb-1">
                <span className="font-semibold">Fecha Creación:</span> {prestamo.fechaCreacion}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Fecha Vencimiento:</span> {prestamo.fechaVencimiento}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Estado:</span> {prestamo.estado}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Deuda Restante:</span> ${prestamo.deudaRestante.toFixed(2)}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Interés Moratorio:</span> {prestamo.interesMoratorio}%
              </p>

              {/* Lista de pagos del préstamo */}
              {prestamo.pagos && prestamo.pagos.length > 0 && (
                <div className="mt-2 p-2 bg-gray-600 rounded">
                  <h3 className="font-semibold mb-1">Pagos:</h3>
                  <ul className="list-disc list-inside">
                    {prestamo.pagos.map((pago) => (
                      <li key={pago.id}>
                        <span className="font-semibold">ID:</span> {pago.id},{" "}
                        <span className="font-semibold">Monto:</span> ${pago.montoPago.toFixed(2)},{" "}
                        <span className="font-semibold">Fecha:</span> {pago.fecha}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClienteDetail;
