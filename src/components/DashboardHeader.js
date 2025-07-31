// DashboardHeader.js

import React from 'react';
import PropTypes from 'prop-types';
import { FaUserCog, FaShieldAlt, FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './DashboardHeader.css';

const DashboardHeader = ({ currentTask, dataBrokers = [], isScanning }) => {
    const getNextStepMessage = () => {
        if (isScanning) {
            return currentTask;
        }

        // Find brokers with different statuses to determine next steps
        const pendingBrokers = dataBrokers.filter(broker => 
            broker.status.includes('Processing') || 
            broker.status.includes('Sent')
        );
        const verificationBrokers = dataBrokers.filter(broker => 
            broker.status.includes('Verification')
        );
        const confirmationBrokers = dataBrokers.filter(broker => 
            broker.status.includes('Progress')
        );

        if (pendingBrokers.length > 0) {
            return `Sending Removal Request To: ${pendingBrokers[0].name}`;
        }
        if (verificationBrokers.length > 0) {
            return `Awaiting Verification From: ${verificationBrokers[0].name}`;
        }
        if (confirmationBrokers.length > 0) {
            return `Scanning For Confirmation From: ${confirmationBrokers[0].name}`;
        }
        
        return 'Monitoring removal status across all data brokers...';
    };

    const getScanSchedule = () => {
        const now = new Date();
        const nextHour = new Date(now);
        nextHour.setHours(now.getHours() + 1, 0, 0, 0);
        const minutesUntilNext = Math.floor((nextHour - now) / (1000 * 60));
        
        return `Next automated scan in ${minutesUntilNext} minutes`;
    };

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <h1 className="header-title">
                    CyberForget AI Protection Center
                    <span className="title-accent"></span>
                </h1>
                <p className="header-subtitle">
                    Advanced AI-powered data broker removal service with 24/7 automated monitoring
                </p>
                
                <div className="service-info">
                    <div className="info-card">
                        <div className="info-icon">🔄</div>
                        <div className="info-content">
                            <h3>Automated Hourly Scans</h3>
                            <p>{getScanSchedule()}</p>
                        </div>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">🛡️</div>
                        <div className="info-content">
                            <h3>Active Protection</h3>
                            <p>Monitoring 400+ data brokers continuously</p>
                        </div>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">📝</div>
                        <div className="info-content">
                            <h3>Legal Removal Process</h3>
                            <p>Automated takedown requests sent per CCPA/GDPR</p>
                        </div>
                    </div>
                    <div className="info-card">
                        <div className="info-icon" style={{color:'#00d4ff'}}>📊</div>
                        <div className="info-content">
                            <h3>Data Broker Coverage</h3>
                            <p>400+ brokers monitored</p>
                        </div>
                    </div>
                </div>

                <div className="task-container">
                    <div className="task-indicator"></div>
                    <p className="dashboard-task">
                        <span className="task-label">Current Status:</span>
                        <span className="task-text">{getNextStepMessage()}</span>
                    </p>
                </div>
                
                <div className="header-buttons">
                    <Link to="/edit-info" className="button-link">
                        <button className="manage-profile-button">
                            <FaUserCog className="button-icon" />
                            <span>Manage Profile</span>
                        </button>
                    </Link>
                    <Link to="/data-removals" className="button-link">
                        <button className="view-removals-button">
                            <FaShieldAlt className="button-icon" />
                            <span>View Removals</span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="header-background">
                <div className="cyber-grid"></div>
            </div>
        </header>
    );
};

DashboardHeader.propTypes = {
    currentTask: PropTypes.string,
    dataBrokers: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        status: PropTypes.string
    })),
    isScanning: PropTypes.bool
};

export default DashboardHeader;
