import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Info, X, Eye, EyeOff } from 'lucide-react';
import { fetchBackendData } from '../../utils/fetchBackendData';
import { getMockModels } from '../../utils/mockdata';
import { getDescriptionTabla } from '../../utils/mockdescriptiontabla';
import { Variable, SimulationData, MDLModel } from '../../types';

const BACKEND_URL = "http://localhost:5000/data";
const ITEMS_PER_PAGE = 20;

const VariableTables: React.FC = () => {
  const { period } = useParams<{ period: string }>();
  const isMock = period === 'antes';

  const [models, setModels] = useState<MDLModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<MDLModel | null>(null);
  const [submodels, setSubmodels] = useState<MDLModel[]>([]);
  const [selectedSubmodel, setSelectedSubmodel] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVariable, setSelectedVariable] = useState<Variable | null>(null);
  const [visibleVariables, setVisibleVariables] = useState<Record<string, boolean>>({});
  const [yearFilter, setYearFilter] = useState<{ min: number; max: number }>({ min: 0, max: 3000 });

  // Load models
  useEffect(() => {
    setLoading(true);
    if (isMock) {
      const mock = getMockModels();
      setModels(mock);
      setLoading(false);
    } else {
      fetchBackendData(BACKEND_URL)
        .then((data: any) => {
          const parsed: MDLModel[] = Object.entries(data).map(([mid, subs]: any) => ({
            id: mid,
            name: mid.replace(/_/g, ' '),
            filename: 'Base de Datos de la Simulación',
            variables: [],
            simulationData: [],
            submodels: Object.entries(subs).map(([sid, vars]: any) => ({
              id: sid,
              name: sid.replace(/_/g, ' '),
              variables: Object.entries(vars).map(([vid, v]: any) => ({
                id: vid,
                name: v.titulo,
                type: v.tipo,
                value: v.data[Object.keys(v.data)[0]] || 0,
                unit: v.unidad,
                equation: '', x: 0, y: 0
              })),
              simulationData: (() => {
                const years = Array.from(new Set(
                  Object.values(vars).flatMap((x: any) => Object.keys(x.data).map(Number))
                )).sort((a, b) => a - b);
                return years.map(y => {
                  const row: SimulationData = { time: y };
                  Object.entries(vars).forEach(([key, x]: any) => row[key] = x.data[y] ?? null);
                  return row;
                });
              })()
            }))
          }));
          setModels(parsed);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [period]);

  // Select model
  const handleModelSelect = (mid: string) => {
    const m = models.find(x => x.id === mid) || null;
    setSelectedModel(m);
    setCurrentPage(1);
    setSearchTerm('');
    setSelectedVariable(null);
    setVisibleVariables({});
    setSelectedSubmodel('');
    if (m) {
      if (isMock) {
        // initialize mock visibility & years
        const vis: Record<string, boolean> = {};
        m.variables.forEach(v => vis[v.id] = true);
        setVisibleVariables(vis);
        const years = m.simulationData.map(r => r.time);
        setYearFilter({ min: Math.min(...years), max: Math.max(...years) });
      } else {
        setSubmodels(m.submodels);
      }
    }
  };

  // Select submodel
  const handleSubmodelSelect = (sid: string) => {
    setSelectedSubmodel(sid);
    const sub = selectedModel?.submodels.find(s => s.id === sid);
    if (sub) {
      const vis: Record<string, boolean> = {};
      sub.variables.forEach(v => vis[v.id] = true);
      setVisibleVariables(vis);
      const years = sub.simulationData.map(r => r.time);
      setYearFilter({ min: Math.min(...years), max: Math.max(...years) });
    }
    setCurrentPage(1);
    setSearchTerm('');
    setSelectedVariable(null);
  };

  const toggleVariable = (vid: string) => {
    setVisibleVariables(prev => ({ ...prev, [vid]: !prev[vid] }));
  };

  // Determine current vars & data
  const currentVars = isMock
    ? (selectedModel?.variables || [])
    : (selectedModel?.submodels.find(s => s.id === selectedSubmodel)?.variables || []);
  const currentData = isMock
    ? (selectedModel?.simulationData || [])
    : (selectedModel?.submodels.find(s => s.id === selectedSubmodel)?.simulationData || []);

  // Filtering, searching, pagination
  const filteredYears = useMemo(
    () => currentData.filter(r => r.time >= yearFilter.min && r.time <= yearFilter.max),
    [currentData, yearFilter]
  );
  const searched = useMemo(() => {
    if (!searchTerm) return filteredYears;
    return filteredYears.filter(r =>
      r.time.toString().includes(searchTerm) ||
      currentVars.some(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()) && r[v.id] != null)
    );
  }, [filteredYears, searchTerm, currentVars]);
  const paginated = useMemo(
    () => searched.slice((currentPage-1)*ITEMS_PER_PAGE, currentPage*ITEMS_PER_PAGE),
    [searched, currentPage]
  );
  const totalPages = Math.ceil(searched.length / ITEMS_PER_PAGE);

  if (loading) return <div className="p-8">Cargando datos...</div>;

  // === Model selection view ===
  if (!selectedModel) {
    return (
      <div className="p-6 overflow-y-auto h-full">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {isMock
                ? 'Selecciona un modelo para ver los datos históricos anuales'
                : 'Selecciona un indicador para ver los datos simulados'}
            </h2>
            <p className="text-gray-600">Tablas de Variables por Año</p>
          </div>
          <div className="grid gap-4">
            {models.map((m,i) => (
              <button
                key={m.id}
                onClick={() => handleModelSelect(m.id)}
                className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">{i+1}. {m.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{m.filename}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {isMock
                    ? `${m.variables.length} variables • ${m.simulationData.length} años`
                    : `${m.submodels.length} submodelos`}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // === Main view: mock or real submodel ===
  return (
    <div className="p-6 overflow-y-auto h-full">
      {!isMock && (
        <div className="max-w-4xl mx-auto mb-6">
          <label htmlFor="submodel" className="block text-sm font-medium text-gray-700">Elige submodelo</label>
          <select
            id="submodel"
            value={selectedSubmodel}
            onChange={e => handleSubmodelSelect(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>— Selecciona un submodelo —</option>
            {submodels.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      )}

      {/* Controls */}
      <div className="max-w-7xl mx-auto mb-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isMock ? selectedModel.name : selectedModel.name}
          </h2>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSelectedModel(null)} className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
              Cambiar modelo
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">  
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por año o variable..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Mostrando {paginated.length} de {searched.length} años</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Rango de años:</span>
          <input
            type="number"
            value={yearFilter.min}
            onChange={e => setYearFilter(prev => ({ ...prev, min: parseInt(e.target.value)||0 }))}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
            min={0}
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            value={yearFilter.max}
            onChange={e => setYearFilter(prev => ({ ...prev, max: parseInt(e.target.value)||3000 }))}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
            min={0}
          />
        </div>
      </div>

      {/* Table & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Table */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">Año</th>
                {currentVars.filter(v => visibleVariables[v.id]).map(v => (
                  <th
                    key={v.id}
                    className="px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedVariable(v)}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="truncate max-w-xs" title={v.name}>{v.name}</span>
                      <Info className="h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.map((row, idx) => (
                <tr key={row.time} className={idx%2===0?'bg-white':'bg-gray-50'}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-inherit z-10">{row.time}</td>
                  {currentVars.filter(v => visibleVariables[v.id]).map(v => (
                    <td key={v.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {row[v.id] != null ? Number(row[v.id]).toLocaleString() : '-'}
                    </td>
                  ))}
                </tr>
              ))}
              {paginated.length===0 && (
                <tr><td colSpan={1+currentVars.filter(v=>visibleVariables[v.id]).length} className="py-4 text-center text-gray-400">No hay datos para mostrar.</td></tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages>1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="p-2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
              <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="p-2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Filtros de Variables</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {currentVars.map(v => (
                <label key={v.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleVariables[v.id]||false}
                    onChange={()=>toggleVariable(v.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0 flex items-center space-x-2">
                    {visibleVariables[v.id]
                      ? <Eye className="h-4 w-4 text-green-500" />
                      : <EyeOff className="h-4 w-4 text-gray-400" />}
                    <span className="text-sm font-medium truncate">{v.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          {selectedVariable && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Detalle de Variable</h3>
                <button onClick={()=>setSelectedVariable(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-4 w-4"/></button>
              </div>
              <div className="p-4 space-y-4">
                <div><h4 className="font-semibold text-gray-800 mb-1">{selectedVariable.name}</h4></div>
                <div><span className="text-sm font-medium text-gray-600">Valor inicial:</span>
                  <p className="text-sm text-gray-800 mt-1">{selectedVariable.value.toLocaleString()}{selectedVariable.unit && ` ${selectedVariable.unit}`}</p>
                </div>
                {selectedVariable.unit && (
                  <div><span className="text-sm font-medium text-gray-600">Unidad:</span>
                  <p className="text-sm text-gray-800 mt-1">{selectedVariable.unit}</p></div>
                )}
                {selectedVariable.equation && (
                  <div><span className="text-sm font-medium text-gray-600">Ecuación:</span>
                  <p className="text-sm font-mono text-gray-800 bg-gray-50 p-2 rounded mt-1">{selectedVariable.equation}</p></div>
                )}
                <div><span className="text-sm font-medium text-gray-600">Posición:</span>
                  <p className="text-sm text-gray-800 mt-1">X: {selectedVariable.x}, Y: {selectedVariable.y}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 flex items-center space-x-3">
          <Info className="h-5 w-5 text-blue-600 p-2 bg-blue-100 rounded-lg" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{getDescriptionTabla((selectedModel||{}).id).title}</h3>
            <p className="text-gray-600 leading-relaxed mt-1">{getDescriptionTabla((selectedModel||{}).id).description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariableTables;
