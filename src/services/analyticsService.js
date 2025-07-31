// Google Analytics 4 Service for Admin Dashboard

class AnalyticsService {
  constructor() {
    this.isInitialized = false;
    this.measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
    this.debugMode = process.env.NODE_ENV === 'development';
  }

  // Initialize Google Analytics
  initialize() {
    if (this.isInitialized || !this.measurementId || this.measurementId === 'G-XXXXXXXXXX') {
      return;
    }

    try {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        debug_mode: this.debugMode,
        send_page_view: false // We'll handle page views manually
      });

      this.isInitialized = true;
      
      if (this.debugMode) {
        console.log('✅ Google Analytics initialized:', this.measurementId);
      }
    } catch (error) {
      console.error('❌ Failed to initialize Google Analytics:', error);
    }
  }

  // Track page views
  trackPageView(pagePath, pageTitle) {
    if (!this.isInitialized) return;

    try {
      window.gtag('config', this.measurementId, {
        page_path: pagePath,
        page_title: pageTitle,
      });

      if (this.debugMode) {
        console.log('📊 Page view tracked:', { pagePath, pageTitle });
      }
    } catch (error) {
      console.error('❌ Failed to track page view:', error);
    }
  }

  // Track admin dashboard events
  trackAdminEvent(action, category = 'admin_dashboard', label = null, value = null) {
    if (!this.isInitialized) return;

    try {
      const eventParams = {
        event_category: category,
        event_label: label,
        value: value,
        // Admin-specific custom parameters
        user_type: 'admin',
        dashboard_section: this.getCurrentDashboardSection()
      };

      // Remove null values
      Object.keys(eventParams).forEach(key => {
        if (eventParams[key] === null || eventParams[key] === undefined) {
          delete eventParams[key];
        }
      });

      window.gtag('event', action, eventParams);

      if (this.debugMode) {
        console.log('🎯 Admin event tracked:', { action, category, label, value, eventParams });
      }
    } catch (error) {
      console.error('❌ Failed to track admin event:', error);
    }
  }

  // Track specific admin dashboard actions
  trackUserExport(format = 'csv') {
    this.trackAdminEvent('export_users', 'data_management', `format_${format}`);
  }

  trackUserSearch(searchTerm) {
    this.trackAdminEvent('search_users', 'user_management', searchTerm);
  }

  trackScanSimulation(userId) {
    this.trackAdminEvent('simulate_scan', 'scan_management', `user_${userId}`);
  }

  trackThreatAddition(threatType, severity) {
    this.trackAdminEvent('add_threat', 'threat_management', `${threatType}_${severity}`);
  }

  trackRemovalQueue() {
    this.trackAdminEvent('view_removal_queue', 'data_removal');
  }

  trackRemovalStats() {
    this.trackAdminEvent('view_removal_stats', 'data_removal');
  }

  trackBrokerManagement(action, brokerName = null) {
    this.trackAdminEvent(action, 'broker_management', brokerName);
  }

  trackComplianceReport(reportType) {
    this.trackAdminEvent('view_compliance_report', 'compliance', reportType);
  }

  trackSystemHealth() {
    this.trackAdminEvent('check_system_health', 'system_monitoring');
  }

  trackPerformanceMetrics() {
    this.trackAdminEvent('view_performance_metrics', 'system_monitoring');
  }

  trackBillingOverview() {
    this.trackAdminEvent('view_billing_overview', 'financial_management');
  }

  trackRevenueReports() {
    this.trackAdminEvent('view_revenue_reports', 'financial_management');
  }

  trackSupportTickets() {
    this.trackAdminEvent('view_support_tickets', 'customer_support');
  }

  trackBulkCommunication(recipientCount) {
    this.trackAdminEvent('send_bulk_communication', 'customer_support', null, recipientCount);
  }

  trackSecurityAlerts() {
    this.trackAdminEvent('view_security_alerts', 'security_management');
  }

  trackEmergencyShutdown(reason) {
    this.trackAdminEvent('emergency_shutdown', 'security_management', reason);
  }

  trackAnalyticsDashboard() {
    this.trackAdminEvent('view_analytics_dashboard', 'business_intelligence');
  }

  trackCustomReports() {
    this.trackAdminEvent('create_custom_report', 'business_intelligence');
  }

  // Track admin session events
  trackAdminLogin(adminId) {
    this.trackAdminEvent('admin_login', 'authentication', `admin_${adminId}`);
  }

  trackAdminLogout(sessionDuration) {
    this.trackAdminEvent('admin_logout', 'authentication', null, sessionDuration);
  }

  trackDashboardLoad(loadTime) {
    this.trackAdminEvent('dashboard_load', 'performance', null, loadTime);
  }

  // Track admin errors
  trackAdminError(errorType, errorMessage, section) {
    this.trackAdminEvent('admin_error', 'errors', `${section}_${errorType}`, null);
    
    // Send additional error context
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: false,
      custom_map: {
        admin_section: section,
        error_type: errorType
      }
    });
  }

  // Helper method to get current dashboard section
  getCurrentDashboardSection() {
    const path = window.location.pathname;
    if (path.includes('/admin/users')) return 'user_management';
    if (path.includes('/admin/threats')) return 'threat_management';
    if (path.includes('/admin')) return 'admin_dashboard';
    return 'unknown';
  }

  // Track custom conversion events
  trackConversion(conversionType, value = null) {
    if (!this.isInitialized) return;

    try {
      window.gtag('event', 'conversion', {
        send_to: this.measurementId,
        event_category: 'admin_conversions',
        event_label: conversionType,
        value: value
      });

      if (this.debugMode) {
        console.log('💰 Conversion tracked:', { conversionType, value });
      }
    } catch (error) {
      console.error('❌ Failed to track conversion:', error);
    }
  }

  // Set custom user properties for admin users
  setAdminUserProperties(adminData) {
    if (!this.isInitialized) return;

    try {
      window.gtag('config', this.measurementId, {
        custom_map: {
          admin_role: adminData.role || 'admin',
          admin_department: adminData.department || 'general',
          admin_permissions: adminData.permissions?.join(',') || 'basic'
        }
      });

      // Set user properties
      window.gtag('set', {
        user_type: 'admin',
        user_role: adminData.role || 'admin'
      });

      if (this.debugMode) {
        console.log('👤 Admin user properties set:', adminData);
      }
    } catch (error) {
      console.error('❌ Failed to set admin user properties:', error);
    }
  }

  // Enhanced event tracking for admin dashboard metrics
  trackMetricView(metricType, metricValue) {
    this.trackAdminEvent('view_metric', 'dashboard_metrics', metricType, metricValue);
  }

  trackFilterUsage(filterType, filterValue) {
    this.trackAdminEvent('use_filter', 'dashboard_interaction', `${filterType}_${filterValue}`);
  }

  trackTimeRangeChange(timeRange) {
    this.trackAdminEvent('change_time_range', 'dashboard_interaction', timeRange);
  }

  trackDownload(downloadType, fileName) {
    this.trackAdminEvent('download_file', 'data_export', `${downloadType}_${fileName}`);
  }

  // Debug method to check if analytics is working
  testAnalytics() {
    if (this.debugMode) {
      console.log('🧪 Testing Analytics...');
      this.trackAdminEvent('test_event', 'debug', 'analytics_test', 1);
      console.log('✅ Test event sent');
    }
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;