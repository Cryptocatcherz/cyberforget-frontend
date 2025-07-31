import React, { useState, useEffect } from 'react';
import './RemovalDashboard.css';

const RemovalDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [siteMapping, setSiteMapping] = useState([]);
  const [userQueue, setUserQueue] = useState([]);
  const [pendingEmails, setPendingEmails] = useState([]);
  const [removalRequests, setRemovalRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadSiteMapping(),
        loadUserQueue(),
        loadPendingEmails(),
        loadRemovalRequests(),
        loadAnalytics()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSiteMapping = async () => {
    // Mock data - replace with actual API calls
    setSiteMapping([
      {
        siteName: 'FastPeopleSearch.com',
        status: 'active',
        successRate: 85,
        difficulty: 'easy',
        lastUpdated: '2024-01-15',
        totalRequests: 156,
        successfulRemovals: 133,
        avgResponseTime: 7,
        strategy: 'form'
      },
      {
        siteName: 'TruePeopleSearch.com',
        status: 'active',
        successRate: 70,
        difficulty: 'medium',
        lastUpdated: '2024-01-14',
        totalRequests: 89,
        successfulRemovals: 62,
        avgResponseTime: 14,
        strategy: 'email'
      },
      {
        siteName: 'Spokeo.com',
        status: 'problematic',
        successRate: 45,
        difficulty: 'hard',
        lastUpdated: '2024-01-10',
        totalRequests: 67,
        successfulRemovals: 30,
        avgResponseTime: 21,
        strategy: 'form'
      }
    ]);
  };

  const loadUserQueue = async () => {
    setUserQueue([
      {
        id: 'usr_001',
        email: 'john@example.com',
        name: 'John Smith',
        status: 'scan_complete',
        scanId: 'scan_123',
        sitesScanned: 42,
        sitesWithData: 8,
        priority: 'high',
        createdAt: '2024-01-15T10:30:00Z',
        estimatedCompletion: '2024-01-22T00:00:00Z'
      },
      {
        id: 'usr_002', 
        email: 'jane@example.com',
        name: 'Jane Doe',
        status: 'removal_in_progress',
        scanId: 'scan_124',
        sitesScanned: 42,
        sitesWithData: 12,
        priority: 'medium',
        createdAt: '2024-01-14T15:45:00Z',
        estimatedCompletion: '2024-01-28T00:00:00Z'
      }
    ]);
  };

  const loadPendingEmails = async () => {
    setPendingEmails([
      {
        id: 'email_001',
        userId: 'usr_001',
        userEmail: 'john@example.com',
        userName: 'John Smith',
        reportId: 'rpt_123',
        priority: 'high',
        createdAt: '2024-01-15T11:00:00Z',
        riskLevel: 'High',
        sitesWithData: 8,
        urgentActions: 4
      }
    ]);
  };

  const loadRemovalRequests = async () => {
    setRemovalRequests([
      {
        id: 'req_001',
        userId: 'usr_002',
        siteName: 'FastPeopleSearch.com',
        strategy: 'form',
        status: 'submitted',
        priority: 'high',
        createdAt: '2024-01-14T16:00:00Z',
        expectedResponse: '2024-01-21T00:00:00Z',
        confidence: 85
      },
      {
        id: 'req_002',
        userId: 'usr_002',
        siteName: 'Spokeo.com',
        strategy: 'form',
        status: 'pending_manual',
        priority: 'medium',
        createdAt: '2024-01-14T16:05:00Z',
        expectedResponse: '2024-01-28T00:00:00Z',
        confidence: 45
      }
    ]);
  };

  const loadAnalytics = async () => {
    setAnalytics({
      totalUsers: 1247,
      activeScans: 23,
      pendingRemovals: 89,
      completedRemovals: 456,
      successRate: 78,
      avgRemovalTime: 18,
      monthlyGrowth: 15
    });
  };

  const handleApproveEmail = async (emailId) => {
    try {
      // API call to approve email
      console.log('Approving email:', emailId);
      // Remove from pending list
      setPendingEmails(prev => prev.filter(email => email.id !== emailId));
    } catch (error) {
      console.error('Failed to approve email:', error);
    }
  };

  const handleRejectEmail = async (emailId, reason) => {
    try {
      // API call to reject email
      console.log('Rejecting email:', emailId, reason);
      setPendingEmails(prev => prev.filter(email => email.id !== emailId));
    } catch (error) {
      console.error('Failed to reject email:', error);
    }
  };

  const handleManualRemoval = async (requestId) => {
    try {
      // API call to execute manual removal
      console.log('Executing manual removal:', requestId);
      setRemovalRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'manual_submitted' }
            : req
        )
      );
    } catch (error) {
      console.error('Failed to execute manual removal:', error);
    }
  };

  const renderOverview = () => (
    <div className="overview-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{analytics?.totalUsers}</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-change">+{analytics?.monthlyGrowth}% this month</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <div className="stat-number">{analytics?.activeScans}</div>
            <div className="stat-label">Active Scans</div>
            <div className="stat-change">Real-time</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <div className="stat-number">{pendingEmails.length}</div>
            <div className="stat-label">Pending Emails</div>
            <div className="stat-change">Needs approval</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{analytics?.successRate}%</div>
            <div className="stat-label">Success Rate</div>
            <div className="stat-change">Last 30 days</div>
          </div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-section">
          <h3>Recent User Activity</h3>
          <div className="activity-list">
            {userQueue.slice(0, 5).map(user => (
              <div key={user.id} className="activity-item">
                <div className="activity-user">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <div className="activity-status">
                  <span className={`status-badge ${user.status}`}>
                    {user.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-section">
          <h3>Site Performance</h3>
          <div className="site-performance">
            {siteMapping.slice(0, 5).map(site => (
              <div key={site.siteName} className="performance-item">
                <div className="performance-site">
                  <strong>{site.siteName}</strong>
                  <span>{site.strategy}</span>
                </div>
                <div className="performance-rate">
                  <div className="rate-bar">
                    <div 
                      className="rate-fill" 
                      style={{ width: `${site.successRate}%` }}
                    ></div>
                  </div>
                  <span>{site.successRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSiteMapping = () => (
    <div className="site-mapping-content">
      <div className="section-header">
        <h3>Data Broker Site Management</h3>
        <button className="btn-primary">Add New Site</button>
      </div>
      
      <div className="sites-grid">
        {siteMapping.map(site => (
          <div key={site.siteName} className="site-card">
            <div className="site-header">
              <h4>{site.siteName}</h4>
              <span className={`status-indicator ${site.status}`}></span>
            </div>
            
            <div className="site-metrics">
              <div className="metric">
                <span className="metric-value">{site.successRate}%</span>
                <span className="metric-label">Success Rate</span>
              </div>
              <div className="metric">
                <span className="metric-value">{site.avgResponseTime}d</span>
                <span className="metric-label">Avg Response</span>
              </div>
              <div className="metric">
                <span className="metric-value">{site.totalRequests}</span>
                <span className="metric-label">Total Requests</span>
              </div>
            </div>
            
            <div className="site-details">
              <div className="detail-row">
                <span>Strategy:</span>
                <span className={`strategy-badge ${site.strategy}`}>
                  {site.strategy}
                </span>
              </div>
              <div className="detail-row">
                <span>Difficulty:</span>
                <span className={`difficulty-badge ${site.difficulty}`}>
                  {site.difficulty}
                </span>
              </div>
              <div className="detail-row">
                <span>Last Updated:</span>
                <span>{new Date(site.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="site-actions">
              <button className="btn-secondary">Edit Config</button>
              <button className="btn-secondary">Test Connection</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUserQueue = () => (
    <div className="user-queue-content">
      <div className="section-header">
        <h3>User Request Queue</h3>
        <div className="queue-filters">
          <select className="filter-select">
            <option>All Statuses</option>
            <option>Scan Complete</option>
            <option>Removal In Progress</option>
            <option>Pending Review</option>
          </select>
          <select className="filter-select">
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>
      
      <div className="queue-table">
        <div className="table-header">
          <div>User</div>
          <div>Status</div>
          <div>Sites Found</div>
          <div>Priority</div>
          <div>Created</div>
          <div>Est. Completion</div>
          <div>Actions</div>
        </div>
        
        {userQueue.map(user => (
          <div key={user.id} className="table-row">
            <div className="user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <div>
              <span className={`status-badge ${user.status}`}>
                {user.status.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="sites-count">
                {user.sitesWithData}/{user.sitesScanned}
              </span>
            </div>
            <div>
              <span className={`priority-badge ${user.priority}`}>
                {user.priority}
              </span>
            </div>
            <div>{new Date(user.createdAt).toLocaleDateString()}</div>
            <div>{new Date(user.estimatedCompletion).toLocaleDateString()}</div>
            <div className="action-buttons">
              <button className="btn-small">View Report</button>
              <button className="btn-small">Start Removal</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmailApproval = () => (
    <div className="email-approval-content">
      <div className="section-header">
        <h3>Email Approval Queue</h3>
        <div className="approval-stats">
          <span>Pending: {pendingEmails.length}</span>
        </div>
      </div>
      
      <div className="email-queue">
        {pendingEmails.map(email => (
          <div key={email.id} className="email-card">
            <div className="email-header">
              <div className="email-user">
                <h4>{email.userName}</h4>
                <span>{email.userEmail}</span>
              </div>
              <div className="email-priority">
                <span className={`priority-badge ${email.priority}`}>
                  {email.priority} priority
                </span>
              </div>
            </div>
            
            <div className="email-summary">
              <div className="summary-item">
                <span>Risk Level:</span>
                <span className={`risk-badge ${email.riskLevel.toLowerCase()}`}>
                  {email.riskLevel}
                </span>
              </div>
              <div className="summary-item">
                <span>Sites with Data:</span>
                <span>{email.sitesWithData}</span>
              </div>
              <div className="summary-item">
                <span>Urgent Actions:</span>
                <span>{email.urgentActions}</span>
              </div>
            </div>
            
            <div className="email-preview">
              <h5>Email Preview:</h5>
              <p>Your CleanData Privacy Report - {email.sitesWithData} Sites Analyzed</p>
              <p>Report includes {email.urgentActions} urgent actions for {email.riskLevel.toLowerCase()} risk exposure.</p>
            </div>
            
            <div className="email-actions">
              <button 
                className="btn-approve"
                onClick={() => handleApproveEmail(email.id)}
              >
                ✓ Approve & Send
              </button>
              <button 
                className="btn-reject"
                onClick={() => handleRejectEmail(email.id, 'Manual review required')}
              >
                ✗ Reject
              </button>
              <button className="btn-secondary">Preview Full Email</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRemovalRequests = () => (
    <div className="removal-requests-content">
      <div className="section-header">
        <h3>Active Removal Requests</h3>
        <button className="btn-primary">Generate AI Requests</button>
      </div>
      
      <div className="requests-table">
        <div className="table-header">
          <div>Site</div>
          <div>User</div>
          <div>Strategy</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Confidence</div>
          <div>Expected Response</div>
          <div>Actions</div>
        </div>
        
        {removalRequests.map(request => (
          <div key={request.id} className="table-row">
            <div>{request.siteName}</div>
            <div>{request.userId}</div>
            <div>
              <span className={`strategy-badge ${request.strategy}`}>
                {request.strategy}
              </span>
            </div>
            <div>
              <span className={`status-badge ${request.status}`}>
                {request.status.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className={`priority-badge ${request.priority}`}>
                {request.priority}
              </span>
            </div>
            <div>{request.confidence}%</div>
            <div>{new Date(request.expectedResponse).toLocaleDateString()}</div>
            <div className="action-buttons">
              {request.status === 'pending_manual' && (
                <button 
                  className="btn-execute"
                  onClick={() => handleManualRemoval(request.id)}
                >
                  🚀 Execute Manual
                </button>
              )}
              <button className="btn-small">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="removal-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="removal-dashboard">
      <div className="dashboard-header">
        <h1>CleanData Removal Dashboard</h1>
        <div className="header-actions">
          <button className="btn-secondary">Export Reports</button>
          <button className="btn-primary">New Scan</button>
        </div>
      </div>
      
      <div className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'sites' ? 'active' : ''}`}
          onClick={() => setActiveTab('sites')}
        >
          🗺️ Site Mapping
        </button>
        <button 
          className={`nav-tab ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          👥 User Queue
        </button>
        <button 
          className={`nav-tab ${activeTab === 'emails' ? 'active' : ''}`}
          onClick={() => setActiveTab('emails')}
        >
          📧 Email Approval ({pendingEmails.length})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'removals' ? 'active' : ''}`}
          onClick={() => setActiveTab('removals')}
        >
          🎯 Removal Requests
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'sites' && renderSiteMapping()}
        {activeTab === 'queue' && renderUserQueue()}
        {activeTab === 'emails' && renderEmailApproval()}
        {activeTab === 'removals' && renderRemovalRequests()}
      </div>
    </div>
  );
};

export default RemovalDashboard;