import React from 'react';
import './DataBrokerList.css';

const DataBrokerList = ({ isScanning, currentSite, progress }) => {
    const brokers = [
        { name: "Preparing scan...", status: "queued" },
        { name: "Scanning data brokers...", status: "in-progress" },
        { name: "Checking exposures...", status: "queued" },
        { name: "Verifying data points...", status: "queued" }
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
                return 'status-completed';
            case 'in-progress':
                return 'status-in-progress';
            default:
                return 'status-queued';
        }
    };

    return (
        <div className="data-broker-section">
            <div className="data-broker-header">
                <h2 className="data-broker-title">Data Broker Scan</h2>
                {isScanning && (
                    <div className="scan-status">
                        <div className="status-indicator"></div>
                        <span>Scanning: {currentSite || 'Initializing...'}</span>
                    </div>
                )}
            </div>
            
            <div className="data-broker-grid">
                {brokers.map((broker, index) => {
                    const isActive = isScanning && broker.status === 'in-progress';
                    const statusClass = getStatusClass(broker.status);
                    
                    return (
                        <div key={index} className="broker-card">
                            <h3 className="broker-name">{broker.name}</h3>
                            <div className={`broker-status ${statusClass}`}>
                                <div className="status-indicator"></div>
                                <span>{isActive ? 'In Progress' : broker.status}</span>
                            </div>
                            {isActive && (
                                <div className="broker-progress">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DataBrokerList; 