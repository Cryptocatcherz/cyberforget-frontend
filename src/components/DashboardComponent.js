import React from 'react';
import './DashboardHeader.css'; // Import the CSS file for styling

const DashboardHeader = ({ currentTask }) => {
    return (
        <div className="dashboard-header">
            <div className="header-content">
                <h1 className="header-title">Your dashboard</h1>
                <div className="header-buttons">
                    <a href="/edit-info" className="button-link">
                        <button className="manage-profile-button">Manage Profile</button>
                    </a>
                    <a href="/data-removals" className="button-link">
                        <button className="view-removals-button">View Removals</button>
                    </a>
                </div>
            </div>
            <p className="dashboard-task">Current Task: {currentTask}</p>
        </div>
    );
};

export default DashboardHeader;
