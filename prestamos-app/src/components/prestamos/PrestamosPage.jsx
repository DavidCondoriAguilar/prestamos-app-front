import React, { useEffect, useState } from "react";
import {
  obtenerTodosLosPrestamos,
  eliminarPrestamo,
  obtenerPrestamosPorCliente,
} from "../../api/prestamoApi";
import LoanList from "../components/LoanList";
import CreateLoanForm from "../components/CreateLoanForm";
import FilterLoansByClient from "../components/FilterLoansByClient";

const PrestamosPage = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null); // Para editar un préstamo específico

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    const data = await obtenerTodosLosPrestamos();
    setLoans(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this loan?")) {
      await eliminarPrestamo(id);
      fetchLoans();
    }
  };

  const handleFilterByClient = async (clientId) => {
    if (!clientId || clientId <= 0) {
      alert("Invalid client ID.");
      return;
    }

    const filteredLoans = await obtenerPrestamosPorCliente(clientId);
    setLoans(filteredLoans);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Loan Management System</h1>

      {/* Loan List */}
      <LoanList loans={loans} onDelete={handleDelete} onSelect={setSelectedLoan} />

      {/* Create Loan Form */}
      <CreateLoanForm onCreated={fetchLoans} />

      {/* Update Loan Form */}
      <UpdateLoanForm loan={selectedLoan} onUpdate={fetchLoans} onCancel={() => setSelectedLoan(null)} />

      {/* Search Loan by ID */}
      <SearchLoanById onSearch={(loan) => setLoans([loan])} />

      {/* Filter Loans by Client */}
      <FilterLoansByClient onFilter={handleFilterByClient} />
    </div>
  );
};

export default PrestamosPage;