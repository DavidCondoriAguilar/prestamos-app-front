import React from "react";

const ListaPagos = ({ pagos, onRefresh }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Lista de Pagos</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Monto</th>
            <th className="px-4 py-2 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {pagos.length > 0 ? (
            pagos.map((pago) => (
              <tr key={pago.id} className="border-b">
                <td className="px-4 py-2">{pago.id}</td>
                  <td className="px-4 py-2">${pago.montoPago.toFixed(2)}</td>
                  <td className="px-4 py-2">{pago.fecha}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No hay pagos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaPagos;