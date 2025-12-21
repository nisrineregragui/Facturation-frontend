import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Dashboard.css'; // Import the new CSS
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    TrendingUp, Users, FileText, Activity, DollarSign
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/Dashboard/stats')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Dashboard fetch error:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading-state">Chargement du tableau de bord...</div>;
    if (!stats) return <div className="error-state">Erreur de chargement des données.</div>;

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <h1>Tableau de Bord</h1>
                <p>Vue d'ensemble de votre activité et performances.</p>
            </div>

            {/* KPI Cards Grid */}
            <div className="kpi-grid">

                {/* Card 1: Revenue Total */}
                <div className="kpi-card">
                    <div className="kpi-content">
                        <p>Chiffre d'Affaires</p>
                        <h2>
                            {stats.chiffreAffairesTotal?.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD' })}
                        </h2>
                        <div className="trend-badge positive">
                            <TrendingUp size={14} style={{ marginRight: '4px' }} /> +12% ce mois
                        </div>
                    </div>
                    <div className="kpi-icon bg-blue">
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* Card 2: Interventions */}
                <div className="kpi-card">
                    <div className="kpi-content">
                        <p>Total Interventions</p>
                        <h2>{stats.totalInterventions}</h2>
                        <div style={{ marginTop: '0.5rem' }}>
                            <span className="status-badge green">{stats.interventionsTerminees} Finies</span>
                            <span className="status-badge blue">{stats.interventionsEnCours} En Cours</span>
                        </div>
                    </div>
                    <div className="kpi-icon bg-purple">
                        <Activity size={24} />
                    </div>
                </div>

                {/* Card 3: Clients */}
                <div className="kpi-card">
                    <div className="kpi-content">
                        <p>Clients Actifs</p>
                        <h2>{stats.totalClients}</h2>
                        <div className="trend-badge neutral">
                            Base de données clients
                        </div>
                    </div>
                    <div className="kpi-icon bg-orange">
                        <Users size={24} />
                    </div>
                </div>

                {/* Card 4: Factures */}
                <div className="kpi-card">
                    <div className="kpi-content">
                        <p>Factures Émises</p>
                        <h2>{stats.totalFactures}</h2>
                        <div className="trend-badge neutral">
                            Documents générés
                        </div>
                    </div>
                    <div className="kpi-icon bg-pink">
                        <FileText size={24} />
                    </div>
                </div>
            </div>

            {/* Main Charts Section */}
            <div className="charts-grid">

                {/* Revenue Chart (Big) */}
                <div className="chart-card">
                    <h3 className="chart-title">Évolution du Chiffre d'Affaires</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={stats.revenueChart}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution (Donut) */}
                <div className="chart-card">
                    <h3 className="chart-title">État des Interventions</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={stats.statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {stats.statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        
        

        </div>
    );
};

export default Dashboard;
