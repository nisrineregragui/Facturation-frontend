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
    Package,

    ClipboardList,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ collapsed, toggle }) => {
    const { logout } = useAuth();
    const menuItems = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/clients', name: 'Clients', icon: <Users size={20} /> },
        { path: '/techniciens', name: 'Techniciens', icon: <Wrench size={20} /> },
        { path: '/magasins', name: 'Magasins', icon: <ShoppingBag size={20} /> },
        { path: '/modeles', name: 'Modèles', icon: <Smartphone size={20} /> },
        { path: '/produits', name: 'Catalogue', icon: <Package size={20} /> },
        { path: '/interventions', name: 'Interventions', icon: <ClipboardList size={20} /> },
        { path: '/factures', name: 'Facturation', icon: <FileText size={20} /> },
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-icon">
                    {/* Placeholder or another icon */}
                    <div style={{ width: 30, height: 30, background: '#3a86ff', borderRadius: '8px' }}></div>
                </div>
                {!collapsed && <span className="brand-name">Electro</span>}

                <button className="toggle-btn" onClick={toggle}>
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
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
                                {!collapsed && <span>{item.name}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="nav-link" style={{ cursor: 'pointer', marginTop: '10px' }}>
                    <Settings size={20} />
                    {!collapsed && <span>Settings</span>}
                </div>
                <div className="nav-link" style={{ cursor: 'pointer' }} onClick={logout}>
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
