import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaHandHoldingUsd, FaMoneyBillWave, FaChartLine, FaBars } from "react-icons/fa";

const NavBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/", icon: <FaHome className="text-xl" />, label: "Inicio" },
    { to: "/clientes", icon: <FaUsers className="text-xl" />, label: "Clientes" },
    { to: "/prestamos", icon: <FaHandHoldingUsd className="text-xl" />, label: "Préstamos" },
    { to: "/pagos", icon: <FaMoneyBillWave className="text-xl" />, label: "Pagos" },
    { to: "/dashboard", icon: <FaChartLine className="text-xl" />, label: "Estadísticas" },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 bg-gray-900 text-white transition-all duration-300 z-50 ${isCollapsed ? 'w-16 md:w-20' : 'w-64'}`}>
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
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  location.pathname === item.to
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapsed indicator */}
      {isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-gray-500 text-xs">
          <div className="w-full border-t border-gray-800 pt-3">
            <div className="w-8 h-1 bg-gray-700 rounded-full mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
