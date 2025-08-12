import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Table, BarChart3, Database, TrendingUp, ArrowRight } from "lucide-react";

const BeforeAfterSelect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Saber si venimos de tablas o simulacion
  const fromType = location.state?.fromType || "variables";

  const handleSelect = (period: "antes" | "despues") => {
    if (fromType === "variables") {
      navigate(`/app/tabla-variables/${period}`);
    } else if (fromType === "simulacion") {
      navigate(`/app/simulacion/${period}`);
    }
  };

  const getPageConfig = () => {
    if (fromType === "variables") {
      return {
        title: "Tablas de Variables",
        subtitle: "Selecciona el tipo de datos que deseas visualizar en las tablas",
        icon: Table,
        iconColor: "text-yellow-600",
        iconBg: "bg-yellow-100",
        beforeOption: {
          title: "Datos Históricos",
          description: "Visualiza las tablas con datos reales históricos del sistema de transporte",
          icon: Database,
          color: "bg-blue-600 hover:bg-blue-700",
          borderColor: "border-blue-200 hover:border-blue-300"
        },
        afterOption: {
          title: "Datos de Simulación",
          description: "Explora las tablas con datos generados por la simulación del modelo",
          icon: TrendingUp,
          color: "bg-green-600 hover:bg-green-700",
          borderColor: "border-green-200 hover:border-green-300"
        }
      };
    } else {
      return {
        title: "Simulación y Gráficas",
        subtitle: "Selecciona el tipo de datos que deseas visualizar en las gráficas",
        icon: BarChart3,
        iconColor: "text-purple-600",
        iconBg: "bg-purple-100",
        beforeOption: {
          title: "Datos Históricos",
          description: "Genera gráficas con datos reales históricos del sistema de transporte",
          icon: Database,
          color: "bg-blue-600 hover:bg-blue-700",
          borderColor: "border-blue-200 hover:border-blue-300"
        },
        afterOption: {
          title: "Datos de Simulación",
          description: "Crea gráficas con datos generados por la simulación del modelo",
          icon: TrendingUp,
          color: "bg-green-600 hover:bg-green-700",
          borderColor: "border-green-200 hover:border-green-300"
        }
      };
    }
  };

  const config = getPageConfig();

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 flex justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex p-4 ${config.iconBg} rounded-2xl mb-6`}>
            <config.icon className={`h-12 w-12 ${config.iconColor}`} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {config.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Datos Históricos */}
          <div className={`group bg-white rounded-2xl shadow-xl border-2 ${config.beforeOption.borderColor} hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <config.beforeOption.icon className="h-8 w-8 text-blue-600" />
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {config.beforeOption.title}
              </h3>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                {config.beforeOption.description}
              </p>
              
              <button
                onClick={() => handleSelect("antes")}
                className={`w-full py-4 px-6 ${config.beforeOption.color} text-white font-semibold rounded-xl transition-all duration-200 transform group-hover:scale-105 shadow-lg`}
              >
                Seleccionar Datos Históricos
              </button>
            </div>
          </div>

          {/* Datos de Simulación */}
          <div className={`group bg-white rounded-2xl shadow-xl border-2 ${config.afterOption.borderColor} hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <config.afterOption.icon className="h-8 w-8 text-green-600" />
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {config.afterOption.title}
              </h3>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                {config.afterOption.description}
              </p>
              
              <button
                onClick={() => handleSelect("despues")}
                className={`w-full py-4 px-6 ${config.afterOption.color} text-white font-semibold rounded-xl transition-all duration-200 transform group-hover:scale-105 shadow-lg`}
              >
                Seleccionar Datos de Simulación
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Información sobre los datos</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>Datos Históricos:</strong> Información real recopilada del sistema de transporte terrestre. 
                <br />
                <strong>Datos de Simulación:</strong> Resultados generados por el modelo de dinámica de sistemas basado en los parámetros configurados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSelect;
