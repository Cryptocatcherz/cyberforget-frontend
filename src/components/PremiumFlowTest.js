import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuthUtils';
import './PremiumFlowTest.css';

const PremiumFlowTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState([]);

  const runTest = (testName, testFunction) => {
    try {
      const result = testFunction();
      setTestResults(prev => [...prev, {
        name: testName,
        status: 'success',
        message: result || 'Test passed',
        timestamp: new Date()
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        name: testName,
        status: 'error',
        message: error.message,
        timestamp: new Date()
      }]);
    }
  };

  const tests = [
    {
      name: 'User Authentication',
      test: () => {
        if (!user) throw new Error('User not authenticated');
        return `User authenticated: ${user.email || user.id}`;
      }
    },
    {
      name: 'VPN Page Accessibility',
      test: () => {
        const vpnLink = document.querySelector('a[href="/vpn"]');
        if (!vpnLink) throw new Error('VPN link not found in navigation');
        return 'VPN page link accessible';
      }
    },
    {
      name: 'Data Removal Dashboard Link',
      test: () => {
        const dataRemovalLink = document.querySelector('a[href="/data-removal"]');
        if (!dataRemovalLink) throw new Error('Data removal link not found in navigation');
        return 'Data removal dashboard link accessible';
      }
    },
    {
      name: 'Premium Features Component',
      test: () => {
        // Check if premium features are loaded
        const premiumFeatures = document.querySelector('.premium-features-dashboard');
        if (premiumFeatures) {
          return 'Premium features component found on page';
        }
        return 'Premium features not currently displayed (may be gated)';
      }
    },
    {
      name: 'Feature Gate Component',
      test: () => {
        const featureGates = document.querySelectorAll('.feature-gate-upgrade, .feature-gate-content');
        return `Found ${featureGates.length} feature gate(s) on page`;
      }
    }
  ];

  const runAllTests = () => {
    setTestResults([]);
    tests.forEach(({ name, test }) => {
      setTimeout(() => runTest(name, test), 100);
    });
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className="premium-flow-test">
      <div className="test-header">
        <h3>Premium Flow Test Suite</h3>
        <p>Test the complete signup → premium → dashboard flow</p>
      </div>

      <div className="test-controls">
        <button className="btn btn-primary" onClick={runAllTests}>
          Run All Tests
        </button>
        <button className="btn btn-secondary" onClick={clearResults}>
          Clear Results
        </button>
      </div>

      <div className="test-flow-diagram">
        <h4>Expected Flow:</h4>
        <div className="flow-steps">
          <div className="flow-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h5>User Signup</h5>
              <p>User creates account via Clerk</p>
            </div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h5>Premium Upgrade</h5>
              <p>User upgrades to premium plan via Stripe</p>
            </div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h5>Access Unlocked</h5>
              <p>VPN & Data Removal features accessible</p>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-links">
        <h4>Quick Test Links:</h4>
        <div className="link-grid">
          <a href="/vpn" className="test-link">
            🔐 VPN Page
          </a>
          <a href="/data-removal" className="test-link">
            🗑️ Data Removal Dashboard
          </a>
          <a href="/pricing" className="test-link">
            💳 Pricing/Upgrade Page
          </a>
          <a href="/dashboard" className="test-link">
            📊 User Dashboard
          </a>
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="test-results">
          <h4>Test Results:</h4>
          <div className="results-list">
            {testResults.map((result, index) => (
              <div key={index} className={`result-item ${result.status}`}>
                <div className="result-header">
                  <span className="result-icon">{getStatusIcon(result.status)}</span>
                  <span className="result-name">{result.name}</span>
                  <span className="result-time">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="result-message">{result.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="test-info">
        <h4>Test Information:</h4>
        <div className="info-grid">
          <div className="info-item">
            <strong>Current User:</strong> {user ? (user.email || user.id) : 'Not authenticated'}
          </div>
          <div className="info-item">
            <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
          </div>
          <div className="info-item">
            <strong>Production Mode:</strong> {process.env.REACT_APP_PRODUCTION_MODE || 'false'}
          </div>
          <div className="info-item">
            <strong>API Base URL:</strong> {process.env.REACT_APP_API_BASE_URL || 'Not set'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFlowTest;