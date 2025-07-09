import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Model, Variable } from '../types';

interface SimulationContextType {
  models: Model[];
  loading: boolean;
}

const SimulationContext = createContext<SimulationContextType>({
  models: [],
  loading: true,
});

export const useSimulation = () => useContext(SimulationContext);

interface ProviderProps {
  children: ReactNode;
}

export const SimulationProvider: React.FC<ProviderProps> = ({ children }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:5000/data')
      .then(res => res.json())
      .then(data => {
        const modelsArray: Model[] = Object.entries(data).map(([modelKey, variablesObj]: [string, any]) => {
          const variables: Variable[] = [];
          const timeSet = new Set<number>();
          const allDataPoints: { [key: number]: { time: number; [varName: string]: number } } = {};

          Object.entries(variablesObj).forEach(([varName, varInfo]: [string, any]) => {
            variables.push({
              id: varName,
              name: varName,
              type: 'auxiliary',
              value: 0,
              x: 0,
              y: 0,
            });

            Object.entries(varInfo.data).forEach(([year, value]) => {
              const time = Number(year);
              timeSet.add(time);
              if (!allDataPoints[time]) allDataPoints[time] = { time };
              allDataPoints[time][varName] = value as number;
            });
          });

          const simulationData = Array.from(timeSet).sort((a, b) => a - b).map(time => allDataPoints[time]);

          return {
            id: modelKey,
            name: modelKey,
            filename: modelKey,
            variables,
            connections: [],
            simulationData,
          };
        });

        setModels(modelsArray);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener los modelos de simulación:", err);
        setModels([]);
        setLoading(false);
      });
  }, []);

  return (
    <SimulationContext.Provider value={{ models, loading }}>
      {children}
    </SimulationContext.Provider>
  );
};
