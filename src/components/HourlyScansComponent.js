import React, { useState, useEffect } from 'react';
import { 
  FaPlay, FaStop, FaPause, FaCog, FaHistory, FaClock, 
  FaShieldAlt, FaExclamationTriangle, FaCheckCircle, 
  FaSpinner, FaWifi, FaChartLine
} from 'react-icons/fa';
import { useHourlyScans } from '../hooks/useHourlyScans';
import { useAuth } from "../hooks/useAuthUtils";
import './HourlyScansComponent.css';

const HourlyScansComponent = () => {
  const { user } = useAuth();
  const {
    isActive,
    progress,
    currentSite,
    currentStage,
    error,
    isManualScan,
    scanHistory,
    metrics,
    settings,
    isConnected,
    startScan,
    stopScan,
    runManualScan,
    updateSettings,
    clearError
  } = useHourlyScans(user?.id);

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  // Update local settings when settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingsUpdate = () => {
    updateSettings(localSettings);
    setShowSettings(false);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = () => {
    if (!isConnected) return '#ef4444'; // red
    if (isActive) return '#10b981'; // green
    if (error) return '#f59e0b'; // amber
    return '#6b7280'; // gray
  };

  const getNextScanTime = () => {
    if (!metrics.nextScanTime) return 'Not scheduled';
    
    // Handle various possible timestamp formats
    let nextScan;
    if (typeof metrics.nextScanTime === 'number') {
      // If it's a number, treat it as milliseconds
      nextScan = new Date(metrics.nextScanTime);
    } else {
      // If it's a string, parse it
      nextScan = new Date(metrics.nextScanTime);
    }
    
    // Validate the date
    if (isNaN(nextScan.getTime())) {
      return 'Invalid schedule';
    }
    
    const now = new Date();
    const diffMs = nextScan - now;
    
    // If the time is more than 7 days in the future, something is wrong
    if (diffMs > 7 * 24 * 60 * 60 * 1000) {
      return 'Schedule error';
    }
    
    if (diffMs <= 0) return 'Starting soon...';
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`;
    }
    return `${diffMins}m`;
  };

  return (
    <div className="hourly-scans-container">
      <div className="hourly-scans-header">
        <div className="header-left">
          <FaClock className="header-icon" />
          <div>
            <h3>SITES SCANNED</h3>
            <p className="header-subtitle">Data broker sites analyzed</p>
          </div>
        </div>
        
        <div className="connection-status">
          {isConnected ? (
            <div className="status-indicator connected">
              <FaWifi className="status-icon" />
              <span>Connected</span>
            </div>
          ) : (
            <div className="status-indicator disconnected">
              <FaExclamationTriangle className="status-icon" />
              <span>Disconnected</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <FaExclamationTriangle className="error-icon" />
          <span>{error}</span>
          <button onClick={clearError} className="error-close">×</button>
        </div>
      )}

      {/* Main Status Card */}
      <div className="scan-status-card">
        <div className="status-header">
          <div className="status-indicator-large" style={{ backgroundColor: getStatusColor() }}>
            {isActive ? (
              <FaSpinner className="spinning" />
            ) : (
              <FaShieldAlt />
            )}
          </div>
          
          <div className="status-info">
            <h4>{isActive ? 'Scanning Active' : 'Monitoring Ready'}</h4>
            <p>
              {isActive ? (
                currentStage || 'Scanning in progress...'
              ) : (
                `Next scan: ${getNextScanTime()}`
              )}
            </p>
          </div>
        </div>

        {/* Scan Progress */}
        <div className="scan-progress-section">
          <h4>Scan Progress</h4>
          {isActive ? (
            <div className="progress-active">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="current-stage">
                <span className="stage-icon">
                  {currentStage === 'Initializing' && '⟲'}
                  {currentStage === 'Connecting' && '⌘'}
                  {currentStage === 'Searching' && '◎'}
                  {currentStage === 'Analyzing' && '◫'}
                  {currentStage === 'Verifying' && '✓'}
                </span>
                <div className="stage-info">
                  <strong>{currentStage || 'Processing'}</strong>
                  {currentSite && <p>Scanning: {currentSite}</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="progress-stages">
              <div className="stage-item">
                <span className="stage-icon">⟲</span>
                <div>
                  <strong>Initializing</strong>
                  <p>Setting up scan parameters and security protocols</p>
                </div>
              </div>
              <div className="stage-item">
                <span className="stage-icon">⌘</span>
                <div>
                  <strong>Connecting</strong>
                  <p>Establishing secure connections to data broker networks</p>
                </div>
              </div>
              <div className="stage-item">
                <span className="stage-icon">◎</span>
                <div>
                  <strong>Searching</strong>
                  <p>Scanning data broker databases for matches</p>
                </div>
              </div>
              <div className="stage-item">
                <span className="stage-icon">◫</span>
                <div>
                  <strong>Analyzing</strong>
                  <p>Processing and analyzing found data points</p>
                </div>
              </div>
              <div className="stage-item">
                <span className="stage-icon">✓</span>
                <div>
                  <strong>Verifying</strong>
                  <p>Verifying results and preparing final report</p>
                </div>
              </div>
              <div className="ready-status">
                Ready to start new scan
              </div>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="metrics-grid">
          <div className="metric-item">
            <FaExclamationTriangle className="metric-icon threat" />
            <div>
              <span className="metric-value">{metrics.threatsFound || 0}</span>
              <span className="metric-label">POTENTIAL THREATS</span>
              <span className="metric-description">Possible exposures identified</span>
            </div>
          </div>
          <div className="metric-item">
            <FaCheckCircle className="metric-icon success" />
            <div>
              <span className="metric-value">{metrics.totalMatches || 0}</span>
              <span className="metric-label">TOTAL MATCHES</span>
              <span className="metric-description">Cumulative matches across platforms</span>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="status-info-section">
          <div className="auto-scan-notice">
            <FaCheckCircle className="notice-icon" />
            <div>
              <strong>Automated scans run at the beginning of every hour</strong>
              <p>Next scan in: {getNextScanTime()}</p>
            </div>
          </div>
          
          <div className="control-buttons">
            <button 
              className="btn btn-primary"
              onClick={async () => {
                try {
                  const response = await fetch('/api/hourly-scan/trigger', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  if (response.ok) {
                    console.log('Manual scan triggered');
                  }
                } catch (error) {
                  console.error('Error triggering scan:', error);
                }
              }}
              disabled={!isConnected || isActive}
            >
              <FaPlay /> Test Scan Now
            </button>
            <button 
              className="btn btn-ghost"
              onClick={() => setShowHistory(true)}
            >
              <FaHistory /> View History
            </button>
          </div>
        </div>
      </div>


      {/* History Modal */}
      {showHistory && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h4>Scan History</h4>
              <button 
                className="modal-close"
                onClick={() => setShowHistory(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {scanHistory.length === 0 ? (
                <div className="empty-state">
                  <FaHistory className="empty-icon" />
                  <p>No scan history available</p>
                </div>
              ) : (
                <div className="history-list">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="history-item">
                      <div className="history-header">
                        <span className={`scan-type ${scan.type}`}>
                          {scan.type === 'manual' ? 'Manual' : 'Hourly'}
                        </span>
                        <span className="scan-date">
                          {formatDate(scan.timestamp)}
                        </span>
                      </div>
                      <div className="history-metrics">
                        <span>{scan.sitesScanned} sites</span>
                        <span>{scan.threatsFound} threats</span>
                        <span>{scan.totalMatches} matches</span>
                        <span>{formatDuration(scan.duration)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Last Scan Info */}
      {metrics.lastScanTime && (
        <div className="last-scan-info">
          <FaClock className="info-icon" />
          <span>Last scan: {formatDate(metrics.lastScanTime)}</span>
        </div>
      )}
    </div>
  );
};

export default HourlyScansComponent; 