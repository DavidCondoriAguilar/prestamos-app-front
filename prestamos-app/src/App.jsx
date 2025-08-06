import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import NavBar from "./layouts/NavBar";
import PagosPage from "./pages/pagos/PagosPage";
import Footer from "./layouts/Footer";
import ClienteForm from "./pages/clientes/ClienteForm";
import ClienteDetail from "./pages/clientes/ClienteDetail";
import ClienteList from "./pages/clientes/ClienteList";
import Dashboard from "./pages/dashboard/Dashboard";
import PrestamosPage from "./pages/prestamos/PrestamosPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {user ? (
        <>
          <NavBar />
          <div className="flex-1 flex flex-col min-h-screen ml-0 transition-all duration-300 lg:ml-64">
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clientes" element={<ClienteList />} />
                <Route path="/nuevo-cliente" element={<ClienteForm />} />
                <Route path="/cliente-info/:id" element={<ClienteDetail />} />
                <Route path="/editar-cliente/:id" element={<ClienteForm />} />
                <Route path="/prestamos" element={<PrestamosPage />} />
                <Route path="/pagos" element={<PagosPage />} />
                <Route path="/pagos/:prestamoId" element={<PagosPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;