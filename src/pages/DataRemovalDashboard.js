import React, { useState, useEffect } from 'react';
import FeatureGate from '../components/FeatureGate';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaShieldAlt, FaTrash, FaEye, FaClock, FaCheck, FaExclamationTriangle, FaDownload, FaFilter, FaSearch } from 'react-icons/fa';
import './DataRemovalDashboard.css';

const DataRemovalDashboard = () => {
  const [removalData, setRemovalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSites, setSelectedSites] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockData = {
      summary: {
        totalSites: 247,
        foundOn: 89,
        removalRequested: 67,
        removalCompleted: 52,
        inProgress: 15,
        failed: 7,
        notFound: 158
      },
      recentActivity: [
        {
          id: 1,
          site: 'DataVeria.com',
          action: 'Removal Completed',
          status: 'completed',
          timestamp: new Date(Date.now() - 300000),
          details: 'Personal information successfully removed'
        },
        {
          id: 2,
          site: 'PeopleSearch.net',
          action: 'Removal Requested',
          status: 'in_progress',
          timestamp: new Date(Date.now() - 600000),
          details: 'Removal request submitted, awaiting confirmation'
        },
        {
          id: 3,
          site: 'InfoTracker.org',
          action: 'Data Found',
          status: 'found',
          timestamp: new Date(Date.now() - 900000),
          details: 'Personal profile discovered with phone and address'
        }
      ],
      sites: [
        {
          id: 1,
          name: 'DataVeria.com',
          category: 'People Search',
          status: 'completed',
          foundData: ['Name', 'Address', 'Phone'],
          removalDate: new Date(Date.now() - 86400000),
          riskLevel: 'high',
          url: 'https://dataveria.com'
        },
        {
          id: 2,
          name: 'PeopleSearch.net',
          category: 'Background Check',
          status: 'in_progress',
          foundData: ['Name', 'Age', 'Relatives'],
          requestDate: new Date(Date.now() - 43200000),
          riskLevel: 'medium',
          url: 'https://peoplesearch.net'
        },
        {
          id: 3,
          name: 'InfoTracker.org',
          category: 'Data Broker',
          status: 'found',
          foundData: ['Name', 'Address', 'Phone', 'Email'],
          discoveryDate: new Date(Date.now() - 3600000),
          riskLevel: 'high',
          url: 'https://infotracker.org'
        },
        {
          id: 4,
          name: 'PublicRecords.info',
          category: 'Public Records',
          status: 'failed',
          foundData: ['Name', 'Property Records'],
          failureReason: 'Site requires manual verification',
          riskLevel: 'low',
          url: 'https://publicrecords.info'
        },
        {
          id: 5,
          name: 'WhitePages.com',
          category: 'Directory',
          status: 'not_found',
          scanDate: new Date(Date.now() - 7200000),
          riskLevel: 'low',
          url: 'https://whitepages.com'
        }
      ]
    };

    setTimeout(() => {
      setRemovalData(mockData);
      setLoading(false);
    }, 1500);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheck className="status-icon completed" />;
      case 'in_progress':
        return <FaClock className="status-icon in-progress" />;
      case 'found':
        return <FaEye className="status-icon found" />;
      case 'failed':
        return <FaExclamationTriangle className="status-icon failed" />;
      case 'not_found':
        return <FaShieldAlt className="status-icon not-found" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Removed';
      case 'in_progress':
        return 'In Progress';
      case 'found':
        return 'Found';
      case 'failed':
        return 'Failed';
      case 'not_found':
        return 'Not Found';
      default:
        return status;
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high':
        return '#ff4757';
      case 'medium':
        return '#ffa502';
      case 'low':
        return '#42ffb5';
      default:
        return '#8892a8';
    }
  };

  const handleBulkRemoval = () => {
    if (selectedSites.length === 0) {
      alert('Please select sites to remove data from.');
      return;
    }
    
    alert(`Initiating bulk removal for ${selectedSites.length} sites. This may take several minutes to complete.`);
    setSelectedSites([]);
  };

  const handleSiteSelection = (siteId, checked) => {
    if (checked) {
      setSelectedSites([...selectedSites, siteId]);
    } else {
      setSelectedSites(selectedSites.filter(id => id !== siteId));
    }
  };

  const filteredSites = removalData?.sites.filter(site => {
    const matchesFilter = filter === 'all' || site.status === filter;
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

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

  if (loading) {
    return (
      <FeatureGate feature="dataRemoval">
        <div className="data-removal-loading">
          <LoadingSpinner />
          <p>Loading your data removal dashboard...</p>
        </div>
      </FeatureGate>
    );
  }

  return (
    <FeatureGate feature="dataRemoval">
      <div className="data-removal-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Data Removal Dashboard</h1>
              <p>Monitor and manage the removal of your personal information from data broker sites</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary">
                <FaDownload /> Export Report
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleBulkRemoval}
                disabled={selectedSites.length === 0}
              >
                <FaTrash /> Remove Selected ({selectedSites.length})
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-section">
          <div className="summary-grid">
            <div className="summary-card total">
              <div className="card-icon">
                <FaShieldAlt />
              </div>
              <div className="card-content">
                <div className="card-value">{removalData.summary.totalSites}</div>
                <div className="card-label">Total Sites Scanned</div>
              </div>
            </div>
            
            <div className="summary-card found">
              <div className="card-icon">
                <FaEye />
              </div>
              <div className="card-content">
                <div className="card-value">{removalData.summary.foundOn}</div>
                <div className="card-label">Data Found On</div>
              </div>
            </div>
            
            <div className="summary-card completed">
              <div className="card-icon">
                <FaCheck />
              </div>
              <div className="card-content">
                <div className="card-value">{removalData.summary.removalCompleted}</div>
                <div className="card-label">Successfully Removed</div>
              </div>
            </div>
            
            <div className="summary-card in-progress">
              <div className="card-icon">
                <FaClock />
              </div>
              <div className="card-content">
                <div className="card-value">{removalData.summary.inProgress}</div>
                <div className="card-label">In Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <h3>Removal Progress</h3>
            <span className="progress-percentage">
              {Math.round((removalData.summary.removalCompleted / removalData.summary.foundOn) * 100)}% Complete
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{
                width: `${(removalData.summary.removalCompleted / removalData.summary.foundOn) * 100}%`
              }}
            ></div>
          </div>
          <div className="progress-details">
            <span>{removalData.summary.removalCompleted} of {removalData.summary.foundOn} sites processed</span>
            <span>{removalData.summary.inProgress} pending removal</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h3>Recent Activity</h3>
          <div className="activity-feed">
            {removalData.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.action}</div>
                  <div className="activity-site">{activity.site}</div>
                  <div className="activity-details">{activity.details}</div>
                </div>
                <div className="activity-time">
                  {formatTime(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter and Search */}
        <div className="controls-section">
          <div className="search-controls">
            <div className="search-input">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-controls">
              <FaFilter className="filter-icon" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Sites</option>
                <option value="found">Data Found</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="not_found">Not Found</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sites Table */}
        <div className="sites-section">
          <div className="sites-header">
            <h3>Data Broker Sites ({filteredSites.length})</h3>
            <div className="bulk-actions">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedSites.length === filteredSites.filter(s => s.status === 'found').length && filteredSites.filter(s => s.status === 'found').length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSites(filteredSites.filter(s => s.status === 'found').map(s => s.id));
                    } else {
                      setSelectedSites([]);
                    }
                  }}
                />
                Select All Found
              </label>
            </div>
          </div>
          
          <div className="sites-table">
            <div className="table-header">
              <div className="header-cell select">
                <span>Select</span>
              </div>
              <div className="header-cell site">
                <span>Site Name</span>
              </div>
              <div className="header-cell category">
                <span>Category</span>
              </div>
              <div className="header-cell status">
                <span>Status</span>
              </div>
              <div className="header-cell data">
                <span>Data Found</span>
              </div>
              <div className="header-cell risk">
                <span>Risk Level</span>
              </div>
              <div className="header-cell actions">
                <span>Actions</span>
              </div>
            </div>
            
            <div className="table-body">
              {filteredSites.map(site => (
                <div key={site.id} className={`table-row status-${site.status}`}>
                  <div className="table-cell select">
                    {site.status === 'found' && (
                      <input
                        type="checkbox"
                        checked={selectedSites.includes(site.id)}
                        onChange={(e) => handleSiteSelection(site.id, e.target.checked)}
                      />
                    )}
                  </div>
                  
                  <div className="table-cell site">
                    <div className="site-info">
                      <div className="site-name">{site.name}</div>
                      <div className="site-url">{site.url}</div>
                    </div>
                  </div>
                  
                  <div className="table-cell category">
                    <span className="category-badge">{site.category}</span>
                  </div>
                  
                  <div className="table-cell status">
                    <div className="status-badge">
                      {getStatusIcon(site.status)}
                      <span>{getStatusLabel(site.status)}</span>
                    </div>
                  </div>
                  
                  <div className="table-cell data">
                    {site.foundData ? (
                      <div className="data-tags">
                        {site.foundData.map((data, index) => (
                          <span key={index} className="data-tag">{data}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-data">No data found</span>
                    )}
                  </div>
                  
                  <div className="table-cell risk">
                    <div 
                      className="risk-indicator"
                      style={{ backgroundColor: getRiskColor(site.riskLevel) }}
                    >
                      {site.riskLevel}
                    </div>
                  </div>
                  
                  <div className="table-cell actions">
                    <div className="action-buttons">
                      {site.status === 'found' && (
                        <button className="btn btn-sm btn-primary">
                          <FaTrash /> Remove
                        </button>
                      )}
                      {site.status === 'in_progress' && (
                        <button className="btn btn-sm btn-secondary">
                          <FaClock /> Track
                        </button>
                      )}
                      {site.status === 'failed' && (
                        <button className="btn btn-sm btn-warning">
                          <FaExclamationTriangle /> Retry
                        </button>
                      )}
                      <button className="btn btn-sm btn-outline">
                        <FaEye /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="help-section">
          <h3>How Data Removal Works</h3>
          <div className="help-grid">
            <div className="help-card">
              <div className="help-icon">🔍</div>
              <h4>1. Discovery</h4>
              <p>We scan 500+ data broker sites to find where your personal information is listed.</p>
            </div>
            <div className="help-card">
              <div className="help-icon">📝</div>
              <h4>2. Request Removal</h4>
              <p>We automatically submit removal requests following each site's specific procedures.</p>
            </div>
            <div className="help-card">
              <div className="help-icon">🔄</div>
              <h4>3. Monitor Progress</h4>
              <p>We track the status of each removal request and follow up as needed.</p>
            </div>
            <div className="help-card">
              <div className="help-icon">✅</div>
              <h4>4. Verification</h4>
              <p>We verify that your information has been successfully removed from each site.</p>
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
};

export default DataRemovalDashboard;