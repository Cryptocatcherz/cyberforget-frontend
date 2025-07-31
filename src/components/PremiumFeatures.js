import React, { useState, useEffect } from 'react';
import FeatureGate from './FeatureGate';
import LoadingSpinner from './LoadingSpinner';
import './PremiumFeatures.css';

// Ad Blocker Component
export const AdBlockerFeature = () => {
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({
    blockedToday: 0,
    blockedTotal: 0,
    trackersBlocked: 0
  });

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        blockedToday: prev.blockedToday + Math.floor(Math.random() * 3),
        blockedTotal: prev.blockedTotal + Math.floor(Math.random() * 3),
        trackersBlocked: prev.trackersBlocked + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <FeatureGate feature="adBlocker">
      <div className="premium-feature ad-blocker">
        <div className="feature-header">
          <div className="feature-icon">🛡️</div>
          <div className="feature-title">
            <h3>Ad Blocker & Tracker Protection</h3>
            <div className={`status-indicator ${isActive ? 'active' : 'inactive'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          <div className="feature-toggle">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={isActive} 
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="feature-stats">
          <div className="stat-item">
            <div className="stat-value">{stats.blockedToday.toLocaleString()}</div>
            <div className="stat-label">Ads Blocked Today</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.blockedTotal.toLocaleString()}</div>
            <div className="stat-label">Total Blocked</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.trackersBlocked.toLocaleString()}</div>
            <div className="stat-label">Trackers Blocked</div>
          </div>
        </div>

        <div className="feature-controls">
          <button className="btn btn-secondary">Settings</button>
          <button className="btn btn-primary">Whitelist Sites</button>
          <button 
            className="btn btn-accent"
            onClick={() => window.open('https://chrome.google.com/webstore/category/extensions', '_blank')}
          >
            Download Extension
          </button>
        </div>

        <div className="feature-description">
          <p>Block intrusive ads and prevent tracking across all your browsing. 
             Our advanced filtering protects your privacy and speeds up page loading.</p>
        </div>
      </div>
    </FeatureGate>
  );
};

// VPN Component
export const VPNFeature = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('auto');
  const [connectionStats, setConnectionStats] = useState({
    uploadSpeed: '0 MB/s',
    downloadSpeed: '0 MB/s',
    ping: '0 ms'
  });

  const locations = [
    { id: 'auto', name: 'Auto (Fastest)', flag: '🌐' },
    { id: 'us', name: 'United States', flag: '🇺🇸' },
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { id: 'ca', name: 'Canada', flag: '🇨🇦' },
    { id: 'de', name: 'Germany', flag: '🇩🇪' },
    { id: 'jp', name: 'Japan', flag: '🇯🇵' }
  ];

  const handleConnect = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      // Simulate connection stats
      setTimeout(() => {
        setConnectionStats({
          uploadSpeed: '25.3 MB/s',
          downloadSpeed: '87.1 MB/s',
          ping: '12 ms'
        });
      }, 2000);
    } else {
      setConnectionStats({
        uploadSpeed: '0 MB/s',
        downloadSpeed: '0 MB/s',
        ping: '0 ms'
      });
    }
  };

  return (
    <FeatureGate feature="vpn">
      <div className="premium-feature vpn">
        <div className="feature-header">
          <div className="feature-icon">🔐</div>
          <div className="feature-title">
            <h3>Secure VPN Connection</h3>
            <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>

        <div className="vpn-connection">
          <button 
            className={`vpn-connect-btn ${isConnected ? 'connected' : ''}`}
            onClick={handleConnect}
          >
            <div className="connection-icon">
              {isConnected ? '🔒' : '🔓'}
            </div>
            <div className="connection-text">
              {isConnected ? 'Disconnect VPN' : 'Connect VPN'}
            </div>
          </button>
        </div>

        <div className="vpn-location">
          <label>Server Location:</label>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            disabled={isConnected}
          >
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.flag} {location.name}
              </option>
            ))}
          </select>
        </div>

        {isConnected && (
          <div className="vpn-stats">
            <div className="stat-item">
              <div className="stat-value">{connectionStats.downloadSpeed}</div>
              <div className="stat-label">Download</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{connectionStats.uploadSpeed}</div>
              <div className="stat-label">Upload</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{connectionStats.ping}</div>
              <div className="stat-label">Ping</div>
            </div>
          </div>
        )}

        <div className="feature-controls">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/vpn'}
          >
            View VPN Downloads
          </button>
          <button className="btn btn-secondary">Connection Settings</button>
        </div>

        <div className="feature-description">
          <p>Secure your internet connection with military-grade encryption. 
             Browse anonymously and access geo-restricted content safely.</p>
        </div>
      </div>
    </FeatureGate>
  );
};

// Live Reports Component
export const LiveReportsFeature = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading reports
    setTimeout(() => {
      setReports([
        {
          id: 1,
          type: 'threat',
          title: 'Data Breach Detected',
          description: 'Your email found in recent security breach',
          severity: 'high',
          timestamp: new Date(),
          action: 'View Details'
        },
        {
          id: 2,
          type: 'scan',
          title: 'Scan Completed',
          description: '127 new data broker sites checked',
          severity: 'info',
          timestamp: new Date(Date.now() - 300000),
          action: 'View Results'
        },
        {
          id: 3,
          type: 'removal',
          title: 'Removal Request Submitted',
          description: 'Data removal requested from Dataveria.com',
          severity: 'success',
          timestamp: new Date(Date.now() - 600000),
          action: 'Track Progress'
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <FeatureGate feature="liveReports">
      <div className="premium-feature live-reports">
        <div className="feature-header">
          <div className="feature-icon">📊</div>
          <div className="feature-title">
            <h3>Live Security Reports</h3>
            <div className="live-indicator">
              <span className="pulse-dot"></span>
              Live
            </div>
          </div>
        </div>

        <div className="reports-container">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="reports-list">
              {reports.map(report => (
                <div key={report.id} className={`report-item severity-${report.severity}`}>
                  <div className="report-icon">
                    {getSeverityIcon(report.severity)}
                  </div>
                  <div className="report-content">
                    <div className="report-title">{report.title}</div>
                    <div className="report-description">{report.description}</div>
                    <div className="report-timestamp">{formatTime(report.timestamp)}</div>
                  </div>
                  <div className="report-action">
                    <button className="btn btn-sm btn-primary">{report.action}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="reports-controls">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/data-removal'}
          >
            Open Data Removal Dashboard
          </button>
          <button className="btn btn-secondary">Export Report</button>
        </div>

        <div className="feature-description">
          <p>Get real-time security alerts and detailed reports about your digital footprint. 
             Track threats, scan progress, and removal requests as they happen.</p>
        </div>
      </div>
    </FeatureGate>
  );
};

// Combined Premium Features Dashboard
const PremiumFeatures = () => {
  return (
    <div className="premium-features-dashboard">
      <div className="dashboard-header">
        <h2>Premium Security Features</h2>
        <p>Advanced protection tools for comprehensive digital security</p>
      </div>
      
      <div className="features-grid">
        <AdBlockerFeature />
        <VPNFeature />
        <LiveReportsFeature />
      </div>
    </div>
  );
};

export default PremiumFeatures;