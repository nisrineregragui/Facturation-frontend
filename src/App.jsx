import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Techniciens from './pages/Techniciens';
import Magasins from './pages/Magasins';
import Modeles from './pages/Modeles';
import Interventions from './pages/Interventions';
import Facturation from './pages/Facturation';
import Produits from './pages/Produits';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="clients" element={<Clients />} />
              <Route path="techniciens" element={<Techniciens />} />
              <Route path="magasins" element={<Magasins />} />
              <Route path="modeles" element={<Modeles />} />
              <Route path="interventions" element={<Interventions />} />
              <Route path="produits" element={<Produits />} />
              <Route path="factures" element={<Facturation />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
