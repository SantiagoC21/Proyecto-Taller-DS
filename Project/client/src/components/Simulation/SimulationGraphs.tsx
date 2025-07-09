import React, { useState, useMemo } from 'react';
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
import { Model, Variable, ChartData } from '../../types';
import { useSimulation } from '../../context/SimulationContext';

const SimulationGraphs: React.FC = () => {
  const { models, loading } = useSimulation();
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);

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

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

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
      <div className="p-6 overflow-y-auto h-full">
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
