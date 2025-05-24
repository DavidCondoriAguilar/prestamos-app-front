import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./common/NavBar";
import Home from "./common/Home";
import PagosPage from "./pages/pagos/PagosPage";
import Footer from "./common/Footer";
import ClienteForm from "./pages/clientes/ClienteForm";
import ClienteDetail from "./pages/clientes/ClienteDetail";
import ClienteList from "./pages/clientes/ClienteList";
import Dashboard from "./pages/dashboard/Dashboard";
import PrestamosPage from "./pages/prestamos/PrestamosPage";
import { ToastContainer } from "react-toastify"; // Importa ToastContainer
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 text-white min-h-screen flex">
        <NavBar />
        <div className="flex-1 flex flex-col min-h-screen ml-0 transition-all duration-300 lg:ml-64">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<ClienteList />} />
            <Route path="/nuevo-cliente" element={<ClienteForm />} />
            <Route path="/cliente-info/:id" element={<ClienteDetail />} />
            <Route path="/editar-cliente/:id" element={<ClienteForm />} />

            <Route path="/prestamos" element={<PrestamosPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pagos" element={<PagosPage />} />
            <Route path="/pagos/:prestamoId" element={<PagosPage />} />

          </Routes>
        </main>
        <Footer />
        </div>
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
    </BrowserRouter>
  );
}

export default App;
