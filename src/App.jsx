import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Techniciens from './pages/Techniciens';
import Magasins from './pages/Magasins';
import Modeles from './pages/Modeles';
import Interventions from './pages/Interventions';
import Facturation from './pages/Facturation';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="techniciens" element={<Techniciens />} />
          <Route path="magasins" element={<Magasins />} />
          <Route path="modeles" element={<Modeles />} />
          <Route path="interventions" element={<Interventions />} />
          <Route path="factures" element={<Facturation />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
