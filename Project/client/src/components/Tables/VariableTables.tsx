import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Info, X, Eye, EyeOff } from 'lucide-react';
import { fetchBackendData } from '../../utils/fetchBackendData';
import { getMockModels } from '../../utils/mockData'; // Asegúrate de tener esta función

interface Variable {
  id: string;
  name: string;
  type: string;
  value: number;
  unit?: string;
  equation?: string;
  x?: number;
  y?: number;
}

interface SimulationData {
  time: number;
  [variableId: string]: number | null;
}

interface MDLModel {
  id: string;
  name: string;
  filename: string;
  variables: Variable[];
  simulationData: SimulationData[];
}

const BACKEND_URL = "http://localhost:5000/data"; // Cambia puerto o endpoint si es necesario

const VariableTables: React.FC = () => {
  const { period } = useParams<{ period: string }>();
  const [models, setModels] = useState<MDLModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<MDLModel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedVariable, setSelectedVariable] = useState<Variable | null>(null);
  const [visibleVariables, setVisibleVariables] = useState<Record<string, boolean>>({});
  const [yearFilter, setYearFilter] = useState<{ min: number; max: number }>({ min: 0, max: 3000 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    if (period === "antes") {
      // Usa datos de mock
      const mdlModels: MDLModel[] = getMockModels();
      setModels(mdlModels);
      setLoading(false);
    } else {
      // Usa datos del backend
      fetchBackendData(BACKEND_URL)
        .then((data) => {
          // Adapta la data para que cada modelo tenga variables y simulationData
          const mdlModels: MDLModel[] = Object.entries(data).map(([sectionKey, sectionObj]: any) => {
            const variables: Variable[] = Object.entries(sectionObj).map(([varKey, varData]: any) => ({
              id: varKey,
              name: varData.title || varKey,
              type: varData.type || 'Dato Simulado',
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

            const simulationData: SimulationData[] = allYears.map(year => {
              const row: SimulationData = { time: year };
              Object.entries(sectionObj).forEach(([varKey, varData]: any) => {
                row[varKey] = varData.data?.[year] ?? null;
              });
              return row;
            });

            return {
              id: sectionKey,
              name: sectionKey.replace(/_/g, " "),
              filename: "Base de Datos de la Simulacion",
              variables,
              simulationData
            };
          });

          setModels(mdlModels);
          setLoading(false);
        })
        .catch((err) => {
          alert("Error cargando datos del backend: " + err.message);
          setLoading(false);
        });
    }
  }, [period]);

  const handleModelSelect = (modelId: string) => {
    const model = models.find(m => m.id === modelId) || null;
    setSelectedModel(model);
    setCurrentPage(1);
    setSearchTerm('');
    setSelectedVariable(null);

    if (model) {
      const initialVisibility: Record<string, boolean> = {};
      model.variables.forEach(variable => {
        initialVisibility[variable.id] = true;
      });
      setVisibleVariables(initialVisibility);
      const years = model.simulationData.map(row => row.time);
      setYearFilter({ min: Math.min(...years), max: Math.max(...years) });
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
      case 'Dato Simulado': return 'bg-blue-100 text-blue-800';
      case 'Dato Historico': return 'bg-purple-100 text-purple-800';
      case 'auxiliary': return 'bg-yellow-100 text-yellow-800';
      case 'constant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const yearlyData = useMemo(() => {
    if (!selectedModel) return [];
    const filteredSimData = selectedModel.simulationData.filter(
      item => item.time >= yearFilter.min && item.time <= yearFilter.max
    );
    return filteredSimData;
  }, [selectedModel, yearFilter]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return yearlyData;
    return yearlyData.filter(row =>
      row.time.toString().includes(searchTerm) ||
      Object.keys(row).some(key => {
        if (key === 'time') return false;
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

  if (loading) {
    return <div className="p-8">Cargando datos...</div>;
  }

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
                {models.length === 0 && (
                  <p className="text-sm text-red-500">No hay modelos disponibles.</p>
                )}
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
                onClick={() => setSelectedModel(null)}
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
                      max="3000"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={yearFilter.max}
                      onChange={(e) => setYearFilter(prev => ({ ...prev, max: parseInt(e.target.value) || 3000 }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      max="3000"
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
                    {paginatedData.length > 0 ? paginatedData.map((row, index) => (
                      <tr key={row.time} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-inherit z-10">
                          {row.time}
                        </td>
                        {selectedModel.variables
                          .filter(variable => visibleVariables[variable.id])
                          .map((variable) => (
                          <td key={variable.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {row[variable.id] !== undefined && row[variable.id] !== null
                              ? Number(row[variable.id]).toLocaleString(undefined, { 
                                  minimumFractionDigits: 0, 
                                  maximumFractionDigits: 2 
                                })
                              : "-"}
                          </td>
                        ))}
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={selectedModel.variables.length + 1} className="text-center py-4 text-gray-400">
                          No hay datos disponibles para mostrar.
                        </td>
                      </tr>
                    )}
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
                        {selectedVariable.value?.toLocaleString()}
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