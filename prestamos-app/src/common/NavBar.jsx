import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaHandHoldingUsd, FaMoneyBillWave, FaChartLine, FaBars, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/dashboard", icon: <FaHome className="text-xl" />, label: "Inicio" },
    { to: "/clientes", icon: <FaUsers className="text-xl" />, label: "Clientes" },
    { to: "/prestamos", icon: <FaHandHoldingUsd className="text-xl" />, label: "Préstamos" },
    { to: "/pagos", icon: <FaMoneyBillWave className="text-xl" />, label: "Pagos" },
    { to: "/estadisticas", icon: <FaChartLine className="text-xl" />, label: "Estadísticas" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`fixed inset-y-0 left-0 bg-gray-900 text-white transition-all duration-300 z-50 flex flex-col ${isCollapsed ? 'w-16 md:w-20' : 'w-64'}`}>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!isCollapsed && <h1 className="text-xl font-bold whitespace-nowrap">PrestamosExpress</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-all duration-300 relative overflow-hidden group"
          aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {/* Efecto de brillo sutil al hacer hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
          <FaBars className="text-xl relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <FaUser className="text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user.name || 'Usuario'}</p>
              <p className="text-xs text-gray-400 truncate">{user.username}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-2 flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center p-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                  location.pathname === item.to
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {/* Efecto de brillo sutil al hacer hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                <span className="flex-shrink-0 relative z-10 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                {!isCollapsed && <span className="ml-3 whitespace-nowrap relative z-10 group-hover:font-medium transition-all duration-300">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 relative overflow-hidden group ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {/* Efecto de brillo sutil al hacer hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
          <FaSignOutAlt className="text-xl relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
          {!isCollapsed && <span className="ml-3 relative z-10 group-hover:font-medium transition-all duration-300">Cerrar Sesión</span>}
        </button>
      </div>

      {/* Collapsed indicator */}
      {isCollapsed && (
        <div className="p-4 text-center text-gray-500 text-xs">
          <div className="w-full border-t border-gray-800 pt-3">
            <div className="w-8 h-1 bg-gray-700 rounded-full mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
