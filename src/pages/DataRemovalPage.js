import React, { useState, useEffect } from 'react';
import FeatureGate from '../components/FeatureGate';
import { FaDatabase, FaShieldAlt, FaUserShield, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import './DataRemovalPage.css';

const DataRemovalPage = () => {
  const [removalStats, setRemovalStats] = useState({
    totalRemoved: 245789,
    sitesMonitored: 500,
    activeUsers: 89234
  });

  useEffect(() => {
    // Simulate live stats counter updates
    const interval = setInterval(() => {
      setRemovalStats(prev => ({
        totalRemoved: prev.totalRemoved + Math.floor(Math.random() * 10),
        sitesMonitored: 500,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    // Redirect to pricing page
    window.location.href = '/pricing';
  };

  // Temporarily bypass FeatureGate for development
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const dataRemovalContent = (
    <div className="data-removal-page">
        {/* Hero Section */}
        <div className="dr-hero">
          <div className="hero-content">
            <div className="cyberforget-logo">
              <span className="logo-icon">🛡️</span>
              <span className="logo-text">CyberForget Data Removal</span>
            </div>
            <h1>Take Back Control of Your Digital Identity</h1>
            <p className="hero-subtitle">
              Automatically remove your personal information from 500+ data broker sites. 
              Stop companies from selling your data and protect your privacy permanently.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Data Broker Sites</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Automated Monitoring</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Removal Success Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Alert Section */}
        <div className="threat-section">
          <div className="section-header">
            <h2>Your Data is Being Sold Right Now</h2>
            <p>Data brokers are profiting from your personal information</p>
          </div>

          <div className="threat-grid">
            <div className="threat-card">
              <FaExclamationTriangle className="threat-icon" />
              <h3>Personal Information Exposed</h3>
              <p>Your full name, address, phone number, email, and family members are publicly available for purchase</p>
            </div>
            <div className="threat-card">
              <FaExclamationTriangle className="threat-icon" />
              <h3>Identity Theft Risk</h3>
              <p>Criminals use data broker sites to gather information for identity theft and financial fraud</p>
            </div>
            <div className="threat-card">
              <FaExclamationTriangle className="threat-icon" />
              <h3>Unwanted Marketing</h3>
              <p>Your data is sold to marketers, resulting in spam calls, emails, and targeted advertising</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="process-section">
          <div className="section-header">
            <h2>How CyberForget Protects You</h2>
            <p>Our automated system works 24/7 to remove your data</p>
          </div>

          <div className="process-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Deep Web Scan</h3>
              <p>We scan 500+ data broker sites, people search engines, and public records to find your exposed information</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Automated Removal</h3>
              <p>Our AI-powered system submits opt-out requests and follows up until your data is completely removed</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Continuous Monitoring</h3>
              <p>We keep monitoring these sites 24/7 and immediately remove any new listings that appear</p>
            </div>
          </div>
        </div>

        {/* Sites We Remove From Section */}
        <div className="sites-section">
          <div className="section-header">
            <h2>500+ Sites We Remove You From</h2>
            <p>Including all major data brokers and people search engines</p>
          </div>

          <div className="sites-showcase">
            <div className="sites-categories">
              <div className="category-card">
                <h4>People Search Sites</h4>
                <ul>
                  <li>Whitepages</li>
                  <li>Spokeo</li>
                  <li>BeenVerified</li>
                  <li>TruePeopleSearch</li>
                  <li>Intelius</li>
                  <li>And 150+ more...</li>
                </ul>
              </div>
              <div className="category-card">
                <h4>Data Brokers</h4>
                <ul>
                  <li>Acxiom</li>
                  <li>Epsilon</li>
                  <li>CoreLogic</li>
                  <li>LexisNexis</li>
                  <li>Oracle Data Cloud</li>
                  <li>And 200+ more...</li>
                </ul>
              </div>
              <div className="category-card">
                <h4>Background Check Sites</h4>
                <ul>
                  <li>CheckPeople</li>
                  <li>InstantCheckmate</li>
                  <li>PublicRecordsNow</li>
                  <li>TruthFinder</li>
                  <li>PeopleLooker</li>
                  <li>And 100+ more...</li>
                </ul>
              </div>
            </div>
            <div className="removal-stats">
              <div className="stat-box">
                <FaDatabase className="stat-icon" />
                <h3>{removalStats.totalRemoved.toLocaleString()}</h3>
                <p>Total Records Removed</p>
              </div>
              <div className="stat-box">
                <FaUserShield className="stat-icon" />
                <h3>{removalStats.activeUsers.toLocaleString()}</h3>
                <p>Protected Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="section-header">
            <h2>Complete Privacy Protection</h2>
            <p>Advanced features to keep your data private</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Deep Web Scanning</h3>
              <p>Our AI scans the entire web, including hidden databases and cached pages to find all instances of your data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>Automated Removal</h3>
              <p>No manual work required. Our system handles all opt-out processes and follows up until completion.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Removal Reports</h3>
              <p>Get detailed reports showing exactly which sites had your data and when it was removed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Continuous Protection</h3>
              <p>Data brokers often re-list information. We monitor 24/7 and remove new listings automatically.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍👩‍👧‍👦</div>
              <h3>Family Protection</h3>
              <p>Protect your entire family with one account. Remove spouse and children's data too.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Identity Monitoring</h3>
              <p>Get alerts if your personal information appears on new sites or the dark web.</p>
            </div>
          </div>
        </div>

        {/* Included with Pro Section */}
        <div className="pro-section">
          <div className="section-header">
            <h2>Included with CyberForget Pro</h2>
            <p>Get complete data removal plus all premium security features</p>
          </div>

          <div className="pro-banner">
            <div className="pro-content">
              <div className="pro-icon">
                <FaShieldAlt className="shield-icon" />
              </div>
              <div className="pro-text">
                <h3>Full Data Removal Service Included</h3>
                <p>Remove your data from 500+ sites with CyberForget Pro</p>
                <div className="pro-features">
                  <h4>Everything in CyberForget Pro:</h4>
                  <div className="features-list">
                    <div className="feature-item">
                      <FaCheck /> 500+ Site Data Removal
                    </div>
                    <div className="feature-item">
                      <FaCheck /> Password Manager
                    </div>
                    <div className="feature-item">
                      <FaCheck /> VPN Protection
                    </div>
                    <div className="feature-item">
                      <FaCheck /> Ad Blocker
                    </div>
                    <div className="feature-item">
                      <FaCheck /> AI Security Assistant
                    </div>
                    <div className="feature-item">
                      <FaCheck /> Dark Web Monitoring
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pro-cta">
              <button 
                className="btn btn-primary large"
                onClick={handleGetStarted}
              >
                Get CyberForget Pro
              </button>
              <p className="price-note">Only $9.99/month for everything</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Stop Data Brokers from Selling Your Information</h2>
            <p>Join {removalStats.activeUsers.toLocaleString()} users who have taken back their privacy.</p>
            <div className="cta-buttons">
              <button 
                className="btn btn-primary large"
                onClick={handleGetStarted}
              >
                Start Protecting My Data
              </button>
              <button 
                className="btn btn-secondary large"
                onClick={handleGetStarted}
              >
                View All Features
              </button>
            </div>
            <p className="cta-note">
              <FaCheck /> No manual work required &nbsp;&nbsp;
              <FaCheck /> 30-day money-back guarantee &nbsp;&nbsp;
              <FaCheck /> Cancel anytime
            </p>
          </div>
        </div>
      </div>
  );

  return isDevelopment ? dataRemovalContent : (
    <FeatureGate feature="dataRemoval">
      {dataRemovalContent}
    </FeatureGate>
  );
};

export default DataRemovalPage;