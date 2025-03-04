import React, { useState, useEffect } from "react";
import {
  obtenerPagosPorPrestamo,
  registrarPago,
  calcularMontoRestante,
} from "../../api/pagoApi";
import { toast } from "react-toastify";
import RemainingAmountDisplay from "../../components/pagos/RemainingAmountDisplay";
import RefreshListButton from "../../components/pagos/RefreshListButton";
import PaymentList from "../../components/pagos/PaymentList";
import PaymentFormModal from "../../components/pagos/PaymentFormModal";

const PagosPage = () => {
  const [payments, setPayments] = useState([]); // Lista de pagos
  const [remainingAmount, setRemainingAmount] = useState(null); // Monto restante del préstamo
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [loanId, setLoanId] = useState(1); // ID del préstamo seleccionado

  // Cargar pagos al montar el componente
  useEffect(() => {
    fetchPayments();
  }, []);

  // Función para cargar los pagos de un préstamo específico
  const fetchPayments = async () => {
    try {
      const data = await obtenerPagosPorPrestamo(loanId);
      console.log("Datos recibidos del backend:", data); // Agrega este log
      setPayments(data || []);
    } catch (error) {
      toast.error("Error loading loan payments.");
    }
  };

  // Función para calcular el monto restante de un préstamo
  const handleCalculateRemainingAmount = async () => {
    try {
      const amount = await calcularMontoRestante(loanId);
      setRemainingAmount(amount);
      toast.success("Remaining amount calculated successfully.");
    } catch (error) {
      toast.error("Error calculating remaining amount.");
    }
  };

  // Función para registrar un nuevo pago
  const handleRegisterPayment = async (payment) => {
    try {
      await registrarPago(loanId, payment);
      toast.success("Payment registered successfully.");
      fetchPayments(); // Actualizar la lista de pagos
      setIsModalOpen(false); // Cerrar el modal
    } catch (error) {
      toast.error("Error registering payment.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payment Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Register New Payment
        </button>
      </div>

      {/* Action Section */}
      <div className="flex justify-between items-center mb-4">
        {/* Display Remaining Amount */}
        <RemainingAmountDisplay remainingAmount={remainingAmount} />

        {/* Button to Calculate Remaining Amount */}
        <button
          onClick={handleCalculateRemainingAmount}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Calculate Remaining Amount
        </button>

        {/* Button to Refresh List */}
        <RefreshListButton onRefresh={fetchPayments} />
      </div>

      {/* Payment List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <PaymentList payments={payments} onRefresh={fetchPayments} />
      </div>

      {/* Modal for Registering Payments */}
      <PaymentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPaymentRegistered={handleRegisterPayment}
      />
    </div>
  );
};

export default PagosPage;