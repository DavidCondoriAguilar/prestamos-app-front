import React from "react";

const RemainingAmountDisplay = ({ remainingAmount }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-semibold">Remaining Amount:</span>
      <span className="text-lg font-bold text-green-600">
        {remainingAmount !== null ? `$${remainingAmount}` : "N/A"}
      </span>
    </div>
  );
};

export default RemainingAmountDisplay;