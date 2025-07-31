import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationTabs.css';

const NavigationTabs = () => {
    return (
        <nav className="navigation-tabs">
            <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'tab active-tab' : 'tab')}
            >
                Dashboard
            </NavLink>
            <NavLink
                to="/data-removals"
                className={({ isActive }) => (isActive ? 'tab active-tab' : 'tab')}
            >
                Live Reports
            </NavLink>
            <NavLink
                to="/edit-info"
                className={({ isActive }) => (isActive ? 'tab active-tab' : 'tab')}
            >
                Privacy Profile
            </NavLink>
        </nav>
    );
};

export default NavigationTabs;
