import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = () => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} />
            <div className="main-content">
                <Header />
                <main className="page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
