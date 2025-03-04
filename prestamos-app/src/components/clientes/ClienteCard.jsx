import { FaTrash, FaUser } from "react-icons/fa";

const ClienteCard = ({ cliente, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <FaUser className="text-4xl text-blue-500" />
      <h3 className="text-xl font-bold mt-2">{cliente.nombre}</h3>
      <p className="text-gray-600">ID: {cliente.id}</p>
      <p className="text-gray-600">Email: {cliente.email}</p>
      <button
        onClick={() => onDelete(cliente.id)}
        className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        <FaTrash /> Eliminar
      </button>
    </div>
  );
};

export default ClienteCard;
