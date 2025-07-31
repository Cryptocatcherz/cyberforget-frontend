import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DataBrokerListComponent.css';

const DataBrokerListComponent = ({ 
    isScanning = false,
    currentSite = null,
    progress = 0,
    sitesScanned = 0,
    profilesFound = 0,
    threatsFound = 0,
    threats = [],
    currentStageFromProps = null,
    message = '',
    lastScanTime = null,
    nextScanTime = null
}) => {
    const [currentStage, setCurrentStage] = useState(0);
    const [stageProgress, setStageProgress] = useState(0);
    const [scanState, setScanState] = useState('idle'); // idle, scanning, completed, error

    const stages = [
        { 
            name: "Initializing", 
            duration: 10,
            description: "Setting up scan parameters and security protocols",
            icon: "sync",
            stageKey: "initializing"
        },
        { 
            name: "Connecting", 
            duration: 15,
            description: "Establishing secure connections to data broker networks",
            icon: "link",
            stageKey: "connecting"
        },
        { 
            name: "Searching", 
            duration: 20,
            description: "Scanning data broker databases for matches",
            icon: "search",
            stageKey: "searching"
        },
        { 
            name: "Analyzing", 
            duration: 10,
            description: "Processing and analyzing found data points",
            icon: "chart",
            stageKey: "analyzing"
        },
        { 
            name: "Verifying", 
            duration: 5,
            description: "Verifying results and preparing final report",
            icon: "check",
            stageKey: "verifying"
        }
    ];

    const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);

    useEffect(() => {
        if (isScanning) {
            setScanState('scanning');
        } else if (progress === 100 || (progress > 0 && !isScanning)) {
            setScanState('completed');
        } else if (progress === 0 && !isScanning) {
            setScanState('idle');
        }

        // Find current stage index based on currentStageFromProps
        if (currentStageFromProps) {
            const stageIndex = stages.findIndex(stage => stage.stageKey === currentStageFromProps);
            if (stageIndex !== -1) {
                setCurrentStage(stageIndex);
                return;
            }
        }

        // Calculate stage based on progress if no explicit stage is provided
        if (isScanning) {
            let accumulatedDuration = 0;
            let currentStageIndex = 0;
            let currentStageProgress = 0;

            for (let i = 0; i < stages.length; i++) {
                const stageDurationPercentage = (stages[i].duration / totalDuration) * 100;
                if (progress <= accumulatedDuration + stageDurationPercentage) {
                    currentStageIndex = i;
                    currentStageProgress = ((progress - accumulatedDuration) / stageDurationPercentage) * 100;
                    break;
                }
                accumulatedDuration += stageDurationPercentage;
            }

            setCurrentStage(currentStageIndex);
            setStageProgress(Math.min(currentStageProgress, 100));
        }
    }, [isScanning, progress, currentStageFromProps, stages, totalDuration]);

    const getStageStatus = (index) => {
        if (scanState === 'completed') return 'completed';
        if (scanState === 'idle') return 'pending';
        if (index < currentStage) return 'completed';
        if (index === currentStage) return 'active';
        return 'pending';
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return '#FF4B4B';
            case 'medium':
                return '#FFB84B';
            case 'low':
                return '#4BFF4B';
            default:
                return '#D8FF60';
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusMessage = () => {
        switch (scanState) {
            case 'scanning':
                return message || `Scanning ${currentSite || 'data brokers'}...`;
            case 'completed':
                if (lastScanTime) {
                    return `Last scan completed at ${formatTime(lastScanTime)}`;
                }
                return 'Scan completed successfully';
            case 'idle':
                if (nextScanTime) {
                    const timeUntil = new Date(nextScanTime) - new Date();
                    const minutesUntil = Math.round(timeUntil / (1000 * 60));
                    if (minutesUntil > 0) {
                        return `Next scan in ${minutesUntil} minute${minutesUntil === 1 ? '' : 's'}`;
                    }
                }
                return 'Ready to start new scan';
            default:
                return 'Ready to scan';
        }
    };

    const getIconContent = (iconName) => {
        switch (iconName) {
            case 'sync':
                return <span className="icon-symbol">⟲</span>;
            case 'link':
                return <span className="icon-symbol">⌘</span>;
            case 'search':
                return <span className="icon-symbol">◎</span>;
            case 'chart':
                return <span className="icon-symbol">◫</span>;
            case 'check':
                return <span className="icon-symbol">✓</span>;
            default:
                return <span className="icon-symbol">•</span>;
        }
    };

    return (
        <div className="scan-progress-container">
            <div className="scan-progress-header">
                <h2>Scan Progress</h2>
                <div className={`scan-status-badge ${scanState}`}>
                    {scanState === 'scanning' && <span className="pulse-dot"></span>}
                    {getStatusMessage()}
                </div>
            </div>

            {scanState === 'scanning' && currentSite && (
                <div className="current-site-info">
                    <div className="scanning-indicator">
                        <span className="pulse-dot"></span>
                        <div className="site-details">
                            <h3>Currently Scanning</h3>
                            <p className="site-name">{currentSite}</p>
                            <p className="scan-progress">{Math.round(progress)}% complete</p>
                        </div>
                    </div>
                </div>
            )}

            {scanState === 'completed' && (
                <div className="scan-completion-info">
                    <div className="completion-summary">
                        <span className="checkmark-large">✓</span>
                        <div className="completion-details">
                            <h3>Scan Complete</h3>
                            <p>{sitesScanned} sites scanned • {profilesFound} profiles found • {threatsFound} potential threats</p>
                            {nextScanTime && (
                                <p className="next-scan-time">Next scan scheduled for {formatTime(nextScanTime)}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {(scanState === 'scanning' || scanState === 'completed') && (
                <div className="stages-container">
                    {stages.map((stage, index) => {
                        const status = getStageStatus(index);
                        return (
                            <div 
                                key={index} 
                                className={`stage-item ${status}`}
                            >
                                <div className={`stage-icon ${status}`}>
                                    {getIconContent(stage.icon)}
                                </div>
                                <div className="stage-content">
                                    <div className="stage-header">
                                        <h3>{stage.name}</h3>
                                        <span className="stage-duration">{stage.duration}s</span>
                                    </div>
                                    <p className="stage-description">{stage.description}</p>
                                    {status === 'active' && (
                                        <div className="stage-progress-bar">
                                            <div 
                                                className="stage-progress-fill"
                                                style={{ width: `${stageProgress}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                                <div className="stage-status-indicator">
                                    {status === 'completed' && <span className="checkmark">✓</span>}
                                    {status === 'active' && <span className="spinner"></span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="scan-metrics">
                <div className="metric-item">
                    <span className="metric-label">Sites Scanned</span>
                    <span className="metric-value">{sitesScanned}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">Profiles Found</span>
                    <span className="metric-value">{profilesFound}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">Potential Threats</span>
                    <span className="metric-value">{threatsFound}</span>
                </div>
            </div>

            {threats.length > 0 && (
                <div className="threats-section">
                    <h3>Detected Threats ({threatsFound})</h3>
                    <div className="threats-list">
                        {threats.map((threat, index) => (
                            <div key={index} className="threat-item">
                                <div className="threat-header">
                                    <div 
                                        className="severity-indicator"
                                        style={{ backgroundColor: getSeverityColor(threat.severity) }}
                                    />
                                    <span className="threat-type">{threat.type}</span>
                                    <span className="threat-severity">{threat.severity}</span>
                                </div>
                                <p className="threat-description">{threat.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

DataBrokerListComponent.propTypes = {
    isScanning: PropTypes.bool,
    currentSite: PropTypes.string,
    progress: PropTypes.number,
    sitesScanned: PropTypes.number,
    profilesFound: PropTypes.number,
    threatsFound: PropTypes.number,
    currentStageFromProps: PropTypes.string,
    message: PropTypes.string,
    lastScanTime: PropTypes.string,
    nextScanTime: PropTypes.string,
    threats: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
        severity: PropTypes.string,
        description: PropTypes.string
    }))
};

export default DataBrokerListComponent;
