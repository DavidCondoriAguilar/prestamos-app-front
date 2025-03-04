import React from "react";

const PaymentList = ({ payments, onRefresh }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment List</h2>
      <ul className="space-y-2">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <li key={payment.id} className="flex justify-between p-2 border rounded">
              <div>
                <p>Amount: ${payment.montoPago}</p>
                <p>Date: {payment.fecha}</p>
              </div>
            </li>
          ))
        ) : (
          <p>No payments found.</p>
        )}
      </ul>
      <button
        onClick={onRefresh}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
      >
        Refresh List
      </button>
    </div>
  );
};

export default PaymentList;