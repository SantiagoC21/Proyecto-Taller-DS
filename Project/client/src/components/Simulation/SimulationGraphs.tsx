import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Download, FileText, TrendingUp, Settings } from 'lucide-react';
import { saveAs } from 'file-saver';
import { useParams } from 'react-router-dom';
import { getMockModels } from '../../utils/mockData'; // Debes tener esta función
import { fetchBackendData } from '../../utils/fetchBackendData';
import { Model, Variable, ChartData } from '../../types';
import { useSimulation } from '../../context/SimulationContext';

const BACKEND_URL = "http://localhost:5000/data"; // Modifica si es necesario

const SimulationGraphs: React.FC = () => {
  const { period } = useParams<{ period: string }>();
  // Si tienes un context que quieres seguir usando para el backend, usa como fallback solo para "despues"
  const context = useSimulation();

  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);

  // Carga de modelos según el periodo
  useEffect(() => {
    setLoading(true);
    if (period === "antes") {
      // Mock
      setModels(getMockModels());
      setLoading(false);
    } else {
      // Backend (puedes seguir usando context si lo prefieres)
      fetchBackendData(BACKEND_URL)
        .then((data) => {
          // Adaptar la estructura a la de Model[]
          const mdlModels: Model[] = Object.entries(data).map(([sectionKey, sectionObj]: any) => {
            const variables: Variable[] = Object.entries(sectionObj).map(([varKey, varData]: any) => ({
              id: varKey,
              name: varData.title || varKey,
              type: varData.type || 'auxiliary',
              value: 0,
              unit: varData.unit || '',
              equation: varData.equation || '',
              x: varData.x || 0,
              y: varData.y || 0,
            }));

            // Saca todos los años posibles de todas las variables
            const allYearsSet = new Set<number>();
            Object.values(sectionObj).forEach((varData: any) => {
              Object.keys(varData.data || {}).forEach((yearStr) => {
                allYearsSet.add(Number(yearStr));
              });
            });
            const allYears = Array.from(allYearsSet).sort((a, b) => a - b);

            const simulationData = allYears.map(year => {
              const row: ChartData = { time: year };
              Object.entries(sectionObj).forEach(([varKey, varData]: any) => {
                row[varData.title || varKey] = varData.data?.[year] ?? null;
              });
              return row;
            });

            return {
              id: sectionKey,
              name: sectionKey.replace(/_/g, " "),
              filename: sectionKey,
              variables,
              simulationData
            };
          });

          setModels(mdlModels);
          setLoading(false);
        })
        .catch(() => {
          setModels([]);
          setLoading(false);
        });
    }
  }, [period]);

  const chartData = useMemo(() => {
    if (!selectedModel || selectedVariables.length === 0) return [];

    return selectedModel.simulationData.map(data => {
      const chartPoint: ChartData = { time: data.time };
      selectedVariables.forEach(varId => {
        const variable = selectedModel.variables.find(v => v.id === varId);
        if (variable && data[variable.name] !== undefined) {
          chartPoint[variable.name] = data[variable.name] as number;
        }
      });
      return chartPoint;
    });
  }, [selectedModel, selectedVariables]);

  const colors = [
  "#FF5733", // Rojo vibrante
  "#33FF57", // Verde lima
  "#3357FF", // Azul fuerte
  "#F7B731", // Amarillo intenso
  "#9B59B6", // Morado
  "#1ABC9C", // Turquesa
  "#E74C3C", // Rojo
  "#2ECC71", // Verde
  "#3498DB", // Azul celeste
  "#F39C12", // Naranja fuerte
  "#8E44AD", // Violeta oscuro
  "#16A085", // Verde-azulado
  "#2980B9", // Azul clásico
  "#D35400", // Naranja oscuro
  "#C0392B", // Rojo oscuro
  "#27AE60", // Verde bosque
  "#E67E22", // Naranja
  "#34495E", // Azul acero
  "#E84393", // Rosa fucsia
  "#00B894"  // Verde esmeralda
];

  const handleModelSelect = (modelId: string) => {
    const model = models.find(m => m.id === modelId) || null;
    setSelectedModel(model);
    setSelectedVariables([]);
  };

  const handleVariableToggle = (variableId: string) => {
    setSelectedVariables(prev =>
      prev.includes(variableId)
        ? prev.filter(id => id !== variableId)
        : [...prev, variableId]
    );
  };

  const handleDownloadCSV = () => {
    if (!selectedModel || selectedVariables.length === 0) return;

    const csvHeaders = ['Time', ...selectedVariables.map(varId => {
      const variable = selectedModel.variables.find(v => v.id === varId);
      return variable?.name || varId;
    })];

    const csvData = selectedModel.simulationData.map(data => [
      data.time,
      ...selectedVariables.map(varId => {
        const variable = selectedModel.variables.find(v => v.id === varId);
        return variable ? data[variable.name] : '';
      })
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${selectedModel.name}_simulation_data.csv`);
  };

  if (!selectedModel) {
    return (
      <div className="p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Selecciona un Modelo</h2>
          {loading ? (
            <p className="text-gray-500 text-sm">Cargando modelos...</p>
          ) : models.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay modelos disponibles.</p>
          ) : (
            <div className="grid gap-4">
              {models.map(model => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-blue-50"
                >
                  <h3 className="font-semibold text-gray-800">{model.name}</h3>
                  <p className="text-sm text-gray-600">{model.filename}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => setSelectedModel(null)}
                className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer mb-2 block"
              >
                Cambiar Modelo
              </button>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Simulación y Gráficas</h2>
              <p className="text-gray-600">{selectedModel.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              {selectedVariables.length > 0 && (
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>CSV</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Variables</h3>
                    <p className="text-sm text-gray-600">Selecciona para graficar</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-[calc(100vh-10rem)] overflow-y-auto">
                {selectedModel.variables.map(variable => (
                  <label
                    key={variable.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${
                      selectedVariables.includes(variable.id)
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVariables.includes(variable.id)}
                      onChange={() => handleVariableToggle(variable.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-800 font-medium">{variable.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6">
                {selectedVariables.length === 0 ? (
                  <div className="h-96 flex items-center justify-center text-gray-400">
                    Selecciona una o más variables del panel izquierdo para ver la gráfica
                  </div>
                ) : (
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="time" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Legend />
                        {selectedVariables.map((varId, index) => {
                          const variable = selectedModel.variables.find(v => v.id === varId);
                          return (
                            <Line
                              key={varId}
                              type="monotone"
                              dataKey={variable?.name}
                              stroke={colors[index % colors.length]}
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4 }}
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationGraphs;
