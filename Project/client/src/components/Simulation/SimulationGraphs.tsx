import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileText } from 'lucide-react';
import { saveAs } from 'file-saver';
import { getMockModels, getMockModelById } from '../../utils/mockData';
import { MDLModel, Variable, ChartData } from '../../types';

const SimulationGraphs: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<MDLModel | null>(null);
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [showChart, setShowChart] = useState(false);

  const models = getMockModels();

  const chartData = useMemo(() => {
    if (!selectedModel || selectedVariables.length === 0) return [];

    return selectedModel.simulationData.map(data => {
      const chartPoint: ChartData = { time: data.time };
      selectedVariables.forEach(varId => {
        const variable = selectedModel.variables.find(v => v.id === varId);
        if (variable) {
          chartPoint[variable.name] = data[varId];
        }
      });
      return chartPoint;
    });
  }, [selectedModel, selectedVariables]);

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const handleModelSelect = (modelId: string) => {
    const model = getMockModelById(modelId);
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

  const handleDownloadPNG = () => {
    // In a real implementation, you would use a library like html2canvas
    // For this demo, we'll show a simple alert
    alert('PNG download functionality would be implemented here');
  };

  const handleDownloadCSV = () => {
    if (!selectedModel || selectedVariables.length === 0) return;

    const csvHeaders = ['Time', ...selectedVariables.map(varId => {
      const variable = selectedModel.variables.find(v => v.id === varId);
      return variable?.name || varId;
    })];

    const csvData = selectedModel.simulationData.map(data => [
      data.time,
      ...selectedVariables.map(varId => data[varId])
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
          <div className="mb-6">
            <button
              onClick={() => window.location.href = '/app'}
              className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer mb-2 block"
            >
              Sistema de Dinámica de Sistemas
            </button>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Simulación y Gráficas</h2>
            <p className="text-gray-600">Selecciona un modelo para comenzar la simulación</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Paso 1: Seleccionar Modelo
              </h2>
              <div className="grid gap-4">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelSelect(model.id)}
                    className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-800">{model.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{model.filename}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {model.variables.length} variables disponibles
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showChart) {
    return (
      <div className="p-6 overflow-y-auto h-full">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => window.location.href = '/app'}
                  className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer mb-2 block"
                >
                  Sistema de Dinámica de Sistemas
                </button>
                <h2 className="text-xl font-semibold text-gray-600 mb-2">Simulación y Gráficas</h2>
                <p className="text-gray-600">{selectedModel.name}</p>
              </div>
              <button
                onClick={() => setSelectedModel(null)}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Cambiar modelo
              </button>
              <button
                onClick={() => window.location.href = '/app'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Menú Principal
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Paso 2: Seleccionar Variables
              </h2>
              <p className="text-gray-600 mb-4">
                Elige una o más variables para incluir en la gráfica
              </p>

              <div className="grid gap-3 mb-6">
                {selectedModel.variables.map((variable) => (
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
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">{variable.name}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          variable.type === 'stock' ? 'bg-blue-100 text-blue-800' :
                          variable.type === 'flow' ? 'bg-green-100 text-green-800' :
                          variable.type === 'auxiliary' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {variable.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Valor inicial: {variable.value.toLocaleString()}
                        {variable.unit && ` ${variable.unit}`}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {selectedVariables.length} variable(s) seleccionada(s)
                </p>
                <button
                  onClick={handleGenerateChart}
                  disabled={selectedVariables.length === 0}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedVariables.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Generar Gráfica
                </button>
              </div>
            </div>
          </div>
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
                onClick={() => window.location.href = '/app'}
                className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer mb-2 block"
              >
                Sistema de Dinámica de Sistemas
              </button>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Simulación y Gráficas</h2>
              <p className="text-gray-600">{selectedModel.name}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowChart(false)}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Modificar variables
              </button>
              <button
                onClick={() => setSelectedModel(null)}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Cambiar modelo
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Paso 3: Gráfica Interactiva
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleDownloadPNG}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>PNG</span>
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Tiempo', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    label={{ value: 'Valor', angle: -90, position: 'insideLeft' }}
                  />
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

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Variables seleccionadas:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedVariables.map((varId, index) => {
                  const variable = selectedModel.variables.find(v => v.id === varId);
                  return (
                    <div
                      key={varId}
                      className="flex items-center space-x-2 px-3 py-1 bg-white rounded-full border border-gray-200"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {variable?.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationGraphs;