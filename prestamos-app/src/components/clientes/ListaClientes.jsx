import React from "react";
import ClienteItem from "../../pages/clientes/ClienteItem";

const ListaClientes = ({ clientes, onVerDetalles }) => {
  if (clientes.length === 0) {
    return (
      <p className="text-center text-lg text-gray-400">
        No hay clientes registrados.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {clientes.map((cliente) => (
        <ClienteItem
          key={cliente.id}
          cliente={cliente}
          onVerDetalles={onVerDetalles}
        />
      ))}
    </ul>
  );
};

export default ListaClientes;