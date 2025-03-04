import React, { useState } from "react"; // Importa useState aquí

const FormularioCrearPrestamo = ({ onSubmit, onClose }) => {
  const [monto, setMonto] = useState("");
  const [interes, setInteres] = useState("");
  const [interesMoratorio, setInteresMoratorio] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [estado, setEstado] = useState("PENDIENTE"); // Estado predeterminado
  const [clienteId, setClienteId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos
    if (!monto || parseFloat(monto) <= 0) {
      alert("El monto debe ser mayor que cero");
      return;
    }
    if (!interes || parseFloat(interes) <= 0) {
      alert("El interés debe ser mayor que cero");
      return;
    }
    if (!interesMoratorio || parseFloat(interesMoratorio) < 0) {
      alert("El interés moratorio no puede ser negativo");
      return;
    }
    if (!fechaVencimiento) {
      alert("La fecha de vencimiento es obligatoria");
      return;
    }
    if (!clienteId || parseInt(clienteId) <= 0) {
      alert("El ID del cliente es obligatorio");
      return;
    }

    // Preparar datos para enviar al backend
    const nuevoPrestamo = {
      monto: parseFloat(monto),
      interes: parseFloat(interes),
      interesMoratorio: parseFloat(interesMoratorio),
      fechaVencimiento,
      estado,
      clienteId: parseInt(clienteId),
    };

    console.log("Datos enviados al backend:", nuevoPrestamo);

    // Llamar a la función onSubmit pasada como prop
    onSubmit(nuevoPrestamo);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Campo Monto */}
      <div>
        <label htmlFor="monto" className="block text-sm font-medium text-gray-700">
          Monto
        </label>
        <input
          type="number"
          id="monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Ingrese el monto"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Campo Interés */}
      <div>
        <label htmlFor="interes" className="block text-sm font-medium text-gray-700">
          Interés (%)
        </label>
        <input
          type="number"
          id="interes"
          value={interes}
          onChange={(e) => setInteres(e.target.value)}
          placeholder="Ingrese el interés"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Campo Interés Moratorio */}
      <div>
        <label htmlFor="interesMoratorio" className="block text-sm font-medium text-gray-700">
          Interés Moratorio (%)
        </label>
        <input
          type="number"
          id="interesMoratorio"
          value={interesMoratorio}
          onChange={(e) => setInteresMoratorio(e.target.value)}
          placeholder="Ingrese el interés moratorio"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Campo Fecha de Vencimiento */}
      <div>
        <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700">
          Fecha de Vencimiento
        </label>
        <input
          type="date"
          id="fechaVencimiento"
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Campo Estado */}
      <div>
        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          id="estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="APROBADO">APROBADO</option>
          <option value="PAGADO">PAGADO</option>
        </select>
      </div>

      {/* Campo ID del Cliente */}
      <div>
        <label htmlFor="clienteId" className="block text-sm font-medium text-gray-700">
          ID del Cliente
        </label>
        <input
          type="number"
          id="clienteId"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          placeholder="Ingrese el ID del cliente"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-2">
        {/* Botón Cancelar */}
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
          onClick={onClose}
        >
          Cancelar
        </button>
        {/* Botón Crear */}
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Crear
        </button>
      </div>
    </form>
  );
};

export default FormularioCrearPrestamo;