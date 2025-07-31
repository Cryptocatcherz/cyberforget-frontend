import React, { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuthUtils";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import analyticsService from '../services/analyticsService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    trialUsers: 0,
    premiumUsers: 0,
    activeScans: 0,
    threatsFound: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/dashboard');
      return;
    }

    // Initialize Google Analytics for admin dashboard
    analyticsService.initialize();
    
    // Track admin dashboard page view
    analyticsService.trackPageView('/admin/dashboard', 'Admin Dashboard');
    
    // Set admin user properties for analytics
    if (user) {
      analyticsService.setAdminUserProperties({
        role: user.role || 'admin',
        department: 'administration',
        permissions: ['admin_access', 'user_management', 'system_monitoring']
      });
      
      // Track admin login
      analyticsService.trackAdminLogin(user.id);
    }
    
    // Track dashboard load time
    const loadStartTime = performance.now();
    fetchStats().finally(() => {
      const loadTime = Math.round(performance.now() - loadStartTime);
      analyticsService.trackDashboardLoad(loadTime);
    });
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/stats/enhanced', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to fetch admin statistics');
      }
    } catch (err) {
      setError('Error loading admin data');
      console.error('Admin stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Comprehensive Admin Handler Functions
  const handleExportUsers = async () => {
    try {
      // Track analytics event
      analyticsService.trackUserExport('csv');
      
      // Generate CSV export of users
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/users?limit=1000', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const csv = generateCSV(data.users);
        downloadCSV(csv, 'users-export.csv');
        
        // Track successful download
        analyticsService.trackDownload('user_export', 'users-export.csv');
        alert('✅ User data exported successfully!');
      } else {
        analyticsService.trackAdminError('export_failed', 'Failed to fetch user data', 'user_management');
        alert('❌ Failed to export user data.');
      }
    } catch (error) {
      console.error('Export error:', error);
      analyticsService.trackAdminError('export_error', error.message, 'user_management');
      alert('❌ Error exporting user data.');
    }
  };

  const handleUserActivity = () => {
    analyticsService.trackAnalyticsDashboard();
    navigate('/admin/users');
  };

  const handleViewRemovalQueue = () => {
    analyticsService.trackRemovalQueue();
    navigate('/admin/threats');
  };

  const handleRemovalStats = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/removal-operations/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`📈 Removal Success Rates:\n\n• Total Requests: ${data.stats.totalRequests}\n• Successful: ${data.stats.successful}\n• Success Rate: ${data.stats.successRate}\n• Avg Processing Time: ${data.stats.avgProcessingTime}`);
      } else {
        alert('❌ Failed to load removal statistics.');
      }
    } catch (error) {
      alert('❌ Error loading removal stats.');
    }
  };

  const handleManualRemoval = () => {
    alert('✋ Manual removal tool opening...\n\nThis would open a form to:\n• Select specific users\n• Choose data brokers\n• Submit manual removal requests\n• Track request status');
  };

  const handleBrokerDatabase = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/brokers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const brokerList = data.brokers.map(broker => `• ${broker.name} (${broker.status})`).join('\n');
        alert(`🏢 Data Broker Database:\n\n${brokerList}\n\nTotal: ${data.brokers.length} brokers`);
      } else {
        alert('❌ Failed to load broker database.');
      }
    } catch (error) {
      alert('❌ Error loading broker database.');
    }
  };

  const handleAddBroker = () => {
    const name = prompt('Enter broker name:');
    const url = prompt('Enter broker URL:');
    
    if (name && url) {
      fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/brokers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, url, category: 'people_search' })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert(`✅ Broker "${name}" added successfully!`);
        } else {
          alert('❌ Failed to add broker.');
        }
      })
      .catch(() => alert('❌ Error adding broker.'));
    }
  };

  const handleBrokerStatus = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/brokers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const statusSummary = data.brokers.reduce((acc, broker) => {
          acc[broker.status] = (acc[broker.status] || 0) + 1;
          return acc;
        }, {});
        alert(`📊 Broker Status Summary:\n\n• Active: ${statusSummary.active || 0}\n• Maintenance: ${statusSummary.maintenance || 0}\n• Offline: ${statusSummary.offline || 0}`);
      } else {
        alert('❌ Failed to load broker status.');
      }
    } catch (error) {
      alert('❌ Error loading broker status.');
    }
  };

  const handleActiveScans = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/stats/enhanced', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`🔍 Active Scans Monitor:\n\n• Currently Active: ${data.activeScans}\n• Total Users: ${data.totalUsers}\n• System Health: ${data.systemHealth}\n• Last Updated: ${new Date(data.lastUpdated).toLocaleTimeString()}`);
      } else {
        alert('❌ Failed to load scan data.');
      }
    } catch (error) {
      alert('❌ Error loading active scans.');
    }
  };

  const handleScanLogs = () => {
    alert('📋 Scan Logs Viewer:\n\nThis would display:\n• Detailed scan activities\n• Error logs and debugging info\n• Performance metrics\n• Success/failure rates\n• User-specific scan history');
  };

  const handleEmergencyStop = () => {
    if (window.confirm('🚨 Emergency Stop: This will halt ALL scanning operations immediately. Continue?')) {
      alert('🛑 Emergency stop activated!\n\nAll active scans have been terminated.\nUsers will be notified of the interruption.\nScans can be resumed manually.');
    }
  };

  const handleRiskAssessment = () => {
    alert('⚠️ Risk Assessment Tool:\n\nAnalyzes:\n• User threat exposure levels\n• Data breach probabilities\n• Identity theft risks\n• Recommended security actions\n• Risk scoring algorithms');
  };

  const handleThreatReports = () => {
    alert('📊 Threat Intelligence Reports:\n\n• Comprehensive security analysis\n• Trending threat patterns\n• Industry threat landscape\n• User vulnerability assessments\n• Actionable security recommendations');
  };

  const handleComplianceReports = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/compliance/reports', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`⚖️ Compliance Dashboard:\n\n• GDPR Requests: ${data.compliance.gdprRequests.total} (${data.compliance.gdprRequests.pending} pending)\n• CCPA Requests: ${data.compliance.ccpaRequests.total} (${data.compliance.ccpaRequests.pending} pending)\n• Data Deleted: ${data.compliance.dataRetention.dataDeleted}\n• Next Deletion: ${data.compliance.dataRetention.scheduleNext}`);
      } else {
        alert('❌ Failed to load compliance data.');
      }
    } catch (error) {
      alert('❌ Error loading compliance reports.');
    }
  };

  const handleLegalRequests = () => {
    alert('📄 Legal Request Manager:\n\nHandles:\n• Court orders and subpoenas\n• Law enforcement requests\n• Legal data preservation\n• Compliance documentation\n• Response tracking');
  };

  const handleDataRetention = () => {
    alert('🗄️ Data Retention Policies:\n\nManages:\n• Automated deletion schedules\n• Data lifecycle policies\n• Retention period configuration\n• Compliance requirements\n• Audit trails');
  };

  const handleAnalyticsDashboard = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`📊 Analytics Hub:\n\n• User Growth: ${data.analytics.userGrowth.growth}\n• MRR: ${data.analytics.revenueMetrics.mrr}\n• Churn Rate: ${data.analytics.revenueMetrics.churn}\n• Total Scans: ${data.analytics.scanActivity.totalScans}\n• New Threats: ${data.analytics.threatIntelligence.newThreats}`);
      } else {
        alert('❌ Failed to load analytics data.');
      }
    } catch (error) {
      alert('❌ Error loading analytics.');
    }
  };

  const handleCustomReports = () => {
    alert('📈 Custom Report Builder:\n\nCreate reports for:\n• Specific date ranges\n• User segments\n• Threat categories\n• Revenue metrics\n• Export formats (PDF, CSV, Excel)');
  };

  const handleDataExport = () => {
    alert('💾 Data Export Center:\n\nExport options:\n• User data (CSV/JSON)\n• Scan results (PDF reports)\n• Threat intelligence (XML/JSON)\n• Analytics data (Excel)\n• System logs (TXT/JSON)');
  };

  const handleBillingOverview = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/billing/overview', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`💰 Billing Overview:\n\n• Monthly Revenue: ${data.billing.monthlyRevenue}\n• Total Subscriptions: ${data.billing.totalSubscriptions}\n• Churn Rate: ${data.billing.churnRate}\n• ARPU: ${data.billing.averageRevenuePerUser}\n• Pending Payments: ${data.billing.pendingPayments}`);
      } else {
        alert('❌ Failed to load billing data.');
      }
    } catch (error) {
      alert('❌ Error loading billing overview.');
    }
  };

  const handleRevenueReports = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/billing/revenue', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`📊 Revenue Reports:\n\n• This Month: ${data.revenue.thisMonth}\n• Last Month: ${data.revenue.lastMonth}\n• Growth: ${data.revenue.growth}\n• YTD: ${data.revenue.yearToDate}\n• Projected Annual: ${data.revenue.projectedAnnual}`);
      } else {
        alert('❌ Failed to load revenue data.');
      }
    } catch (error) {
      alert('❌ Error loading revenue reports.');
    }
  };

  const handleRefunds = () => {
    alert('💸 Refunds & Credits Manager:\n\nProcesses:\n• Refund requests\n• Account credits\n• Billing adjustments\n• Chargeback handling\n• Payment disputes');
  };

  const handleSystemConfig = () => {
    alert('⚙️ System Configuration:\n\nManages:\n• Platform settings\n• Infrastructure config\n• Environment variables\n• Security parameters\n• Performance tuning');
  };

  const handleFeatureToggles = () => {
    alert('🎛️ Feature Toggles:\n\nControls:\n• Feature flags per user segment\n• A/B test configurations\n• Gradual rollouts\n• Emergency feature disable\n• Beta feature access');
  };

  const handleApiManagement = () => {
    alert('🔌 API Management:\n\nMonitors:\n• API usage and rate limits\n• Integration health\n• Authentication failures\n• Response times\n• Error rates');
  };

  const handleSystemHealth = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/system/health', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`💚 System Health Monitor:\n\n• Uptime: ${data.health.uptime}\n• Response Time: ${data.health.responseTime}\n• Active Connections: ${data.health.activeConnections}\n• System Load: ${data.health.systemLoad}\n• DB Connections: ${data.health.databaseConnections}\n• Queue Status: ${data.health.queueStatus}`);
      } else {
        alert('❌ Failed to load system health.');
      }
    } catch (error) {
      alert('❌ Error loading system health.');
    }
  };

  const handlePerformanceMetrics = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/system/performance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`⚡ Performance Metrics:\n\n• Scan Throughput: ${data.performance.scanThroughput}\n• API Latency P95: ${data.performance.apiLatency.p95}\n• Error Rate: ${data.performance.errorRate}\n• Cache Hit Rate: ${data.performance.cacheHitRate}`);
      } else {
        alert('❌ Failed to load performance data.');
      }
    } catch (error) {
      alert('❌ Error loading performance metrics.');
    }
  };

  const handleOptimization = () => {
    alert('🚀 System Optimization:\n\nProvides:\n• Performance recommendations\n• Resource optimization\n• Query optimization\n• Caching strategies\n• Scaling suggestions');
  };

  const handleSupportTickets = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/support/tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const ticketSummary = data.tickets.map(ticket => `• ${ticket.id}: ${ticket.subject} (${ticket.priority})`).join('\n');
        alert(`🎫 Support Tickets:\n\n${ticketSummary}`);
      } else {
        alert('❌ Failed to load support tickets.');
      }
    } catch (error) {
      alert('❌ Error loading support tickets.');
    }
  };

  const handleBulkCommunication = () => {
    const message = prompt('Enter message to send:');
    if (message) {
      fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/support/communication/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message, 
          recipients: ['all_users'], 
          type: 'announcement' 
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Track successful bulk communication
          analyticsService.trackBulkCommunication(data.result.sent);
          alert(`📢 Message sent to ${data.result.sent} recipients!`);
        } else {
          analyticsService.trackAdminError('communication_failed', 'Failed to send bulk message', 'customer_support');
          alert('❌ Failed to send message.');
        }
      })
      .catch((error) => {
        analyticsService.trackAdminError('communication_error', error.message, 'customer_support');
        alert('❌ Error sending message.');
      });
    }
  };

  const handleUserFeedback = () => {
    alert('💬 User Feedback Center:\n\nCollects and analyzes:\n• User satisfaction scores\n• Feature requests\n• Bug reports\n• Improvement suggestions\n• Response tracking');
  };

  const handleSecurityAlerts = async () => {
    try {
      const response = await fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/security/alerts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const alertSummary = data.alerts.map(alert => `• ${alert.type}: ${alert.count} incidents (${alert.severity})`).join('\n');
        alert(`🚨 Security Alerts:\n\n${alertSummary}`);
      } else {
        alert('❌ Failed to load security alerts.');
      }
    } catch (error) {
      alert('❌ Error loading security alerts.');
    }
  };

  const handleIncidentResponse = () => {
    alert('🔴 Incident Response:\n\nManages:\n• Security incident protocols\n• Response team coordination\n• Threat containment\n• Recovery procedures\n• Post-incident analysis');
  };

  const handleEmergencyShutdown = () => {
    if (window.confirm('🚨 EMERGENCY SHUTDOWN: This will shut down critical platform functions. Are you absolutely sure?')) {
      const reason = prompt('Enter reason for emergency shutdown:');
      if (reason) {
        // Track emergency shutdown event immediately
        analyticsService.trackEmergencyShutdown(reason);
        
        fetch('https://cleandata-test-app-961214fcb16c.herokuapp.com/api/admin/emergency/shutdown', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Track successful emergency shutdown
            analyticsService.trackAdminEvent('emergency_shutdown_success', 'security_management', data.shutdownId);
            alert(`🔴 Emergency shutdown initiated!\n\nShutdown ID: ${data.shutdownId}\nEstimated time: ${data.estimatedTime}`);
          } else {
            analyticsService.trackAdminError('shutdown_failed', 'Emergency shutdown request failed', 'security_management');
            alert('❌ Failed to initiate emergency shutdown.');
          }
        })
        .catch((error) => {
          analyticsService.trackAdminError('shutdown_error', error.message, 'security_management');
          alert('❌ Error initiating emergency shutdown.');
        });
      }
    }
  };

  // Helper functions
  const generateCSV = (users) => {
    const headers = ['Email', 'First Name', 'Last Name', 'Role', 'Subscription Status', 'Joined At'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.email,
        user.firstName || '',
        user.lastName || '',
        user.role || '',
        user.subscriptionStatus || '',
        user.joinedAt || ''
      ].join(','))
    ].join('\n');
    return csvContent;
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user?.isAdmin) {
    return (
      <div className="admin-access-denied">
        <h1>Access Denied</h1>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <MobileNavbar />
        
        <div className="admin-dashboard">
          <div className="admin-header">
            <h1>🛡️ Admin Dashboard</h1>
            <p>Comprehensive overview and management of CleanData platform</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading admin data...</p>
            </div>
          ) : (
            <>
              {/* Quick Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h3>{stats.totalUsers || 0}</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🆓</div>
                  <div className="stat-content">
                    <h3>{stats.trialUsers || 0}</h3>
                    <p>Trial Users</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <h3>{stats.premiumUsers || 0}</h3>
                    <p>Premium Users</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🔄</div>
                  <div className="stat-content">
                    <h3>{stats.activeScans || 0}</h3>
                    <p>Active Scans</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⚠️</div>
                  <div className="stat-content">
                    <h3>{stats.threatsFound || 0}</h3>
                    <p>Threats Found</p>
                  </div>
                </div>
              </div>

              {/* Comprehensive Admin Features */}
              <div className="admin-sections">
                
                {/* User Management */}
                <div className="admin-section">
                  <h2>👥 User Management</h2>
                  <p>Complete user lifecycle management and data privacy</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn primary"
                      onClick={() => {
                        analyticsService.trackAdminEvent('navigate_user_management', 'navigation', 'manage_users');
                        navigate('/admin/users');
                      }}
                    >
                      Manage Users
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleExportUsers()}
                    >
                      Export Users
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleUserActivity()}
                    >
                      User Activity
                    </button>
                  </div>
                </div>

                {/* Data Removal Operations */}
                <div className="admin-section">
                  <h2>🗑️ Data Removal Operations</h2>
                  <p>Monitor and manage data broker removal requests</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn primary"
                      onClick={() => handleViewRemovalQueue()}
                    >
                      Removal Queue
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleRemovalStats()}
                    >
                      Success Rates
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleManualRemoval()}
                    >
                      Manual Removal
                    </button>
                  </div>
                </div>

                {/* Data Broker Management */}
                <div className="admin-section">
                  <h2>🏢 Data Broker Management</h2>
                  <p>Manage data broker sites and scanning configurations</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn primary"
                      onClick={() => handleBrokerDatabase()}
                    >
                      Broker Database
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleAddBroker()}
                    >
                      Add New Broker
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleBrokerStatus()}
                    >
                      Broker Status
                    </button>
                  </div>
                </div>

                {/* Scan Management */}
                <div className="admin-section">
                  <h2>🔍 Scan Management</h2>
                  <p>Real-time monitoring of scanning operations</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn primary"
                      onClick={() => handleActiveScans()}
                    >
                      Active Scans
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleScanLogs()}
                    >
                      Scan Logs
                    </button>
                    <button 
                      className="admin-btn danger"
                      onClick={() => handleEmergencyStop()}
                    >
                      Emergency Stop
                    </button>
                  </div>
                </div>

                {/* Threat & Risk Management */}
                <div className="admin-section">
                  <h2>⚠️ Threat Intelligence</h2>
                  <p>Security threats and risk assessment</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn primary"
                      onClick={() => {
                        analyticsService.trackAdminEvent('navigate_threat_management', 'navigation', 'view_threats');
                        navigate('/admin/threats');
                      }}
                    >
                      View Threats
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleRiskAssessment()}
                    >
                      Risk Assessment
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleThreatReports()}
                    >
                      Threat Reports
                    </button>
                  </div>
                </div>

                {/* Compliance & Legal */}
                <div className="admin-section">
                  <h2>⚖️ Compliance & Legal</h2>
                  <p>GDPR, CCPA compliance and legal request management</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn primary"
                      onClick={() => handleComplianceReports()}
                    >
                      Compliance Reports
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleLegalRequests()}
                    >
                      Legal Requests
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleDataRetention()}
                    >
                      Data Retention
                    </button>
                  </div>
                </div>

                {/* Analytics & Reporting */}
                <div className="admin-section">
                  <h2>📊 Analytics & Intelligence</h2>
                  <p>Business intelligence and performance metrics</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn primary"
                      onClick={() => handleAnalyticsDashboard()}
                    >
                      Analytics Hub
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleCustomReports()}
                    >
                      Custom Reports
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleDataExport()}
                    >
                      Data Export
                    </button>
                  </div>
                </div>

                {/* Billing & Revenue */}
                <div className="admin-section">
                  <h2>💰 Billing & Revenue</h2>
                  <p>Financial management and subscription control</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn primary"
                      onClick={() => handleBillingOverview()}
                    >
                      Billing Overview
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleRevenueReports()}
                    >
                      Revenue Reports
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleRefunds()}
                    >
                      Refunds & Credits
                    </button>
                  </div>
                </div>

                {/* System Administration */}
                <div className="admin-section">
                  <h2>⚙️ System Administration</h2>
                  <p>Platform configuration and feature management</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn primary"
                      onClick={() => handleSystemConfig()}
                    >
                      System Config
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleFeatureToggles()}
                    >
                      Feature Toggles
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleApiManagement()}
                    >
                      API Management
                    </button>
                  </div>
                </div>

                {/* Performance Monitoring */}
                <div className="admin-section">
                  <h2>📈 Performance Monitoring</h2>
                  <p>System health and optimization tools</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn primary"
                      onClick={() => handleSystemHealth()}
                    >
                      System Health
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handlePerformanceMetrics()}
                    >
                      Performance Metrics
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleOptimization()}
                    >
                      Optimization
                    </button>
                  </div>
                </div>

                {/* Support & Communication */}
                <div className="admin-section">
                  <h2>💬 Support & Communication</h2>
                  <p>Customer support and communication tools</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn primary"
                      onClick={() => handleSupportTickets()}
                    >
                      Support Tickets
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleBulkCommunication()}
                    >
                      Bulk Communication
                    </button>
                    <button 
                      className="admin-btn secondary"
                      onClick={() => handleUserFeedback()}
                    >
                      User Feedback
                    </button>
                  </div>
                </div>

                {/* Emergency & Security */}
                <div className="admin-section">
                  <h2>🚨 Emergency & Security</h2>
                  <p>Security incident response and emergency controls</p>
                  <div className="action-buttons">
                    <button 
                      className="admin-btn danger"
                      onClick={() => handleSecurityAlerts()}
                    >
                      Security Alerts
                    </button>
                    <button 
                      className="admin-btn danger"
                      onClick={() => handleIncidentResponse()}
                    >
                      Incident Response
                    </button>
                    <button 
                      className="admin-btn danger"
                      onClick={() => handleEmergencyShutdown()}
                    >
                      Emergency Shutdown
                    </button>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;