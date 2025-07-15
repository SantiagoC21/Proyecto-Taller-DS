import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BeforeAfterSelect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Saber si venimos de tablas o simulacion
  const fromType = location.state?.fromType || "variables";

  const handleSelect = (period: "antes" | "despues") => {
    if (fromType === "variables") {
      navigate(`/tabla-variables/${period}`);
    } else if (fromType === "simulacion") {
      navigate(`/simulacion/${period}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-semibold mb-4">¿Qué datos quieres ver?</h2>
      <div className="flex gap-6">
        <button
          onClick={() => handleSelect("antes")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Datos del Antes
        </button>
        <button
          onClick={() => handleSelect("despues")}
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Datos del Después
        </button>
      </div>
    </div>
  );
};

export default BeforeAfterSelect;
