import React, { useState, useEffect } from 'react';
import { Sliders, RotateCcw, Play, ArrowDown, ArrowUp } from 'lucide-react';
import { Variable } from '../../types';

interface RatesPanelProps {
  selectedModel: { variables: Variable[] } | null;
  modelRates: Record<string, number>;
  hasModifiedRates: boolean;
  isSimulating: boolean;
  onRateChange: (variableId: string, value: number) => void;
  onResetRates: () => void;
  onSimulate: () => void;
}
/*
const getRateRange = (variable: Variable, modelRates: Record<string, number>) => {
  const baseValue = modelRates[variable.id] ?? variable.value;
  return {
    min: Math.max(0, baseValue * 0.1),
    max: baseValue * 3,
    step: (baseValue * 0.1) / 20 || 0.05,
    baseValue,
  };
};
*/

const getRateRange = (variable: Variable) => {
  const base = variable.value;
  return {
    min: 0,
    max: base * 3,
    step: (base * 0.1) / 20 || 0.05,
  };
};




const getVariableColor = (type: Variable['type']) => {
  switch (type) {
    case 'stock': return 'bg-blue-100 text-blue-800';
    case 'flow': return 'bg-green-100 text-green-800';
    case 'auxiliary': return 'bg-yellow-100 text-yellow-800';
    case 'constant': return 'bg-gray-100 text-gray-800';
    case 'Rate': return 'bg-purple-100 text-purple-800';
    default: return 'bg-purple-100 text-purple-800';
  }
};

const RateControl: React.FC<{
  variable: Variable;
  modelRates: Record<string, number>;
  onRateChange: (id: string, value: number) => void;
}> = ({ variable, modelRates, onRateChange }) => {
  const { min, max, step} = getRateRange(variable);
  const [localValue, setLocalValue] = useState(modelRates[variable.id] ?? variable.value);

  useEffect(() => {
    setLocalValue(modelRates[variable.id] ?? variable.value);
  }, [modelRates, variable.id]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{variable.name}</label>
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getVariableColor(variable.type)}`}>
          {variable.type}
        </span>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setLocalValue(val);
            onRateChange(variable.id, val);
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{min.toFixed(2)}</span>
          <span>{max.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={modelRates[variable.id] ?? variable.value}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            onRateChange(variable.id, val);
          }}
          min={min}
          max={max}
          step={step}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        {variable.unit && (
          <span className="text-sm text-gray-500">{variable.unit}</span>
        )}
      </div>

      {Math.abs(localValue - variable.value) > 0.001 && (
        <div className="text-xs flex items-center space-x-2">
          <span className="text-gray-500">Original: {variable.value.toFixed(2)}</span>
          <span className={`flex items-center font-medium ${
            localValue > variable.value ? 'text-green-600' : 'text-red-600'
          }`}>
            {localValue > variable.value ? (
              <ArrowUp className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs((localValue - variable.value) / variable.value * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
};

const RatesPanel: React.FC<RatesPanelProps> = ({
  selectedModel,
  modelRates,
  hasModifiedRates,
  isSimulating,
  onRateChange,
  onResetRates,
  onSimulate
}) => {
  const rateVariables = selectedModel?.variables.filter(v => v.type === 'Rate') || [];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Sliders className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Análisis de Sensibilidad</h3>
              <p className="text-sm text-gray-600">Modifica y simula</p>
            </div>
          </div>
          <button
            onClick={onResetRates}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Restablecer valores originales"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {rateVariables.map((variable) => (
            <RateControl
              key={variable.id}
              variable={variable}
              modelRates={modelRates}
              onRateChange={onRateChange}
            />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          {hasModifiedRates && (
            <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                ⚠️ Has modificado las tasas. Presiona "Simular" para ver los cambios en la gráfica.
              </p>
            </div>
          )}
          <button
            onClick={onSimulate}
            disabled={isSimulating || !hasModifiedRates}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              hasModifiedRates
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            <Play className="h-4 w-4" />
            <span>{isSimulating ? 'Simulando...' : 'Simular Modelo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatesPanel;
