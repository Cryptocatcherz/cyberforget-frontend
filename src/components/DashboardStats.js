import React, { useState, useEffect } from 'react';
import './DashboardStats.css';
import { ScannerOutlined } from '@mui/icons-material';

const StatCard = ({ title, value, loading }) => (
    <div className="stat-card">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-value">
            {value}
        </div>
        {loading && <div className="loading-indicator" />}
    </div>
);

const DashboardStats = ({ stats }) => {
    const threatCount = stats?.potentialThreats || 0;
    const matchCount = stats?.totalMatches || 0;
    
    return (
        <div className="dashboard-stats stats-grid">
            <div className="stat-card">
                <h3 className="stat-title">POTENTIAL THREATS</h3>
                <div className="stat-value" style={{color: threatCount > 0 ? '#FFB84B' : '#4A90E2'}}>
                    {threatCount}
                </div>
                <p className="stat-description">
                    {threatCount === 0 ? 'No active threats detected' : 'Possible exposures identified'}
                </p>
                {threatCount === 0 && (
                    <div className="protection-status">
                        <span style={{color: '#4A90E2', fontSize: '0.75rem'}}>✓ Your data appears secure</span>
                    </div>
                )}
            </div>

            <div className="stat-card">
                <h3 className="stat-title">TOTAL MATCHES</h3>
                <div className="stat-value" style={{color: matchCount > 0 ? '#FFB84B' : '#4A90E2'}}>
                    {matchCount}
                </div>
                <p className="stat-description">
                    {matchCount === 0 ? 'No data broker matches found' : 'Cumulative matches across platforms'}
                </p>
                {matchCount === 0 && (
                    <div className="protection-status">
                        <span style={{color: '#4A90E2', fontSize: '0.75rem'}}>✓ Clean scan results</span>
                    </div>
                )}
            </div>

            <div className="stat-card">
                <h3 className="stat-title">SCANS COMPLETED</h3>
                <div className="stat-value" style={{color: '#4A90E2'}}>
                    {stats?.sitesScanned || 0}
                </div>
                <p className="stat-description">
                    Number of full scans completed
                </p>
            </div>

            <div className="stat-card">
                <h3 className="stat-title">LAST SCAN TIME</h3>
                <div className="stat-value" style={{color: '#4A90E2', fontSize: '1.1rem'}}>
                    {stats?.lastScanTime ? new Date(stats.lastScanTime).toLocaleString() : 'N/A'}
                </div>
                <p className="stat-description">
                    Most recent scan completion time
                </p>
            </div>
        </div>
    );
};

export default DashboardStats;
