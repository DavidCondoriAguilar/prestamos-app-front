import React from "react";

const RefreshListButton = ({ onRefresh }) => {
  return (
    <button
      onClick={onRefresh}
      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition duration-300"
    >
      Refresh List
    </button>
  );
};

export default RefreshListButton;