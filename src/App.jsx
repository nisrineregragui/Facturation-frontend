import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Techniciens from './pages/Techniciens';
import Appareils from './pages/Appareils';
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
          <Route path="appareils" element={<Appareils />} />
          <Route path="factures" element={<Facturation />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
