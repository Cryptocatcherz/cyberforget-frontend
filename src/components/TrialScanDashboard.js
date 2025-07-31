import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import trialScanService from '../services/trialScanService';
import socketService from '../services/socketService';
import './TrialScanDashboard.css';

const TrialScanDashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const [scanStatus, setScanStatus] = useState(null);
    const [threats, setThreats] = useState([]);
    const [removalProgress, setRemovalProgress] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [scanProgress, setScanProgress] = useState(null);
    const [error, setError] = useState(null);
    const [currentScanId, setCurrentScanId] = useState(null);

    // Load user's scan data on component mount
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            loadUserScanData();
        }
    }, [isAuthenticated, user]);

    // Set up WebSocket listeners for real-time scan updates
    useEffect(() => {
        if (currentScanId && socketService.isConnected()) {
            // Listen for real-time scan progress
            socketService.on('SCAN_PROGRESS', (data) => {
                if (data.scanId === currentScanId) {
                    setScanProgress({
                        progress: data.progress,
                        sitesScanned: data.sitesCompleted,
                        totalSites: data.totalSites,
                        threatsFound: data.threatsFound,
                        currentSite: data.currentSite
                    });
                }
            });

            // Listen for scan completion
            socketService.on('SCAN_COMPLETED', (data) => {
                if (data.scanId === currentScanId) {
                    setScanStatus('completed');
                    setThreats(data.threats || []);
                    loadUserScanData(); // Refresh all data
                }
            });

            // Listen for threats found
            socketService.on('THREAT_FOUND', (data) => {
                if (data.scanId === currentScanId) {
                    setThreats(prev => [...prev, data.threat]);
                }
            });

            // Cleanup
            return () => {
                socketService.off('SCAN_PROGRESS');
                socketService.off('SCAN_COMPLETED');
                socketService.off('THREAT_FOUND');
            };
        }
    }, [currentScanId]);

    // Set up progress monitoring for active scans
    useEffect(() => {
        if (scanStatus?.scan?.id && scanStatus.scan.status === 'running') {
            const progressCallback = (progressData) => {
                setScanProgress(progressData);
                // Update scan status
                setScanStatus(prev => ({
                    ...prev,
                    scan: {
                        ...prev.scan,
                        progress_percentage: progressData.progress,
                        sites_scanned: progressData.sitesScanned,
                        threats_found: progressData.threatsFound
                    }
                }));
            };

            trialScanService.onProgress(scanStatus.scan.id, progressCallback);

            // Cleanup
            return () => {
                trialScanService.offProgress(scanStatus.scan.id);
            };
        }
    }, [scanStatus?.scan?.id, scanStatus?.scan?.status]);

    const loadUserScanData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get active scan
            const activeScan = await trialScanService.getActiveScan(user.id);
            
            let scanData = null;
            if (activeScan) {
                const scanResult = await trialScanService.getScanStatus(activeScan.id);
                if (scanResult.success) {
                    scanData = scanResult.data;
                }
            } else {
                // Get most recent completed scan
                const scanHistory = await trialScanService.getUserScanHistory(user.id, 1);
                if (scanHistory.success && scanHistory.data.length > 0) {
                    const latestScan = scanHistory.data[0];
                    const scanResult = await trialScanService.getScanStatus(latestScan.id);
                    if (scanResult.success) {
                        scanData = scanResult.data;
                    }
                }
            }

            if (scanData) {
                setScanStatus(scanData);
                setThreats(scanData.threats || []);
                
                // Build removal progress map
                const progressMap = {};
                scanData.removalRequests?.forEach(request => {
                    progressMap[request.threat_id] = request;
                });
                setRemovalProgress(progressMap);
            }

        } catch (error) {
            console.error('[TrialScanDashboard] Failed to load scan data:', error);
            setError('Failed to load scan data');
        } finally {
            setLoading(false);
        }
    };

    const startNewScan = async () => {
        try {
            setLoading(true);
            setError(null);
            setScanProgress({ progress: 0, sitesScanned: 0, threatsFound: 0 });

            // Prepare user data for real scan
            const userData = {
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.primaryEmailAddress?.emailAddress || user?.email || '',
                phone: user?.phoneNumbers?.[0]?.phoneNumber || user?.phone || '',
                address: user?.address || ''
            };

            // Start REAL scan with SitescanV2
            const result = await trialScanService.startRealScan(userData);

            if (result.success) {
                // Monitor the scan progress
                console.log('[TrialScanDashboard] Real scan started:', result.data);
                // You can add WebSocket monitoring here for real-time updates
                setCurrentScanId(result.data.scanId);
                setScanStatus('running');
            } else {
                setError(result.error);
            }

        } catch (error) {
            console.error('[TrialScanDashboard] Failed to start scan:', error);
            setError('Failed to start scan');
        } finally {
            setLoading(false);
        }
    };

    const refreshScanData = useCallback(async () => {
        if (scanStatus?.scan?.id) {
            const result = await trialScanService.getScanStatus(scanStatus.scan.id);
            if (result.success) {
                setScanStatus(result.data);
                setThreats(result.data.threats || []);
                
                // Update removal progress
                const progressMap = {};
                result.data.removalRequests?.forEach(request => {
                    progressMap[request.threat_id] = request;
                });
                setRemovalProgress(progressMap);
            }
        }
    }, [scanStatus?.scan?.id]);

    // Auto-refresh data every 30 seconds for active scans
    useEffect(() => {
        if (scanStatus?.scan?.status === 'running') {
            const interval = setInterval(refreshScanData, 30000);
            return () => clearInterval(interval);
        }
    }, [scanStatus?.scan?.status, refreshScanData]);

    const getSeverityColor = (severity) => {
        const colors = {
            critical: '#dc2626',
            high: '#ea580c',
            medium: '#d97706',
            low: '#65a30d'
        };
        return colors[severity] || '#6b7280';
    };

    const getStatusColor = (status) => {
        const colors = {
            discovered: '#6b7280',
            verified: '#2563eb',
            removal_requested: '#d97706',
            removal_in_progress: '#7c3aed',
            removal_completed: '#16a34a',
            removal_failed: '#dc2626',
            requires_manual_action: '#ea580c'
        };
        return colors[status] || '#6b7280';
    };

    const getRemovalStatusText = (threat) => {
        const removalRequest = removalProgress[threat.id];
        if (!removalRequest) {
            return threat.status === 'discovered' ? 'Not Started' : threat.status;
        }
        
        const statusMap = {
            pending: 'Pending',
            sent: 'Request Sent',
            acknowledged: 'Acknowledged',
            in_progress: 'In Progress',
            completed: 'Completed',
            failed: 'Failed',
            requires_verification: 'Needs Verification',
            requires_manual_action: 'Manual Action Required'
        };
        
        return statusMap[removalRequest.status] || removalRequest.status;
    };

    const renderOverview = () => {
        const scan = scanStatus?.scan;
        const isScanning = scan?.status === 'running';
        const progress = scanProgress?.progress || scan?.progress_percentage || 0;

        return (
            <div className="overview-section">
                {/* Scan Status Card */}
                <div className="scan-status-card">
                    <div className="card-header">
                        <h3>Scan Status</h3>
                        {isScanning && (
                            <div className="scanning-indicator">
                                <div className="pulse-dot"></div>
                                <span>Scanning...</span>
                            </div>
                        )}
                    </div>
                    
                    {scan ? (
                        <div className="scan-details">
                            <div className="progress-section">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">{progress}% Complete</span>
                            </div>
                            
                            <div className="scan-stats">
                                <div className="stat">
                                    <span className="stat-label">Sites Scanned</span>
                                    <span className="stat-value">
                                        {scanProgress?.sitesScanned || scan.sites_scanned} / {scan.total_sites}
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Threats Found</span>
                                    <span className="stat-value threat-count">
                                        {scanProgress?.threatsFound || scan.threats_found}
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Status</span>
                                    <span className={`stat-value status-${scan.status}`}>
                                        {scan.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {isScanning && scanProgress?.currentSite && (
                                <div className="current-scan">
                                    <span>Currently scanning: <strong>{scanProgress.currentSite}</strong></span>
                                </div>
                            )}

                            <div className="scan-actions">
                                <button 
                                    onClick={refreshScanData}
                                    className="btn-secondary"
                                    disabled={loading}
                                >
                                    Refresh
                                </button>
                                {!isScanning && (
                                    <button 
                                        onClick={startNewScan}
                                        className="btn-primary"
                                        disabled={loading}
                                    >
                                        Start New Scan
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="no-scan">
                            <p>No scan data available</p>
                            <button 
                                onClick={startNewScan}
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Starting...' : 'Start Your First Scan'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Threats Summary */}
                {threats.length > 0 && (
                    <div className="threats-summary-card">
                        <h3>Threats Overview</h3>
                        <div className="threat-stats">
                            <div className="threat-stat critical">
                                <span className="count">
                                    {threats.filter(t => t.severity === 'critical').length}
                                </span>
                                <span className="label">Critical</span>
                            </div>
                            <div className="threat-stat high">
                                <span className="count">
                                    {threats.filter(t => t.severity === 'high').length}
                                </span>
                                <span className="label">High Risk</span>
                            </div>
                            <div className="threat-stat medium">
                                <span className="count">
                                    {threats.filter(t => t.severity === 'medium').length}
                                </span>
                                <span className="label">Medium Risk</span>
                            </div>
                            <div className="threat-stat low">
                                <span className="count">
                                    {threats.filter(t => t.severity === 'low').length}
                                </span>
                                <span className="label">Low Risk</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderThreats = () => {
        if (threats.length === 0) {
            return (
                <div className="no-threats">
                    <p>No threats detected. Run a scan to check for exposed information.</p>
                </div>
            );
        }

        return (
            <div className="threats-section">
                <div className="threats-header">
                    <h3>Detected Threats ({threats.length})</h3>
                    <div className="threat-filters">
                        {/* Add filters here if needed */}
                    </div>
                </div>
                
                <div className="threats-list">
                    {threats.map(threat => (
                        <div key={threat.id} className="threat-card">
                            <div className="threat-header">
                                <div className="threat-title">
                                    <h4>{threat.title}</h4>
                                    <div className="threat-badges">
                                        <span 
                                            className="severity-badge"
                                            style={{ backgroundColor: getSeverityColor(threat.severity) }}
                                        >
                                            {threat.severity.toUpperCase()}
                                        </span>
                                        <span className="category-badge">
                                            {threat.site_category}
                                        </span>
                                    </div>
                                </div>
                                <div className="threat-actions">
                                    <span 
                                        className="status-badge"
                                        style={{ color: getStatusColor(threat.status) }}
                                    >
                                        {getRemovalStatusText(threat)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="threat-details">
                                <p className="threat-description">{threat.description}</p>
                                
                                <div className="threat-info">
                                    <div className="info-item">
                                        <span className="label">Site:</span>
                                        <span className="value">{threat.site_name}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Confidence:</span>
                                        <span className="value">{threat.confidence_score}%</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Removal Difficulty:</span>
                                        <span className="value">{threat.removal_difficulty}</span>
                                    </div>
                                </div>

                                {threat.exposed_data && Object.keys(threat.exposed_data).length > 0 && (
                                    <div className="exposed-data">
                                        <span className="label">Exposed Information:</span>
                                        <div className="data-tags">
                                            {Object.entries(threat.exposed_data).map(([key, value]) => (
                                                <span key={key} className="data-tag">
                                                    {typeof value === 'boolean' && value ? key : `${key}: ${value}`}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Removal Progress */}
                            {removalProgress[threat.id] && (
                                <div className="removal-progress">
                                    <div className="progress-header">
                                        <span>Removal Progress</span>
                                        <span className="success-probability">
                                            {removalProgress[threat.id].success_probability}% success rate
                                        </span>
                                    </div>
                                    <div className="progress-steps">
                                        <div className="step completed">
                                            <div className="step-indicator"></div>
                                            <span>Request Initiated</span>
                                        </div>
                                        <div className={`step ${['sent', 'acknowledged', 'in_progress', 'completed'].includes(removalProgress[threat.id].status) ? 'completed' : 'pending'}`}>
                                            <div className="step-indicator"></div>
                                            <span>Contact Made</span>
                                        </div>
                                        <div className={`step ${['acknowledged', 'in_progress', 'completed'].includes(removalProgress[threat.id].status) ? 'completed' : 'pending'}`}>
                                            <div className="step-indicator"></div>
                                            <span>Acknowledged</span>
                                        </div>
                                        <div className={`step ${['in_progress', 'completed'].includes(removalProgress[threat.id].status) ? 'completed' : 'pending'}`}>
                                            <div className="step-indicator"></div>
                                            <span>Processing</span>
                                        </div>
                                        <div className={`step ${removalProgress[threat.id].status === 'completed' ? 'completed' : 'pending'}`}>
                                            <div className="step-indicator"></div>
                                            <span>Completed</span>
                                        </div>
                                    </div>
                                    {removalProgress[threat.id].estimated_completion && (
                                        <div className="estimated-completion">
                                            <span>Estimated completion: {new Date(removalProgress[threat.id].estimated_completion).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderRemovalProgress = () => {
        const activeRemovals = Object.values(removalProgress).filter(
            request => !['completed', 'failed'].includes(request.status)
        );
        
        const completedRemovals = Object.values(removalProgress).filter(
            request => request.status === 'completed'
        );

        return (
            <div className="removal-section">
                <div className="removal-stats">
                    <div className="stat-card">
                        <span className="stat-number">{activeRemovals.length}</span>
                        <span className="stat-label">Active Removals</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{completedRemovals.length}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            {completedRemovals.length > 0 ? 
                                Math.round((completedRemovals.length / Object.keys(removalProgress).length) * 100) : 0}%
                        </span>
                        <span className="stat-label">Success Rate</span>
                    </div>
                </div>

                {activeRemovals.length > 0 && (
                    <div className="active-removals">
                        <h3>Active Removal Requests</h3>
                        <div className="removal-list">
                            {activeRemovals.map(request => {
                                const threat = threats.find(t => t.id === request.threat_id);
                                return (
                                    <div key={request.id} className="removal-item">
                                        <div className="removal-header">
                                            <span className="site-name">{threat?.site_name}</span>
                                            <span className="removal-status">{getRemovalStatusText(threat)}</span>
                                        </div>
                                        <div className="removal-details">
                                            <span>Method: {request.method_used}</span>
                                            <span>Attempts: {request.attempts}/{request.max_attempts}</span>
                                            <span>Success Rate: {request.success_probability}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {completedRemovals.length > 0 && (
                    <div className="completed-removals">
                        <h3>Completed Removals</h3>
                        <div className="removal-list">
                            {completedRemovals.map(request => {
                                const threat = threats.find(t => t.id === request.threat_id);
                                return (
                                    <div key={request.id} className="removal-item completed">
                                        <div className="removal-header">
                                            <span className="site-name">{threat?.site_name}</span>
                                            <span className="completion-date">
                                                Completed {new Date(request.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (!isAuthenticated) {
        return (
            <div className="trial-scan-dashboard">
                <div className="auth-required">
                    <p>Please sign in to access your scan dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="trial-scan-dashboard">
            <div className="dashboard-header">
                <h1>Privacy Scan Dashboard</h1>
                <p>Monitor and manage your digital privacy threats</p>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            <div className="dashboard-nav">
                <button 
                    className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`nav-tab ${activeTab === 'threats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('threats')}
                >
                    Threats ({threats.length})
                </button>
                <button 
                    className={`nav-tab ${activeTab === 'removal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('removal')}
                >
                    Removal Progress
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'threats' && renderThreats()}
                {activeTab === 'removal' && renderRemovalProgress()}
            </div>
        </div>
    );
};

export default TrialScanDashboard;