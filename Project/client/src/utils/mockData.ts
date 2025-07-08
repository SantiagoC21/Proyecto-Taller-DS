import { MDLModel, Variable, Connection, SimulationData } from '../types';

const generateSimulationData = (variables: Variable[]): SimulationData[] => {
  const data: SimulationData[] = [];
  for (let time = 0; time <= 100; time++) {
    const entry: SimulationData = { time };
    variables.forEach(variable => {
      switch (variable.type) {
        case 'stock':
          entry[variable.id] = Math.max(0, variable.value + Math.sin(time * 0.1) * 10 + Math.random() * 5);
          break;
        case 'flow':
          entry[variable.id] = Math.max(0, variable.value + Math.cos(time * 0.15) * 5 + Math.random() * 2);
          break;
        case 'auxiliary':
          entry[variable.id] = variable.value + Math.sin(time * 0.2) * 3 + Math.random() * 1;
          break;
        default:
          entry[variable.id] = variable.value + Math.random() * 0.5;
      }
    });
    data.push(entry);
  }
  return data;
};

export const mockModels: MDLModel[] = [
  {
    id: '1',
    name: 'Population Growth Model',
    filename: 'population_growth.mdl',
    variables: [
      { id: 'pop', name: 'Population', type: 'stock', value: 1000, unit: 'people', x: 200, y: 150 },
      { id: 'births', name: 'Birth Rate', type: 'flow', value: 25, unit: 'people/year', x: 100, y: 100 },
      { id: 'deaths', name: 'Death Rate', type: 'flow', value: 15, unit: 'people/year', x: 300, y: 100 },
      { id: 'fertility', name: 'Fertility Rate', type: 'auxiliary', value: 0.025, unit: '1/year', x: 50, y: 50 },
      { id: 'mortality', name: 'Mortality Rate', type: 'auxiliary', value: 0.015, unit: '1/year', x: 350, y: 50 }
    ],
    connections: [
      { id: 'c1', from: 'births', to: 'pop', type: 'flow' },
      { id: 'c2', from: 'pop', to: 'deaths', type: 'flow' },
      { id: 'c3', from: 'fertility', to: 'births', type: 'causal', polarity: 'positive' },
      { id: 'c4', from: 'mortality', to: 'deaths', type: 'causal', polarity: 'positive' },
      { id: 'c5', from: 'pop', to: 'births', type: 'causal', polarity: 'positive' }
    ],
    simulationData: []
  },
  {
    id: '2',
    name: 'Inventory Management',
    filename: 'inventory_management.mdl',
    variables: [
      { id: 'inventory', name: 'Inventory Level', type: 'stock', value: 500, unit: 'units', x: 200, y: 200 },
      { id: 'orders', name: 'Order Rate', type: 'flow', value: 100, unit: 'units/week', x: 100, y: 150 },
      { id: 'sales', name: 'Sales Rate', type: 'flow', value: 80, unit: 'units/week', x: 300, y: 150 },
      { id: 'demand', name: 'Customer Demand', type: 'auxiliary', value: 85, unit: 'units/week', x: 350, y: 100 },
      { id: 'reorder', name: 'Reorder Point', type: 'constant', value: 200, unit: 'units', x: 50, y: 100 }
    ],
    connections: [
      { id: 'c1', from: 'orders', to: 'inventory', type: 'flow' },
      { id: 'c2', from: 'inventory', to: 'sales', type: 'flow' },
      { id: 'c3', from: 'demand', to: 'sales', type: 'causal', polarity: 'positive' },
      { id: 'c4', from: 'inventory', to: 'orders', type: 'causal', polarity: 'negative' },
      { id: 'c5', from: 'reorder', to: 'orders', type: 'causal', polarity: 'positive' }
    ],
    simulationData: []
  },
  {
    id: '3',
    name: 'Economic Growth Model',
    filename: 'economic_growth.mdl',
    variables: [
      { id: 'gdp', name: 'GDP', type: 'stock', value: 10000, unit: 'billion $', x: 200, y: 180 },
      { id: 'investment', name: 'Investment', type: 'flow', value: 1500, unit: 'billion $/year', x: 120, y: 120 },
      { id: 'consumption', name: 'Consumption', type: 'flow', value: 7000, unit: 'billion $/year', x: 280, y: 120 },
      { id: 'savings_rate', name: 'Savings Rate', type: 'auxiliary', value: 0.15, unit: 'fraction', x: 80, y: 80 },
      { id: 'growth_rate', name: 'Growth Rate', type: 'auxiliary', value: 0.03, unit: 'fraction/year', x: 320, y: 80 }
    ],
    connections: [
      { id: 'c1', from: 'investment', to: 'gdp', type: 'flow' },
      { id: 'c2', from: 'gdp', to: 'consumption', type: 'flow' },
      { id: 'c3', from: 'savings_rate', to: 'investment', type: 'causal', polarity: 'positive' },
      { id: 'c4', from: 'gdp', to: 'investment', type: 'causal', polarity: 'positive' },
      { id: 'c5', from: 'growth_rate', to: 'gdp', type: 'causal', polarity: 'positive' }
    ],
    simulationData: []
  }
];

// Generate simulation data for all models
mockModels.forEach(model => {
  model.simulationData = generateSimulationData(model.variables);
});

export const getMockModels = (): MDLModel[] => mockModels;

export const getMockModelById = (id: string): MDLModel | null => {
  return mockModels.find(model => model.id === id) || null;
};