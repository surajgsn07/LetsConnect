import React from "react";
import { FaSpinner } from "react-icons/fa"; // Importing spinner icon from react-icons

// Loader Component
const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <FaSpinner className="text-white text-6xl animate-spin" />
    </div>
  );
};

export default Loader;
