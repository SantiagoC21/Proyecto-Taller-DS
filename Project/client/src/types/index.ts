export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface Model {
  id: string;
  name: string;
  filename: string;
  descriptionTable: string;
  descriptionSimulation: string;  
  submodels: Submodel[];
  simulationData: SimulationData[];
}

export interface Submodel{
  id: string;
  name: string;
  variables: Variable[]
  simulationData: ChartData[];
}

export interface Variable {
  id: string;
  name: string;
  type: string;
  value: number;
  unit?: string;
  equation?: string;
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'causal' | 'flow';
  polarity?: 'positive' | 'negative';
}

export interface SimulationData {
  time: number;
  [variableId: string]: number;
}

export interface ChartData {
  time: number;
  [key: string]: number | null;
}