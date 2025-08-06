import { useState, useMemo, useEffect } from 'react';
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
import { FileText, TrendingUp, Settings, Info } from 'lucide-react';
import { saveAs } from 'file-saver';
import { useParams } from 'react-router-dom';
import { useSimulation } from '../../context/SimulationContext';
import { getMockModels } from '../../utils/mockdata';
import { getDescripcionGraficas } from '../../utils/mockdescripciongraficas';
//import { fetchBackendData } from '../../utils/fetchBackendData';
import { Model, Submodel, Variable, ChartData } from '../../types';
import RatesPanel from './RatesPanel';

// const BACKEND_URL = "http://localhost:5000/data";

const BASE_URL = import.meta.env.VITE_API_BASE


const SimulationGraphs: React.FC = () => {
  const { period } = useParams<{ period: string }>();
  const isMock = period === 'antes';
  const { models: realModels, loading } = useSimulation();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [submodels, setSubmodels] = useState<Submodel[]>([]);
  const [selectedSubmodel, setSelectedSubmodel] = useState<string>('');
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (isMock){
      setModels(getMockModels());
    } else {
      setModels(realModels);
    }
  }, [isMock, realModels]);



  const handleModelSelect = (id: string) => {
    const m = models.find(x => x.id === id) || null;
    setSelectedModel(m);
    setSelectedVariables([]);
    setOverrides({});
    setSelectedSubmodel('');
    setSubmodels(isMock ? [] : (m?.submodels || []));
  };

  const handleSubmodelSelect = (sid: string) => {
    console.log("🔁 Cambiando a submodelo:", sid);
    setSelectedSubmodel(sid);
    setSelectedVariables([]);
    setOverrides({});
  };

  // Initialize overrides when a real submodel is selected
  useEffect(() => {
    if (!isMock && selectedSubmodel) {
      const vars = selectedModel?.submodels.find(s => s.id === selectedSubmodel)?.variables || [];
      const init: Record<string, number> = {};
      vars.filter(v => v.type === 'Rate').forEach(v => init[v.id] = v.value);
      setOverrides(init);
    }
  }, [isMock, selectedSubmodel]);

  const handleOverrideChange = (id: string, value: number) => {
    setOverrides(prev => {
      const updated = { ...prev, [id]: value };
      console.log("Overrides actualizado: ", updated)
      return updated;
    });
  };

  const handleSimulate = async () => {
    if (!selectedModel) return;
    setIsSimulating(true);
    try {
      const playload = {
        model: selectedModel.filename,
        params: overrides
      };
      console.log("Enviando al backend: ", playload);

      const res = await fetch(BASE_URL + '/simulate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(playload)
      });
      const json = await res.json();
      console.log("📈 JSON devuelto por el backend tras simulación:", json);
      const dataArr = getCurrentData();
      const years = dataArr.map(d => d.time);
      const updated = years.map((y, i) => {
        const row: any = { time: y };
        Object.entries(json).forEach(([k, arr]: any) => row[k] = arr[i]);
        return row;
      });
      console.log("🛠️ simulationData transformado para guardar:", updated);

      

      if (!isMock) {
        const sub = selectedModel?.submodels.find(s => s.id === selectedSubmodel);
        if (sub) {
          console.log(`📝 Guardando simulationData en submodelo "${sub.name}"`);
          sub.simulationData = updated;
        }
      }

    } finally {
      setIsSimulating(false);
    }
  };

  const colors = [
    "#FF5733","#33FF57","#3357FF","#F7B731","#9B59B6","#1ABC9C",
    "#E74C3C","#2ECC71","#3498DB","#F39C12","#8E44AD","#16A085",
    "#2980B9","#D35400","#C0392B","#27AE60","#E67E22","#34495E",
    "#E84393","#00B894","#FF6B9D","#45B7D1","#96CEB4","#FFEAA7",
    "#DDA0DD","#98D8C8","#F7DC6F","#BB8FCE","#85C1E9","#F8C471",
    "#82E0AA","#F1948A","#85929E","#D7BDE2","#A9DFBF","#F9E79F",
    "#AED6F1","#F5B7B1","#D5A6BD","#A3E4D7","#FCF3CF","#FADBD8",
    "#D6EAF8","#EBDEF0","#D1F2EB","#FEF9E7","#FDEBD0","#EAF2F8"
  ];

  // Helpers to get current variables and data
  const getCurrentVars = (): Variable[] => isMock
    ? ((selectedModel as any)?.variables || [])
    : (selectedModel?.submodels.find(s => s.id === selectedSubmodel)?.variables || []);
  const getCurrentData = (): ChartData[] => isMock
    ? ((selectedModel as any)?.simulationData || [])
    : (selectedModel?.submodels.find(s => s.id === selectedSubmodel)?.simulationData || []);

  const varsCurr = getCurrentVars();
  const dataCurr = getCurrentData();

  const chartData = useMemo(() => {
    if (!selectedModel || !selectedVariables.length) return [];
    const transformed = dataCurr.map(d => {
      const obj: any = { time: d.time };
      selectedVariables.forEach( id => {
        const v = varsCurr.find( x => x.id === id );
        const key = v?.name;
        if (key) obj[key] = isMock ? (d as any)[id] : (d as any)[key];
      });
      return obj;
    });
    console.log("📊 Datos finales que se grafican:", transformed);
    return transformed;
  }, [dataCurr, varsCurr, selectedVariables]);

  const toggleVar = (id: string) =>
    setSelectedVariables(p =>
      p.includes(id) ? p.filter(x => x !== id) : [...p, id]
    );

  const downloadCSV = () => {
    const hdr = ['Time', ...selectedVariables.map(id => varsCurr.find(v => v.id === id)?.name || id)];
    const rows = dataCurr.map(d => [
      d.time,
      ...selectedVariables.map(id => isMock ? (d as any)[id] : (d as any)[varsCurr.find(v => v.id === id)!.name])
    ]);
    const csv = [hdr.join(','), ...rows.map(r => r.join(','))].join('\n');
    saveAs(new Blob([csv], { type: 'text/csv' }), `${selectedModel?.name}.csv`);
  };

  const showRatesPanel = !isMock && selectedModel && selectedSubmodel;

  // === Render ===
  if (!selectedModel) {
    return (
      <div className="p-6 overflow-y-auto h-full">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {isMock
                ? 'Selecciona un modelo para ver las gráficas de los datos históricos anuales'
                : 'Selecciona un indicador para ver las gráficas de los datos simulados'}
            </h2>
            <p className="text-gray-600">Gráficas de las variables por Año</p>
          </div>
          {loading ? (
            <p className="text-gray-500 text-sm">Cargando modelos...</p>
          ) : !models.length ? (
            <p className="text-gray-500 text-sm">No hay modelos disponibles.</p>
          ) : (
            <div className="grid gap-4">
              {models.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => handleModelSelect(m.id)}
                  className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800">{i + 1}. {m.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{m.filename}</p>
                  {isMock ? (
                    <p className="text-sm text-gray-500 mt-1">{varsCurr.length} variables • {dataCurr.length} años de datos</p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      {m.submodels.length} submodelos • {
                        m.submodels.reduce((acc, s) => acc + s.variables.length, 0)
                      } variables
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isMock) {
    return (
      <div className="p-6 overflow-y-auto h-full">
        <h2 className="text-xl font-semibold mb-4">Mock: {selectedModel.name}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Variables Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Variables</h3>
              {varsCurr.map(v => (
                <label key={v.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedVariables.includes(v.id)}
                    onChange={() => toggleVar(v.id)}
                  />
                  <span className="text-gray-800">{v.name}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Graph & Description */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              {selectedVariables.length ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {selectedVariables.map((id, idx) => {
                      const name = varsCurr.find(x => x.id === id)!.name;
                      return <Line key={id} type="monotone" dataKey={name} stroke={colors[idx % colors.length]} />;
                    })}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">Selecciona variables para graficar</div>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">{getDescripcionGraficas(selectedModel.id).title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{getDescripcionGraficas(selectedModel.id).description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === Real Simulation Detail ===
  return (
    <div className="p-6 overflow-y-auto h-full">
      {/* Submodel Selector */}
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
      {/* Actions */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{selectedModel.name}</h2>
        <div className="flex items-center space-x-4">
          <button onClick={() => setSelectedModel(null)} className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">Cambiar modelo</button>
          {selectedVariables.length > 0 && (
            <button onClick={downloadCSV} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FileText className="h-4 w-4" />
              <span>CSV</span>
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Variables Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-6">
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Variables</h3>
                <p className="text-sm text-gray-600">Selecciona para graficar</p>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[calc(100vh-10rem)] overflow-y-auto">
              {varsCurr.map(v => (
                <label key={ v.id} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${selectedVariables.includes(v.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    checked={selectedVariables.includes(v.id)}
                    onChange={() => toggleVar(v.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-800 font-medium">{v.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* Chart & Description */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
            <div className="p-6">
              {selectedVariables.length ? (
                <ResponsiveContainer width="100%" height={384}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    {selectedVariables.map((id, i) => {
                      const v = varsCurr.find(x => x.id === id);
                      return v ? <Line key={id} type="monotone" dataKey={v.name} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} connectNulls /> : null;
                    })}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-400">Selecciona una o más variables del panel izquierdo para ver la gráfica</div>
              )}
            </div>
          </div>
          {/* Description */}
          
          {selectedModel && (
            <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 flex items-center space-x-3">
                <Info className="h-5 w-5 text-blue-600 p-2 bg-blue-100 rounded-lg" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Descripción de la simulacion</h3>
                  <p className="text-gray-600 leading-relaxed mt-1">{selectedModel.descriptionSimulation}</p>
                </div>
              </div>
            </div>
          )}



          {/* Rates Panel */}
          {showRatesPanel ? (
            <RatesPanel
              selectedModel={selectedModel.submodels.find(s => s.id === selectedSubmodel) ?? null}
              modelRates={overrides}
              hasModifiedRates={Object.keys(overrides).some(id => overrides[id] !== varsCurr.find(v => v.id === id)?.value)}
              isSimulating={isSimulating}
              onRateChange={handleOverrideChange}
              onResetRates={() => {
                const reset: Record<string, number> = {};
                varsCurr
                  .filter((v) => v.type === "Rate")
                  .forEach((v) => (reset[v.id] = v.value));
                setOverrides(reset);
              }}
              onSimulate={handleSimulate}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SimulationGraphs;