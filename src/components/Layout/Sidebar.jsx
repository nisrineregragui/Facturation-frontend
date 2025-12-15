import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Wrench,
    FileText,
    Settings,
    LogOut,
    ShoppingBag,
    Smartphone,
    ClipboardList
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const menuItems = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/clients', name: 'Clients', icon: <Users size={20} /> },
        { path: '/techniciens', name: 'Techniciens', icon: <Wrench size={20} /> },
        { path: '/magasins', name: 'Magasins', icon: <ShoppingBag size={20} /> },
        { path: '/modeles', name: 'Modèles', icon: <Smartphone size={20} /> },
        { path: '/interventions', name: 'Interventions', icon: <ClipboardList size={20} /> },
        { path: '/factures', name: 'Facturation', icon: <FileText size={20} /> },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">
                    {/* Placeholder or another icon */}
                    <div style={{ width: 30, height: 30, background: '#3a86ff', borderRadius: '8px' }}></div>
                </div>
                <span className="brand-name">MiniERP</span>
            </div>

            <nav>
                <ul className="nav-list">
                    {menuItems.map((item) => (
                        <li key={item.name} className="nav-item">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="nav-link" style={{ cursor: 'pointer', marginTop: '10px' }}>
                    <Settings size={20} />
                    <span>Settings</span>
                </div>
                <div className="nav-link" style={{ cursor: 'pointer' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
