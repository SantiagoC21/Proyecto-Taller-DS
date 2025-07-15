import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, Workflow, Table, BarChart3, Users, Activity, ChevronRight } from 'lucide-react';

interface Variable {
  id: string;
  name: string;
  type: string;
  value?: number;
  unit?: string;
  x: number;
  y: number;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  type?: string;
  polarity?: string;
}

interface Model {
  id: string;
  name: string;
  filename: string;
  variables: Variable[];
  connections: Connection[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [models, setModels] = useState<Model[]>([]);
  const [showModelSelector, setShowModelSelector] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/causal')
      .then((res) => res.json())
      .then((data) => {
        const array: Model[] = Object.entries(data).map(([id, model]: any) => ({
          id,
          name: id,
          filename: model.name,
          variables: model.variables || [],
          connections: model.connections || []
        }));
        setModels(array);
      })
      .catch((error) => console.error('Error fetching models:', error));
  }, []);

  const quickActions = [
    {
      title: 'Diagrama Causal',
      description: 'Visualiza relaciones causales entre variables',
      icon: GitBranch,
      path: null,
      action: 'causal',
      color: 'bg-blue-500'
    },
    {
      title: 'Diagrama Forrester',
      description: 'Explora flujos y niveles del sistema',
      icon: Workflow,
      path: null,
      action: 'forrester',
      color: 'bg-green-500'
    },
    {
      title: 'Tablas de Variables',
      description: 'Administra y filtra variables del modelo',
      icon: Table,
      path: null, // CAMBIO: antes era '/app/tables'
      action: 'beforeAfterVariables', // CAMBIO: acción especial
      color: 'bg-yellow-500'
    },
    {
      title: 'Simulación',
      description: 'Genera gráficas y analiza resultados',
      icon: BarChart3,
      path: null, // CAMBIO: antes era '/app/simulation'
      action: 'beforeAfterSimulacion', // CAMBIO: acción especial
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    {
      title: 'Modelos Disponibles',
      value: models.length,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Variables Totales',
      value: models.reduce((sum, model) => sum + model.variables.length, 0),
      icon: Activity,
      color: 'text-green-600'
    }
  ];

  // CAMBIO EN ESTE MÉTODO:
  const handleQuickAction = (action: any) => {
    if (action.path) {
      navigate(action.path);
    } else if (action.action === 'causal' || action.action === 'forrester') {
      setShowModelSelector(action.action);
    } else if (action.action === 'beforeAfterVariables') {
      navigate('/before-after', { state: { fromType: 'variables' } });
    } else if (action.action === 'beforeAfterSimulacion') {
      navigate('/before-after', { state: { fromType: 'simulacion' } });
    }
  };

  const handleModelSelect = (actionType: string, modelId: string) => {
    navigate(`/app/${actionType}/${modelId}`);
    setShowModelSelector(null);
  };

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistema de Dinámica de Sistemas
          </h1>
          <p className="text-gray-600">
            Plataforma interactiva para el análisis y visualización de modelos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="text-left p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-200 group"
              >
                <div className={`inline-flex p-3 rounded-lg ${action.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {showModelSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-96 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Seleccionar Modelo
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Elige el modelo para {showModelSelector === 'causal' ? 'Diagrama Causal' : 'Diagrama Forrester'}
                </p>
              </div>
              <div className="p-4 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(showModelSelector, model.id)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800 group-hover:text-blue-600">
                            {model.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{model.filename}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowModelSelector(null)}
                  className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Modelos Disponibles</h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="grid gap-4">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{model.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{model.filename}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">
                          {model.variables.length} variables
                        </p>
                        <p className="text-xs text-gray-500">
                          {model.connections.length} conexiones
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
