import React, { useState, useEffect } from 'react';
import FeatureGate from '../components/FeatureGate';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import { useAuth } from '../hooks/useAuthUtils';
import { FaChrome, FaApple, FaWindows } from 'react-icons/fa';
import './VPNPage.css';

const VPNPage = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [downloadCounts, setDownloadCounts] = useState({
    chrome: 15234,
    mac: 8942,
    windows: 12657
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simulate live download counter updates
    const interval = setInterval(() => {
      setDownloadCounts(prev => ({
        chrome: prev.chrome + Math.floor(Math.random() * 3),
        mac: prev.mac + Math.floor(Math.random() * 2),
        windows: prev.windows + Math.floor(Math.random() * 4)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleChromeDownload = () => {
    // Redirect to Chrome Web Store
    window.open('https://chrome.google.com/webstore/category/extensions', '_blank');
  };

  const handleMacDownload = () => {
    // Future: Link to actual Mac VPN client
    alert('Mac VPN client download will be available soon! Thank you for your patience.');
  };

  const handleWindowsDownload = () => {
    // Future: Link to actual Windows VPN client
    alert('Windows VPN client download will be available soon! Thank you for your patience.');
  };

  // Temporarily bypass FeatureGate for development
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const vpnContent = (
    <div className="vpn-page">
        {/* Hero Section */}
        <div className="vpn-hero">
          <div className="hero-content">
            <div className="cyberforget-logo">
              <span className="logo-icon">🛡️</span>
              <span className="logo-text">CyberForget VPN</span>
            </div>
            <h1>Secure Your Digital Privacy</h1>
            <p className="hero-subtitle">
              Military-grade encryption meets seamless browsing. Protect your identity 
              and access the web without restrictions.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">256-bit</span>
                <span className="stat-label">Encryption</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Server Locations</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Zero</span>
                <span className="stat-label">Logs Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="download-section">
          <div className="section-header">
            <h2>Get CyberForget VPN</h2>
            <p>Choose your platform and start protecting your privacy today</p>
          </div>

          <div className="download-grid">
            {/* Chrome Extension */}
            <div className="download-card featured">
              <div className="card-header">
                <FaChrome className="platform-icon chrome-icon" />
                <h3>Chrome Extension</h3>
                <div className="featured-badge">Recommended</div>
              </div>
              <div className="card-content">
                <p>Quick and easy browser protection with one-click activation.</p>
                <div className="features-list">
                  <div className="feature-grid">
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">Instant browser protection</span>
                    </div>
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">Lightweight and fast</span>
                    </div>
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">Automatic threat blocking</span>
                    </div>
                  </div>
                </div>
                <div className="download-stats">
                  <span className="download-count">{downloadCounts.chrome.toLocaleString()} downloads</span>
                </div>
              </div>
              <div className="card-actions">
                <button 
                  className="download-btn primary"
                  onClick={handleChromeDownload}
                >
                  <span className="btn-icon">⬇️</span>
                  Add to Chrome
                </button>
                <p className="compatibility">Chrome 88+ required</p>
              </div>
            </div>

            {/* Mac Application */}
            <div className="download-card">
              <div className="card-header">
                <FaApple className="platform-icon apple-icon" />
                <h3>macOS Application</h3>
              </div>
              <div className="card-content">
                <p>Full system protection for Mac users with advanced features.</p>
                <div className="features-list">
                  <div className="feature-grid">
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">System-wide protection</span>
                    </div>
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">Kill switch technology</span>
                    </div>
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">DNS leak protection</span>
                    </div>
                  </div>
                </div>
                <div className="download-stats">
                  <span className="download-count">{downloadCounts.mac.toLocaleString()} downloads</span>
                </div>
              </div>
              <div className="card-actions">
                <button 
                  className="download-btn secondary"
                  onClick={handleMacDownload}
                >
                  <span className="btn-icon">⬇️</span>
                  Download for Mac
                </button>
                <p className="compatibility">macOS 10.15+ required</p>
              </div>
            </div>

            {/* Windows Application */}
            <div className="download-card">
              <div className="card-header">
                <FaWindows className="platform-icon windows-icon" />
                <h3>Windows Application</h3>
              </div>
              <div className="card-content">
                <p>Comprehensive Windows protection with enterprise-grade security.</p>
                <div className="features-list">
                  <div className="feature-grid">
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">Full device protection</span>
                    </div>
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">Split tunneling</span>
                    </div>
                    <div className="feature-bubble">
                      <span className="feature-icon">✅</span>
                      <span className="feature-text">Auto-connect on startup</span>
                    </div>
                  </div>
                </div>
                <div className="download-stats">
                  <span className="download-count">{downloadCounts.windows.toLocaleString()} downloads</span>
                </div>
              </div>
              <div className="card-actions">
                <button 
                  className="download-btn secondary"
                  onClick={handleWindowsDownload}
                >
                  <span className="btn-icon">⬇️</span>
                  Download for Windows
                </button>
                <p className="compatibility">Windows 10+ required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="section-header">
            <h2>Why Choose CyberForget VPN?</h2>
            <p>Advanced security features designed for privacy-conscious users</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Military-Grade Encryption</h3>
              <p>AES-256 encryption protects your data from even the most sophisticated attacks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Server Network</h3>
              <p>Connect to servers in 50+ countries for optimal speed and access to geo-restricted content.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚫</div>
              <h3>No-Logs Policy</h3>
              <p>We never track, store, or share your browsing activity. Your privacy is guaranteed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Optimized servers ensure minimal speed loss while maintaining maximum security.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Kill Switch Protection</h3>
              <p>Automatically blocks internet access if VPN connection drops, preventing data leaks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Easy Setup</h3>
              <p>One-click installation and automatic configuration. Start protecting yourself in minutes.</p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="security-section">
          <div className="security-content">
            <div className="security-text">
              <h2>Bank-Level Security Standards</h2>
              <p>
                CyberForget VPN uses the same encryption standards trusted by banks, 
                governments, and security professionals worldwide.
              </p>
              <div className="security-badges">
                <div className="badge">
                  <span className="badge-icon">🏆</span>
                  <span>AES-256 Encryption</span>
                </div>
                <div className="badge">
                  <span className="badge-icon">🔐</span>
                  <span>OpenVPN Protocol</span>
                </div>
                <div className="badge">
                  <span className="badge-icon">🛡️</span>
                  <span>DNS Leak Protection</span>
                </div>
                <div className="badge">
                  <span className="badge-icon">⚙️</span>
                  <span>Perfect Forward Secrecy</span>
                </div>
              </div>
            </div>
            <div className="security-visual">
              <div className="encryption-demo">
                <div className="data-flow">
                  <div className="data-point unencrypted">
                    <span>Your Data</span>
                  </div>
                  <div className="encryption-process">
                    <span>🔒 256-bit Encryption</span>
                  </div>
                  <div className="data-point encrypted">
                    <span>Protected Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Secure Your Privacy?</h2>
            <p>Join thousands of users who trust CyberForget VPN to protect their digital lives.</p>
            <div className="cta-buttons">
              <button 
                className="btn btn-primary large"
                onClick={handleChromeDownload}
              >
                Get Started with Chrome
              </button>
              <button className="btn btn-secondary large">
                Learn More About Premium
              </button>
            </div>
            <p className="cta-note">
              ✅ 30-day money-back guarantee &nbsp;&nbsp;
              ✅ 24/7 customer support &nbsp;&nbsp;
              ✅ No setup fees
            </p>
          </div>
        </div>
      </div>
  );

  return (
    <div className="page-container">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      {isDevelopment ? vpnContent : (
        <FeatureGate feature="vpn" showNavbar={false}>
          {vpnContent}
        </FeatureGate>
      )}
    </div>
  );
};

export default VPNPage;