import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <h2>Dashboard Overview</h2>
            </div>

            <div className="header-right">
                <button className="icon-btn">
                    <Search size={20} />
                </button>
                <button className="icon-btn">
                    <Bell size={20} />
                </button>

                <div className="user-profile">
                    <div className="avatar">AD</div>
                    <div className="user-info">
                        <span className="user-name">Admin User</span>
                        <span className="user-role">Administrator</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
