import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Model, Submodel, Variable, SimulationData } from '../types';

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
      const parsedModels: Model[] = Object.entries(data).map(([modelId, modelData]: [string, any]) => {
        const {
          nombreArchivo,
          descripcionTabla: descriptionTable,
          descripcionSimulacion: descriptionSimulation,
          ...restoSubmodelos
        } = modelData;

        const submodels: Submodel[] = Object.entries(restoSubmodelos).map(([sid, vars]: any) => {
          const variables: Variable[] = Object.entries(vars).map(([vid, v]: any) => ({
            id: vid,
            name: v.titulo,
            type: v.tipo,
            value: v.data ? Number(Object.values(v.data)[0]) : 0,
            unit: v.unidad || '',
            equation: '',
            x: 0,
            y: 0
          }));

          const years = Array.from(
            new Set(Object.values(vars).flatMap((x: any) => Object.keys(x.data || {}).map(Number)))
          ).sort((a, b) => a - b);

          const simulationData: SimulationData[] = years.map((y) => {
            const row: SimulationData = { time: y };
            Object.entries(vars).forEach(([key, x]: any) => {
              row[x.titulo] = x.data?.[y] ?? null;
            });
            return row;
          });

          return {
            id: sid,
            name: sid.replace(/_/g, ' '),
            variables,
            simulationData
          };
        });

        return {
          id: modelId,
          name: modelId.replace(/_/g, ' '),
          filename: nombreArchivo || 'Base de Datos de la Simulación',
          descriptionTable,
          descriptionSimulation,
          submodels,
          simulationData: [] // opcional: puedes agregar lógica para unir todos los simulationData si lo necesitas
        };
      });

      setModels(parsedModels);
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