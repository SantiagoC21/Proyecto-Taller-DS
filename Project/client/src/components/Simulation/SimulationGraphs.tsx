import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileText } from 'lucide-react';
import { saveAs } from 'file-saver';
import { Model, Variable, ChartData } from '../../types';

const SimulationGraphs: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/data')
      .then(res => res.json())
      .then(data => {
        const modelsArray: Model[] = Object.entries(data).map(([id, content]: [string, any]) => {
          const modelName = Object.keys(content)[0];
          const variableData = content[modelName];

          const simulationData = Object.entries(variableData.data).map(([time, value]) => ({
            time: Number(time),
            [modelName]: Number(value)
          }));

          return {
            id,
            name: modelName,
            filename: id,
            variables: variableData.variables,
            connections: [],
            simulationData
          };
        });

        setModels(modelsArray);
      })
      .catch(err => {
        console.error("Error al obtener los modelos:", err);
        setModels([]);
      });
  }, []);

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
    setShowChart(false);
  };

  const handleVariableToggle = (variableId: string) => {
    setSelectedVariables(prev => 
      prev.includes(variableId) 
        ? prev.filter(id => id !== variableId)
        : [...prev, variableId]
    );
  };

  const handleGenerateChart = () => {
    if (selectedVariables.length > 0) {
      setShowChart(true);
    }
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
          {models.length === 0 && (
            <p className="text-gray-500 text-sm">No hay modelos disponibles.</p>
          )}
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
        </div>
      </div>
    );
  }

  if (!showChart) {
    return (
      <div className="p-6 overflow-y-auto h-full">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Selecciona Variables</h2>
          <div className="grid gap-3 mb-6">
            {selectedModel.variables.map(variable => (
              <label
                key={variable.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
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
          <button
            onClick={handleGenerateChart}
            disabled={selectedVariables.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Generar Gráfica
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Gráfica de Simulación</h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FileText className="w-4 h-4" /> CSV
            </button>
            <button
              onClick={() => setShowChart(false)}
              className="px-4 py-2 text-blue-600 underline"
            >
              Modificar variables
            </button>
            <button
              onClick={() => setSelectedModel(null)}
              className="px-4 py-2 text-gray-600 underline"
            >
              Cambiar modelo
            </button>
          </div>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
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
      </div>
    </div>
  );
};

export default SimulationGraphs;
