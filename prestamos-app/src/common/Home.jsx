import React from "react";
import { FaUsers, FaHandHoldingUsd, FaShieldAlt, FaArrowDown } from "react-icons/fa";
import SimuladorPrestamos from "../components/prestamos/SimuladorPrestamos";

const Home = () => {
  const handleScrollToSimulador = () => {
    document.getElementById("simulador").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="flex flex-col items-center text-center py-20 px-8 bg-gradient-to-r from-blue-900 to-blue-600 text-white relative">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
        La forma más rápida y segura de gestionar tus préstamos
      </h2>
      <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
        Regístrate ahora y obtén acceso a un sistema moderno para gestionar clientes, cuentas, préstamos y pagos de manera eficiente.
      </p>

      {/* Beneficios */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <div className="flex flex-col items-center">
          <FaUsers className="text-5xl text-yellow-400 mb-3" />
          <h3 className="text-xl font-semibold">Gestión de Clientes</h3>
          <p className="text-gray-300 text-sm mt-2">
            Administra de manera sencilla la información de tus clientes en una plataforma intuitiva.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <FaHandHoldingUsd className="text-5xl text-yellow-400 mb-3" />
          <h3 className="text-xl font-semibold">Control de Préstamos</h3>
          <p className="text-gray-300 text-sm mt-2">
            Lleva un registro preciso de cada préstamo, sus fechas de pago y estados financieros.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <FaShieldAlt className="text-5xl text-yellow-400 mb-3" />
          <h3 className="text-xl font-semibold">Seguridad y Confianza</h3>
          <p className="text-gray-300 text-sm mt-2">
            Protegemos tu información con la mejor tecnología para garantizar seguridad en cada transacción.
          </p>
        </div>
      </div>

      {/* Simulador de Préstamos */}
      <div id="simulador" className="mt-12 w-full max-w-2xl mx-auto">
        <SimuladorPrestamos />
      </div>

      {/* Botón de Registro */}
      <button className="mt-10 px-8 py-3 bg-yellow-400 text-black text-lg font-semibold rounded-xl hover:bg-yellow-500 transition-all shadow-md">
        ¡Regístrate Gratis!
      </button>

      {/* Ícono flotante para desplazarse al simulador */}
      <button
        onClick={handleScrollToSimulador}
        className="fixed bottom-10 right-10 bg-yellow-400 text-black p-4 rounded-full shadow-lg hover:bg-yellow-500 transition-all animate-bounce"
      >
        <FaArrowDown className="text-2xl" />
      </button>
    </section>
  );
};

export default Home;
