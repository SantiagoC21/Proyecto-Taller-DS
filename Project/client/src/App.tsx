// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/Auth/AuthPage';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './components/Common/Dashboard';
import CausalDiagram from './components/Diagrams/CausalDiagram';
import ForresterDiagram from './components/Diagrams/ForresterDiagram';
import VariableTables from './components/Tables/VariableTables';
import SimulationGraphs from './components/Simulation/SimulationGraphs';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/app" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } />
          
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="causal/:modelId" element={<CausalDiagram />} />
            <Route path="forrester/:modelId" element={<ForresterDiagram />} />
            <Route path="tables" element={<VariableTables />} />
            <Route path="simulation" element={<SimulationGraphs />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/app" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
