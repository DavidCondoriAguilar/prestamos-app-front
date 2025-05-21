import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          PrestamosExpress 💰
        </h1>
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
          <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/clientes" className="hover:text-blue-400 transition">
                Clientes
              </Link>
            </li>
            <li>
              <Link to="/prestamos" className="hover:text-blue-400 transition">
                Préstamos
              </Link>
            </li>
            <li>
              <Link to="/pagos" className="hover:text-blue-400 transition">
                Pagos
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-blue-400 transition">
                Estadísticas
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Menú Mobile */}

      {open && (
        <nav className="md:hidden mt-4">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link
                to="/"
                className="block hover:text-blue-400 transition"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/clientes"
                className="block hover:text-blue-400 transition"
                onClick={() => setOpen(false)}
              >
                Clientes
              </Link>
            </li>
            <li>
              <Link
                to="/prestamos"
                className="block hover:text-blue-400 transition"
                onClick={() => setOpen(false)}
              >
                Préstamos
              </Link>
            </li>
            <li>
              <Link
                to="/pagos"
                className="block hover:text-blue-400 transition"
                onClick={() => setOpen(false)}
              >
                Pagos
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default NavBar;
