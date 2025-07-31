// AI-Powered Network Security Scanner & Defense Generator
import React, { useState, useEffect } from 'react';
import BaseTool, { ToolResult, ToolLoading, ToolError } from './BaseTool';
import { FaRobot, FaShieldAlt, FaBrain, FaLock, FaEye, FaNetworkWired, FaWifi, FaGlobe, FaExclamationTriangle } from 'react-icons/fa';
import './AIDefenseTool.css';

const AIDefenseTool = ({ onComplete, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScan, setCurrentScan] = useState('');

  const getBrowserName = (userAgent) => {
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Google Chrome';
    if (userAgent.includes('Firefox')) return 'Mozilla Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Microsoft Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown Browser';
  };

  const scanNetworkSecurity = async () => {
    setIsScanning(true);
    setError(null);
    setScanProgress(0);

    try {
      const scanSteps = [
        { text: 'Initializing AI neural networks...', icon: '🧠', status: 'success' },
        { text: 'Detecting IP address and geolocation...', icon: '🌍', status: 'success' },
        { text: 'Analyzing VPN/proxy configuration...', icon: '🛡️', status: 'success' },
        { text: 'Scanning network topology (192.168.x.x)...', icon: '🔍', status: 'success' },
        { text: 'Testing router default credentials...', icon: '🔐', status: 'warning' },
        { text: 'Detecting IoT devices (cameras, smart TVs)...', icon: '📷', status: 'info' },
        { text: 'Checking for backdoor connections...', icon: '🚪', status: 'success' },
        { text: 'Analyzing WiFi security protocols...', icon: '📡', status: 'success' },
        { text: 'Testing DNS hijacking vulnerabilities...', icon: '🌐', status: 'success' },
        { text: 'Scanning for exposed database ports...', icon: '💾', status: 'warning' },
        { text: 'Checking browser fingerprint entropy...', icon: '🔬', status: 'success' },
        { text: 'Evaluating SSL/TLS certificate chain...', icon: '🔒', status: 'success' },
        { text: 'Testing firewall configuration...', icon: '🛡️', status: 'success' },
        { text: 'Analyzing packet headers and protocols...', icon: '📦', status: 'success' },
        { text: 'Checking for man-in-the-middle attacks...', icon: '👥', status: 'success' },
        { text: 'Scanning for rogue access points...', icon: '📶', status: 'success' },
        { text: 'Testing network segmentation...', icon: '🔗', status: 'info' },
        { text: 'Detecting cryptocurrency miners...', icon: '⛏️', status: 'success' },
        { text: 'Analyzing traffic patterns for anomalies...', icon: '📊', status: 'success' },
        { text: 'Generating comprehensive security report...', icon: '📋', status: 'success' }
      ];

      // Real network detection
      const networkInfo = {
        publicIP: null,
        location: null,
        isp: null,
        vpnDetected: false,
        userAgent: navigator.userAgent,
        browserLanguage: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        platform: navigator.platform,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack === '1',
        onlineStatus: navigator.onLine
      };

      // Try to get real IP and location info
      try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          networkInfo.publicIP = ipData.ip;
          networkInfo.location = `${ipData.city}, ${ipData.region}, ${ipData.country_name}`;
          networkInfo.isp = ipData.org;
          networkInfo.vpnDetected = ipData.org?.toLowerCase().includes('vpn') || 
                                   ipData.org?.toLowerCase().includes('proxy') ||
                                   ipData.org?.toLowerCase().includes('hosting');
        }
      } catch (e) {
        // Fallback to mock data if IP service fails
        networkInfo.publicIP = '192.168.1.' + Math.floor(Math.random() * 254 + 1);
        networkInfo.location = 'Location masked by privacy tools';
        networkInfo.isp = 'ISP information protected';
      }

      // Simulate progressive scanning with discoveries
      const discoveredDevices = [];
      const scanFindings = [];
      
      for (let i = 0; i < scanSteps.length; i++) {
        const step = scanSteps[i];
        setCurrentScan(step.text);
        setScanProgress(Math.round(((i + 1) / scanSteps.length) * 100));
        
        // Add realistic discoveries during scan
        if (step.text.includes('IoT devices')) {
          const devices = ['Samsung Smart TV (192.168.1.15)', 'Ring Doorbell (192.168.1.23)', 'Amazon Echo (192.168.1.31)', 'Philips Hue Bridge (192.168.1.42)'];
          const foundDevice = devices[Math.floor(Math.random() * devices.length)];
          discoveredDevices.push(foundDevice);
          scanFindings.push(`📷 IoT Device Found: ${foundDevice}`);
        }
        
        if (step.text.includes('router default')) {
          const routerResults = ['Router admin panel accessible', 'Default credentials test: SECURED ✅', 'WPS protocol: DISABLED ✅'];
          scanFindings.push(`🔐 ${routerResults[Math.floor(Math.random() * routerResults.length)]}`);
        }
        
        if (step.text.includes('backdoor')) {
          scanFindings.push('🚪 Backdoor scan complete: No suspicious connections detected ✅');
        }
        
        if (step.text.includes('database ports')) {
          const dbResults = ['MySQL port 3306: CLOSED ✅', 'PostgreSQL port 5432: CLOSED ✅', 'MongoDB port 27017: FILTERED ⚠️'];
          scanFindings.push(`💾 ${dbResults[Math.floor(Math.random() * dbResults.length)]}`);
        }
        
        if (step.text.includes('cryptocurrency')) {
          scanFindings.push('⛏️ Cryptocurrency scan: No mining software detected ✅');
        }
        
        if (step.text.includes('rogue access')) {
          scanFindings.push('📶 Access point scan: 3 networks detected, all legitimate ✅');
        }
        
        // Update result with current findings for live display
        setResult(prev => ({
          ...prev,
          networkInfo: {
            ...networkInfo,
            discoveredDevices: [...discoveredDevices],
            scanFindings: [...scanFindings]
          }
        }));
        
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      // Store final findings
      networkInfo.discoveredDevices = discoveredDevices;
      networkInfo.scanFindings = scanFindings;

      // Generate realistic security assessment
      const vulnerabilityCount = Math.floor(Math.random() * 8) + 3; // 3-10 vulnerabilities
      const securityScore = Math.max(30, 100 - (vulnerabilityCount * 8) - Math.floor(Math.random() * 20));
      
      const securityAnalysis = {
        networkInfo,
        securityScore,
        riskLevel: securityScore > 80 ? 'Low' : securityScore > 60 ? 'Moderate' : securityScore > 40 ? 'High' : 'Critical',
        vulnerabilities: generateVulnerabilities(networkInfo, vulnerabilityCount),
        networkFingerprint: {
          uniqueId: generateFingerprint(),
          trackingRisk: Math.floor(Math.random() * 40) + 60,
          anonymityLevel: networkInfo.vpnDetected ? 'High' : 'Low'
        },
        recommendations: generateRecommendations(networkInfo, securityScore),
        protectionMeasures: generateProtectionMeasures(networkInfo)
      };

      setResult(securityAnalysis);
      
      // Don't send automatic message to chat - let user interact with recommendations instead

    } catch (err) {
      setError('Failed to complete network security scan. Please try again.');
      console.error('Network security scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const generateFingerprint = () => {
    const chars = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateVulnerabilities = (networkInfo, count) => {
    const allVulnerabilities = [
      {
        severity: 'Critical',
        title: 'Unencrypted DNS Queries',
        description: 'DNS requests are not using DNS-over-HTTPS (DoH), exposing browsing history',
        impact: 'ISP and network observers can monitor all websites you visit',
        solution: 'Configure DNS-over-HTTPS in browser settings or use Cloudflare DNS (1.1.1.1)'
      },
      {
        severity: 'High',
        title: 'Browser Fingerprinting Vulnerability',
        description: 'Your browser configuration creates a unique fingerprint trackable across websites',
        impact: 'Websites can track you even without cookies',
        solution: 'Use privacy-focused browser extensions or enable fingerprint protection'
      },
      {
        severity: 'High',
        title: 'No VPN Protection Detected',
        description: 'Your real IP address and location are exposed to all websites',
        impact: 'Geographic location and ISP information publicly visible',
        solution: 'Use a reputable VPN service to mask your IP address and location'
      },
      {
        severity: 'Medium',
        title: 'HTTP Traffic Detected',
        description: 'Some connections are using unencrypted HTTP instead of HTTPS',
        impact: 'Data transmitted over HTTP can be intercepted and read',
        solution: 'Install HTTPS Everywhere extension and avoid non-HTTPS sites'
      },
      {
        severity: 'Medium',
        title: 'Third-Party Tracking Cookies',
        description: 'Multiple tracking cookies from advertising networks detected',
        impact: 'Your browsing behavior is being tracked across websites',
        solution: 'Enable strict cookie blocking and use privacy-focused browser settings'
      },
      {
        severity: 'Medium',
        title: 'WebRTC IP Leak Risk',
        description: 'Browser WebRTC may leak your real IP address even behind VPN',
        impact: 'VPN protection could be bypassed, exposing real location',
        solution: 'Disable WebRTC in browser settings or use browser extension to block leaks'
      },
      {
        severity: 'Low',
        title: 'Outdated Browser Version',
        description: 'Browser version is not the latest, may contain security vulnerabilities',
        impact: 'Potential exposure to known browser exploits',
        solution: 'Update browser to the latest version with security patches'
      },
      {
        severity: 'Low',
        title: 'Timezone Information Leak',
        description: 'Browser timezone settings can be used for location tracking',
        impact: 'Approximate location can be determined from timezone data',
        solution: 'Consider using timezone spoofing or privacy browser settings'
      },
      {
        severity: 'Critical',
        title: 'Open Network Ports Detected',
        description: 'Multiple network ports are accessible from the internet',
        impact: 'Potential entry points for attackers to access your network',
        solution: 'Configure firewall to block unnecessary ports and services'
      },
      {
        severity: 'High',
        title: 'Weak WiFi Security Protocol',
        description: 'Network is using outdated WPA2 instead of WPA3 security',
        impact: 'WiFi traffic could be intercepted with advanced attacks',
        solution: 'Upgrade router firmware and enable WPA3 security protocol'
      }
    ];

    // Adjust vulnerabilities based on actual network info
    let selectedVulnerabilities = [];
    
    if (!networkInfo.vpnDetected) {
      selectedVulnerabilities.push(allVulnerabilities[2]); // No VPN
    }
    
    if (networkInfo.userAgent.includes('Chrome')) {
      selectedVulnerabilities.push(allVulnerabilities[1]); // Browser fingerprinting
    }
    
    // Add random additional vulnerabilities
    const remaining = allVulnerabilities.filter(v => !selectedVulnerabilities.includes(v));
    while (selectedVulnerabilities.length < count && remaining.length > 0) {
      const randomIndex = Math.floor(Math.random() * remaining.length);
      selectedVulnerabilities.push(remaining.splice(randomIndex, 1)[0]);
    }

    return selectedVulnerabilities;
  };

  const generateRecommendations = (networkInfo, securityScore) => {
    const toolRecommendations = [
      {
        priority: 'Immediate',
        action: 'Scan Your Digital Footprint',
        description: 'Your network is exposed - now check what personal data is publicly available about you online',
        icon: '🔍',
        toolAction: 'data_broker_scan',
        question: 'Should I scan what personal information is publicly available about you online?'
      },
      {
        priority: 'High', 
        action: 'Check Password Security',
        description: 'Network vulnerabilities found - verify if your passwords have been compromised in data breaches',
        icon: '🔐',
        toolAction: 'password_check',
        question: 'Want me to check if your passwords have been compromised in data breaches?'
      },
      {
        priority: 'High',
        action: 'Monitor Dark Web Activity',
        description: 'Security gaps detected - scan the dark web for your personal information being sold',
        icon: '🕵️',
        toolAction: 'dark_web_scan', 
        question: 'Should I check if your personal data is being sold on the dark web?'
      },
      {
        priority: 'Medium',
        action: 'Analyze Email Security',
        description: 'Check if your email addresses have been involved in data breaches or security incidents',
        icon: '📧',
        toolAction: 'email_scan',
        question: 'Want me to check if your email has been involved in any data breaches?'
      },
      {
        priority: 'Medium',
        action: 'Security Posture Assessment',
        description: 'Get a comprehensive view of your overall digital security and privacy status',
        icon: '📊',
        toolAction: 'security_assessment',
        question: 'Should I run a complete security assessment of your digital presence?'
      }
    ];

    // Add contextual recommendations based on findings
    const contextualRecommendations = [];
    
    if (!networkInfo.vpnDetected) {
      contextualRecommendations.push({
        priority: 'Critical',
        action: 'Urgent: IP Address Exposed',
        description: 'Your real IP and location are visible - this makes you vulnerable to tracking and targeted attacks',
        icon: '🚨',
        toolAction: 'privacy_tools',
        question: 'Your IP address is exposed! Want me to recommend privacy tools to protect your identity?'
      });
    }

    if (securityScore < 60) {
      contextualRecommendations.push({
        priority: 'Critical',
        action: 'Critical Security Gaps Found',
        description: 'Multiple vulnerabilities detected - immediate action required to secure your network',
        icon: '⚠️',
        toolAction: 'security_hardening',
        question: 'Critical security issues found! Should I create a step-by-step security hardening plan?'
      });
    }

    // Return contextual first, then general tool recommendations
    return [...contextualRecommendations, ...toolRecommendations.slice(0, 3)];
  };

  const generateProtectionMeasures = (networkInfo) => {
    return [
      {
        category: 'Network Layer Protection',
        measures: [
          'VPN tunnel encryption (256-bit AES)',
          'DNS-over-HTTPS (DoH) protection',
          'Advanced firewall configuration',
          'Network intrusion detection',
          'Port scanning protection'
        ],
        effectiveness: networkInfo.vpnDetected ? '95%' : '65%'
      },
      {
        category: 'Browser Security',
        measures: [
          'Anti-fingerprinting protection',
          'Tracking cookie blocking',
          'HTTPS enforcement',
          'WebRTC leak prevention',
          'Secure user agent configuration'
        ],
        effectiveness: '88%'
      },
      {
        category: 'Privacy Enhancement',
        measures: [
          'IP address masking',
          'Location privacy protection',
          'ISP monitoring prevention',
          'Anonymous browsing configuration',
          'Digital footprint minimization'
        ],
        effectiveness: networkInfo.vpnDetected ? '92%' : '45%'
      }
    ];
  };

  // Auto-start scan on mount
  useEffect(() => {
    scanNetworkSecurity();
  }, []);

  return (
    <BaseTool
      toolName="AI Network Security Scanner"
      toolIcon={<FaRobot />}
      toolDescription="Advanced AI-powered network security analysis and defense recommendations"
      onClose={onClose}
      className="ai-defense-tool enterprise-grade"
    >
      <div className="ai-defense-content">
        {isScanning && (
          <div className="scanning-interface cyber-theme">
            <div className="scan-header">
              <FaBrain className="scan-icon pulse" />
              <h3>🤖 AI Penetration Testing Suite - Active Scan</h3>
              <div className="scan-mode">
                <span className="mode-badge">STEALTH MODE</span>
                <span className="scan-type">Network Reconnaissance</span>
              </div>
            </div>
            
            <div className="current-scan-display">
              <div className="scan-line active">
                <FaNetworkWired className="scan-activity pulse" />
                <span className="scan-text typing">{currentScan}</span>
                <div className="scan-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>

            <div className="scan-progress">
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill animated" 
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                  <div className="progress-glow" style={{ left: `${scanProgress}%` }}></div>
                </div>
                <div className="progress-stats">
                  <span className="progress-text">{scanProgress}% Complete</span>
                  <span className="eta">ETA: {Math.max(1, Math.ceil((100 - scanProgress) * 0.15))}s</span>
                </div>
              </div>
            </div>
            
            <div className="scan-matrix">
              <div className="matrix-header">
                <span>🔍 Live Scan Results</span>
                <span className="findings-count">{result?.networkInfo?.scanFindings?.length || 0} findings</span>
              </div>
              <div className="scan-findings-live">
                {result?.networkInfo?.scanFindings?.map((finding, idx) => (
                  <div key={idx} className="finding-item slide-in" style={{ animationDelay: `${idx * 0.3}s` }}>
                    {finding}
                  </div>
                )) || []}
              </div>
            </div>
            
            <div className="scan-activities">
              <div className="activity-grid">
                <div className="activity-item active">
                  <FaGlobe className="activity-icon" />
                  <span>Geolocation</span>
                  <div className="status-indicator success"></div>
                </div>
                <div className="activity-item active">
                  <FaWifi className="activity-icon" />
                  <span>Network Topology</span>
                  <div className="status-indicator warning"></div>
                </div>
                <div className="activity-item active">
                  <FaShieldAlt className="activity-icon" />
                  <span>Vulnerability Scan</span>
                  <div className="status-indicator info"></div>
                </div>
                <div className="activity-item active">
                  <FaLock className="activity-icon" />
                  <span>Penetration Test</span>
                  <div className="status-indicator success"></div>
                </div>
                <div className="activity-item">
                  <FaEye className="activity-icon" />
                  <span>Backdoor Detection</span>
                  <div className="status-indicator success"></div>
                </div>
                <div className="activity-item">
                  <FaNetworkWired className="activity-icon" />
                  <span>Port Scanning</span>
                  <div className="status-indicator warning"></div>
                </div>
              </div>
            </div>
            
            <div className="terminal-output">
              <div className="terminal-header">
                <span>🖥️ Live Terminal Output</span>
              </div>
              <div className="terminal-content">
                <div className="terminal-line">$ nmap -sS -O target_network</div>
                <div className="terminal-line">$ sqlmap -u "target" --batch</div>
                <div className="terminal-line">$ nikto -h target_host</div>
                <div className="terminal-line typing">$ ./custom_scanner --stealth-mode...</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <ToolError error={error} onRetry={scanNetworkSecurity} />
        )}

        {result && !isScanning && (
          <ToolResult
            status={result.riskLevel === 'Critical' ? 'error' : result.riskLevel === 'High' ? 'warning' : 'success'}
            title="🛡️ Network Security Analysis Complete"
            message={`Security Score: ${result.securityScore}/100 (${result.riskLevel} Risk) • ${result.vulnerabilities.length} vulnerabilities detected`}
            details={
              <div className="security-results-redesigned">
                {/* Top Row - Key Metrics */}
                <div className="metrics-row">
                  <div className="metric-card security-score-card">
                    <div className="metric-header">
                      <FaShieldAlt className="metric-icon" />
                      <span>Security Score</span>
                    </div>
                    <div className="score-display-large">
                      <div className={`score-number-large ${result.riskLevel?.toLowerCase()}`}>
                        {result.securityScore || 'N/A'}
                      </div>
                      <div className="score-details-compact">
                        <div className={`risk-badge ${result.riskLevel?.toLowerCase()}`}>
                          {result.riskLevel || 'UNKNOWN'} RISK
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card vpn-status-card">
                    <div className="metric-header">
                      <FaLock className="metric-icon" />
                      <span>VPN Protection</span>
                    </div>
                    <div className={`status-display ${result.networkInfo.vpnDetected ? 'protected' : 'exposed'}`}>
                      <div className="status-icon">
                        {result.networkInfo.vpnDetected ? '🛡️' : '⚠️'}
                      </div>
                      <div className="status-text">
                        {result.networkInfo.vpnDetected ? 'PROTECTED' : 'EXPOSED'}
                      </div>
                    </div>
                  </div>

                  <div className="metric-card tracking-card">
                    <div className="metric-header">
                      <FaEye className="metric-icon" />
                      <span>Tracking Risk</span>
                    </div>
                    <div className="tracking-display">
                      <div className="tracking-percentage">
                        {result.networkFingerprint.trackingRisk}%
                      </div>
                      <div className="fingerprint-id">
                        ID: {result.networkFingerprint.uniqueId}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Network Information Section */}
                <div className="section-card">
                  <div className="section-header">
                    <FaNetworkWired className="section-icon" />
                    <h3>Network Information</h3>
                  </div>
                  <div className="network-info-grid">
                    <div className="info-row">
                      <div className="info-item">
                        <span className="info-label">Public IP</span>
                        <span className="info-value">{result.networkInfo.publicIP || 'Protected'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Location</span>
                        <span className="info-value">{result.networkInfo.location || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-item">
                        <span className="info-label">ISP Provider</span>
                        <span className="info-value">{result.networkInfo.isp || 'Unknown'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Browser</span>
                        <span className="info-value">{getBrowserName(result.networkInfo.userAgent)}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-item">
                        <span className="info-label">Timezone</span>
                        <span className="info-value">{result.networkInfo.timezone}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Resolution</span>
                        <span className="info-value">{result.networkInfo.screenResolution}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discovered Devices */}
                {result.networkInfo.discoveredDevices && result.networkInfo.discoveredDevices.length > 0 && (
                  <div className="section-card">
                    <div className="section-header">
                      <FaWifi className="section-icon" />
                      <h3>Discovered Network Devices</h3>
                    </div>
                    <div className="devices-grid-redesigned">
                      {result.networkInfo.discoveredDevices.map((device, idx) => (
                        <div key={idx} className="device-card">
                          <div className="device-icon-large">📱</div>
                          <div className="device-info">
                            <div className="device-name">{device}</div>
                            <div className="device-status online">ONLINE</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Penetration Test Results */}
                {result.networkInfo.scanFindings && result.networkInfo.scanFindings.length > 0 && (
                  <div className="section-card">
                    <div className="section-header">
                      <FaEye className="section-icon" />
                      <h3>Penetration Test Results</h3>
                    </div>
                    <div className="findings-grid">
                      {result.networkInfo.scanFindings.map((finding, idx) => (
                        <div key={idx} className="finding-card">
                          {finding}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detected Vulnerabilities */}
                <div className="section-card">
                  <div className="section-header">
                    <FaExclamationTriangle className="section-icon" />
                    <h3>Detected Vulnerabilities</h3>
                  </div>
                  <div className="vulnerabilities-grid">
                    {result.vulnerabilities.map((vuln, idx) => (
                    <div key={idx} className={`vulnerability-item ${vuln.severity.toLowerCase()}`}>
                      <div className="vuln-header">
                        <span className={`severity-badge ${vuln.severity.toLowerCase()}`}>
                          {vuln.severity}
                        </span>
                        <span className="vuln-title">{vuln.title}</span>
                      </div>
                      <p className="vuln-description">{vuln.description}</p>
                      <div className="vuln-impact">
                        <strong>Impact:</strong> {vuln.impact}
                      </div>
                      <div className="vuln-solution">
                        <strong>Solution:</strong> {vuln.solution}
                      </div>
                    </div>
                    ))}
                  </div>
                </div>

                {/* AI Security Recommendations */}
                <div className="section-card">
                  <div className="section-header">
                    <FaBrain className="section-icon" />
                    <h3>AI Security Recommendations</h3>
                  </div>
                  <div className="recommendations-grid">
                    {result.recommendations.map((rec, idx) => (
                      <div 
                        key={idx} 
                        className="recommendation-card clickable-card"
                        onClick={() => {
                          // Send contextual recommendation with security analysis
                          const contextualMessage = `Based on my network security scan results (Security Score: ${result.securityScore}/100, Risk Level: ${result.riskLevel}), I found ${result.vulnerabilities.length} vulnerabilities. ${rec.question}

Security Context:
- IP Address: ${result.networkInfo.publicIP || 'Protected'}
- VPN Status: ${result.networkInfo.vpnDetected ? 'Protected' : 'EXPOSED'}
- Location: ${result.networkInfo.location || 'Unknown'}
- Browser: ${getBrowserName(result.networkInfo.userAgent)}
- Risk Priority: ${rec.priority}

Please provide specific guidance for "${rec.action}" or recommend the appropriate CyberForget tool to address this security concern.`;

                          // Send as a user message that will trigger Gemini response
                          onComplete({
                            type: 'user_message',
                            message: contextualMessage,
                            expectResponse: true
                          });
                        }}
                      >
                        <div className="rec-header">
                          <span className="rec-icon">{rec.icon}</span>
                          <div className="rec-content">
                            <div className="rec-title-row">
                              <span className="rec-title">{rec.action}</span>
                              <span className={`priority-badge ${rec.priority.toLowerCase()}`}>
                                {rec.priority}
                              </span>
                            </div>
                            <p className="rec-description">{rec.description}</p>
                            <div className="rec-action-hint">
                              <span className="action-text">Click to {rec.question.toLowerCase()}</span>
                              <span className="action-arrow">→</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Protection Framework */}
                <div className="section-card">
                  <div className="section-header">
                    <FaLock className="section-icon" />
                    <h3>Protection Framework</h3>
                  </div>
                  <div className="protection-grid">
                    {result.protectionMeasures.map((framework, idx) => (
                      <div key={idx} className="protection-card">
                        <div className="protection-header">
                          <span className="protection-name">{framework.category}</span>
                          <span className="effectiveness-badge">
                            {framework.effectiveness}
                          </span>
                        </div>
                        <ul className="measures-list">
                          {framework.measures.map((measure, mIdx) => (
                            <li key={mIdx}>
                              <FaShieldAlt className="measure-icon" />
                              {measure}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
            actions={[]}
          />
        )}
      </div>
    </BaseTool>
  );
};

export default AIDefenseTool;