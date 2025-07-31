import React, { useState, useEffect } from 'react';
import FeatureGate from '../components/FeatureGate';
import { FaLock, FaKey, FaShieldAlt, FaCheck } from 'react-icons/fa';
import './PasswordManagerPage.css';

const PasswordManagerPage = () => {
  const [userCounts, setUserCounts] = useState({
    total: 125478,
    business: 8942,
    personal: 116536
  });

  useEffect(() => {
    // Simulate live user counter updates
    const interval = setInterval(() => {
      setUserCounts(prev => ({
        total: prev.total + Math.floor(Math.random() * 5),
        business: prev.business + Math.floor(Math.random() * 2),
        personal: prev.personal + Math.floor(Math.random() * 3)
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
  
  const passwordManagerContent = (
    <div className="password-manager-page">
        {/* Hero Section */}
        <div className="pm-hero">
          <div className="hero-content">
            <div className="cyberforget-logo">
              <span className="logo-icon">🔐</span>
              <span className="logo-text">CyberForget Password Manager</span>
            </div>
            <h1>Password Security Made Simple</h1>
            <p className="hero-subtitle">
              Advanced password protection included with CyberForget Pro. 
              Store, generate, and autofill unlimited passwords across all your devices.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">256-bit</span>
                <span className="stat-label">AES Encryption</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Zero</span>
                <span className="stat-label">Knowledge Architecture</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Unlimited</span>
                <span className="stat-label">Passwords & Devices</span>
              </div>
            </div>
          </div>
        </div>

        {/* Included Features Section */}
        <div className="plans-section">
          <div className="section-header">
            <h2>Included with CyberForget Pro</h2>
            <p>Premium password management features at no extra cost</p>
          </div>

          <div className="included-banner">
            <div className="banner-content">
              <div className="banner-icon">
                <FaShieldAlt className="shield-icon" />
              </div>
              <div className="banner-text">
                <h3>Full Password Manager Access</h3>
                <p>All premium features included with your CyberForget Pro subscription</p>
                <div className="features-list">
                  <div className="feature-grid-wide">
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">Unlimited passwords</span>
                    </div>
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">All device sync</span>
                    </div>
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">Secure sharing</span>
                    </div>
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">2FA support</span>
                    </div>
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">Password generator</span>
                    </div>
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">Dark web monitoring</span>
                    </div>
                  </div>
                </div>
                <div className="pro-benefits">
                  <h4>Also Included in CyberForget Pro:</h4>
                  <ul>
                    <li>🛡️ VPN Protection</li>
                    <li>🚫 Ad Blocker</li>
                    <li>🔍 500+ Data Broker Scanning</li>
                    <li>🤖 AI Security Assistant</li>
                    <li>📊 Live Security Reports</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="banner-cta">
              <button 
                className="action-btn primary large"
                onClick={handleGetStarted}
              >
                Get CyberForget Pro
              </button>
              <p className="price-note">Starting at $9.99/month</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="section-header">
            <h2>Enterprise-Grade Password Security</h2>
            <p>Professional password management features included with CyberForget Pro</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Zero-Knowledge Encryption</h3>
              <p>Your master password never leaves your device. We can't see your data, even if we wanted to.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔑</div>
              <h3>Secure Password Generator</h3>
              <p>Create unique, unbreakable passwords for every account with customizable complexity.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Cross-Platform Sync</h3>
              <p>Access your passwords on Windows, Mac, iOS, Android, and all major browsers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Breach Monitoring</h3>
              <p>Get instant alerts if any of your passwords appear in known data breaches.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Secure Sharing</h3>
              <p>Share passwords safely with family or team members without revealing the actual password.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>One-Click Autofill</h3>
              <p>Log in to any website instantly with browser extensions and mobile keyboard integration.</p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="security-section">
          <div className="security-content">
            <div className="security-text">
              <h2>Your Passwords, Fort Knox Style</h2>
              <p>
                CyberForget uses the same encryption standards trusted by governments 
                and financial institutions worldwide to protect your passwords.
              </p>
              <div className="security-badges">
                <div className="badge">
                  <span className="badge-icon">🏆</span>
                  <span>SOC 2 Certified</span>
                </div>
                <div className="badge">
                  <span className="badge-icon">🔐</span>
                  <span>PBKDF2 SHA-256</span>
                </div>
                <div className="badge">
                  <span className="badge-icon">🛡️</span>
                  <span>End-to-End Encrypted</span>
                </div>
                <div className="badge">
                  <span className="badge-icon">⚙️</span>
                  <span>Open Source Audited</span>
                </div>
              </div>
            </div>
            <div className="security-visual">
              <div className="vault-demo">
                <div className="password-flow">
                  <div className="password-point weak">
                    <span>Weak Password</span>
                    <span className="example">password123</span>
                  </div>
                  <div className="vault-process">
                    <FaLock className="vault-icon" />
                    <span>CyberForget Vault</span>
                  </div>
                  <div className="password-point strong">
                    <span>Strong Password</span>
                    <span className="example">x#9Kp$mN@4wL!7qR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Get Complete Digital Protection</h2>
            <p>Join {userCounts.total.toLocaleString()} users protected by CyberForget Pro.</p>
            <div className="cta-buttons">
              <button 
                className="btn btn-primary large"
                onClick={handleGetStarted}
              >
                Start Your Free Trial
              </button>
              <button 
                className="btn btn-secondary large"
                onClick={handleGetStarted}
              >
                View Pricing Plans
              </button>
            </div>
            <p className="cta-note">
              <FaCheck /> Password Manager included &nbsp;&nbsp;
              <FaCheck /> 30-day money-back guarantee &nbsp;&nbsp;
              <FaCheck /> All Pro features unlocked
            </p>
          </div>
        </div>
      </div>
  );

  return isDevelopment ? passwordManagerContent : (
    <FeatureGate feature="passwordManager">
      {passwordManagerContent}
    </FeatureGate>
  );
};

export default PasswordManagerPage;