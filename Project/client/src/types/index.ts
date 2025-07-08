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

export interface MDLModel {
  id: string;
  name: string;
  filename: string;
  variables: Variable[];
  connections: Connection[];
  simulationData: SimulationData[];
}

export interface Variable {
  id: string;
  name: string;
  type: 'stock' | 'flow' | 'auxiliary' | 'constant' | 'connector';
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
  [key: string]: number;
}