import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch some data for dashboard
        // Using /Intervention as a test endpoint for now as established previously
        api.get('/Intervention')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Dashboard fetch error:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p>Welcome to the Facturation Management System.</p>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3>Interventions</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3a86ff' }}>
                        {loading ? '...' : (stats?.length || 0)}
                    </p>
                </div>
                {/* Add more cards as placeholders */}
                <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3>Clients</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8338ec' }}>-</p>
                </div>
                <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3>Factures</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff006e' }}>-</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
