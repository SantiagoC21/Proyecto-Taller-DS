import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Info, X, Eye, EyeOff } from 'lucide-react';
import { getMockModels, getMockModelById } from '../../utils/mockData';
import { MDLModel, Variable } from '../../types';

interface YearlyData {
  year: number;
  [variableId: string]: number;
}

const VariableTables: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<MDLModel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedVariable, setSelectedVariable] = useState<Variable | null>(null);
  const [visibleVariables, setVisibleVariables] = useState<Record<string, boolean>>({});
  const [yearFilter, setYearFilter] = useState<{ min: number; max: number }>({ min: 0, max: 100 });

  const models = getMockModels();

  // Generate yearly data from simulation data
  const yearlyData = useMemo(() => {
    if (!selectedModel) return [];
    
    const data: YearlyData[] = [];
    const filteredSimData = selectedModel.simulationData.filter(
      item => item.time >= yearFilter.min && item.time <= yearFilter.max
    );

    filteredSimData.forEach(simData => {
      const yearData: YearlyData = { year: simData.time };
      selectedModel.variables.forEach(variable => {
        yearData[variable.id] = simData[variable.id] || 0;
      });
      data.push(yearData);
    });

    return data;
  }, [selectedModel, yearFilter]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return yearlyData;
    
    return yearlyData.filter(row => 
      row.year.toString().includes(searchTerm) ||
      Object.keys(row).some(key => {
        if (key === 'year') return false;
        const variable = selectedModel?.variables.find(v => v.id === key);
        return variable?.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [yearlyData, searchTerm, selectedModel]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleModelSelect = (modelId: string) => {
    const model = getMockModelById(modelId);
    setSelectedModel(model);
    setCurrentPage(1);
    setSearchTerm('');
    setSelectedVariable(null);
    
    // Initialize all variables as visible
    if (model) {
      const initialVisibility: Record<string, boolean> = {};
      model.variables.forEach(variable => {
        initialVisibility[variable.id] = true;
      });
      setVisibleVariables(initialVisibility);
    }
  };

  const handleVariableToggle = (variableId: string) => {
    setVisibleVariables(prev => ({
      ...prev,
      [variableId]: !prev[variableId]
    }));
  };

  const getVariableColor = (type: Variable['type']) => {
    switch (type) {
      case 'stock': return 'bg-blue-100 text-blue-800';
      case 'flow': return 'bg-green-100 text-green-800';
      case 'auxiliary': return 'bg-yellow-100 text-yellow-800';
      case 'constant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-purple-100 text-purple-800';
    }
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
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Tablas de Variables por Año</h2>
            <p className="text-gray-600">Selecciona un modelo para ver los datos anuales de sus variables</p>
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
                      {model.variables.length} variables • {model.simulationData.length} años de datos
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
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Tablas de Variables por Año</h2>
              <p className="text-gray-600">{selectedModel.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedModel(null)}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Cambiar modelo
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Table */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              {/* Controls */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Datos por Año
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por año o variable..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Mostrando {paginatedData.length} de {filteredData.length} años</span>
                  </div>
                </div>

                {/* Year Range Filter */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Rango de años:</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={yearFilter.min}
                      onChange={(e) => setYearFilter(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      max="100"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={yearFilter.max}
                      onChange={(e) => setYearFilter(prev => ({ ...prev, max: parseInt(e.target.value) || 100 }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                        Año
                      </th>
                      {selectedModel.variables
                        .filter(variable => visibleVariables[variable.id])
                        .map((variable) => (
                        <th 
                          key={variable.id}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => setSelectedVariable(variable)}
                        >
                          <div className="flex items-center space-x-1">
                            <span className="truncate max-w-24" title={variable.name}>
                              {variable.name}
                            </span>
                            <Info className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((row, index) => (
                      <tr key={row.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-inherit z-10">
                          {row.year}
                        </td>
                        {selectedModel.variables
                          .filter(variable => visibleVariables[variable.id])
                          .map((variable) => (
                          <td key={variable.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {row[variable.id]?.toLocaleString(undefined, { 
                              minimumFractionDigits: 0, 
                              maximumFractionDigits: 2 
                            })}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-sm text-gray-700">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Variable Filters */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Filtros de Variables</h3>
                <p className="text-sm text-gray-600 mt-1">Selecciona qué variables mostrar</p>
              </div>
              <div className="p-4 max-h-80 overflow-y-auto">
                <div className="space-y-3">
                  {selectedModel.variables.map((variable) => (
                    <label
                      key={variable.id}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={visibleVariables[variable.id] || false}
                        onChange={() => handleVariableToggle(variable.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {visibleVariables[variable.id] ? (
                            <Eye className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {variable.name}
                          </span>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getVariableColor(variable.type)}`}>
                          {variable.type}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Variable Detail Panel */}
            {selectedVariable && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Detalle de Variable</h3>
                  <button
                    onClick={() => setSelectedVariable(null)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{selectedVariable.name}</h4>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getVariableColor(selectedVariable.type)}`}>
                      {selectedVariable.type}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Valor inicial:</span>
                      <p className="text-sm text-gray-800 mt-1">
                        {selectedVariable.value.toLocaleString()}
                        {selectedVariable.unit && ` ${selectedVariable.unit}`}
                      </p>
                    </div>
                    
                    {selectedVariable.unit && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Unidad:</span>
                        <p className="text-sm text-gray-800 mt-1">{selectedVariable.unit}</p>
                      </div>
                    )}
                    
                    {selectedVariable.equation && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Ecuación:</span>
                        <p className="text-sm text-gray-800 mt-1 font-mono bg-gray-50 p-2 rounded">
                          {selectedVariable.equation}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Posición:</span>
                      <p className="text-sm text-gray-800 mt-1">
                        X: {selectedVariable.x}, Y: {selectedVariable.y}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariableTables;