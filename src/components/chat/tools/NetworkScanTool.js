// Network Vulnerability Scanner Tool
import React, { useState, useEffect } from 'react';
import BaseTool, { ToolResult, ToolLoading, ToolError } from './BaseTool';
import { FaNetworkWired, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaWifi, FaServer } from 'react-icons/fa';

const NetworkScanTool = ({ onComplete, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('');
  const [progress, setProgress] = useState(0);

  const scanPhases = [
    'Initializing network discovery...',
    'Scanning network topology...',
    'Analyzing open ports and services...',
    'Checking firewall configuration...',
    'Testing encryption protocols...',
    'Evaluating access controls...',
    'Generating vulnerability report...'
  ];

  const runNetworkScan = async () => {
    setIsScanning(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate network scanning process
      for (let i = 0; i < scanPhases.length; i++) {
        setCurrentPhase(scanPhases[i]);
        setProgress(((i + 1) / scanPhases.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Generate mock network scan results
      const networkResults = {
        overallRiskScore: Math.floor(Math.random() * 40) + 50,
        scanDate: new Date().toLocaleString(),
        networkInfo: {
          publicIP: '203.0.113.' + Math.floor(Math.random() * 255),
          localNetwork: '192.168.1.0/24',
          gateway: '192.168.1.1',
          dnsServers: ['8.8.8.8', '1.1.1.1']
        },
        vulnerabilities: [
          {
            severity: 'High',
            type: 'Open Port',
            description: 'Port 22 (SSH) is exposed to the internet',
            recommendation: 'Restrict SSH access to specific IP addresses',
            riskLevel: 8
          },
          {
            severity: 'Medium', 
            type: 'Weak Encryption',
            description: 'TLS 1.1 protocol detected on port 443',
            recommendation: 'Update to TLS 1.3 for improved security',
            riskLevel: 6
          },
          {
            severity: 'Low',
            type: 'Service Banner',
            description: 'Web server banner reveals version information',
            recommendation: 'Configure server to hide version details',
            riskLevel: 3
          }
        ],
        openPorts: [
          { port: 22, service: 'SSH', status: 'Open', risk: 'High' },
          { port: 80, service: 'HTTP', status: 'Open', risk: 'Medium' },
          { port: 443, service: 'HTTPS', status: 'Open', risk: 'Low' },
          { port: 8080, service: 'HTTP-Proxy', status: 'Filtered', risk: 'Medium' }
        ],
        firewallStatus: {
          enabled: true,
          rulesCount: 42,
          defaultPolicy: 'DROP',
          status: 'Active'
        },
        encryptionAnalysis: {
          tlsVersions: ['TLS 1.2', 'TLS 1.1'],
          cipherStrength: 'Strong',
          certificateStatus: 'Valid',
          weakProtocols: ['TLS 1.1']
        },
        recommendations: [
          'Close unnecessary open ports',
          'Update TLS to version 1.3',
          'Enable fail2ban for SSH protection',
          'Configure VPN for remote access',
          'Implement network segmentation',
          'Enable intrusion detection system'
        ]
      };

      setResult(networkResults);
      
      // Send result back to chat
      onComplete({
        type: 'network_scan',
        data: networkResults,
        summary: `🌐 **Network Security Scan Complete**: Risk Score: ${networkResults.overallRiskScore}/100 | ${networkResults.vulnerabilities.length} vulnerabilities found | ${networkResults.openPorts.length} ports analyzed`
      });

    } catch (err) {
      setError('Failed to complete network vulnerability scan. Please try again.');
      console.error('Network scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Auto-start scan on mount
  useEffect(() => {
    runNetworkScan();
  }, []);

  return (
    <BaseTool
      toolName="Network Vulnerability Scanner"
      toolIcon={<FaNetworkWired />}
      toolDescription="Advanced network infrastructure security analysis and vulnerability assessment"
      onClose={onClose}
      className="network-scan-tool enterprise-grade"
    >
      <div className="network-scan-content">
        <div className="scan-header">
          <FaShieldAlt className="scan-icon" />
          <h3>Network Security Analysis</h3>
          <p>Analyzing network infrastructure for security vulnerabilities</p>
        </div>

        {isScanning && (
          <div className="scan-progress">
            <div className="progress-header">
              <FaNetworkWired className="progress-icon" />
              <span>Network Scan in Progress...</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="current-phase">
              <span className="phase-text">{currentPhase}</span>
              <span className="phase-progress">{Math.round(progress)}% Complete</span>
            </div>
          </div>
        )}

        {error && (
          <ToolError error={error} onRetry={runNetworkScan} />
        )}

        {result && !isScanning && (
          <ToolResult
            status={result.overallRiskScore > 70 ? 'error' : result.overallRiskScore > 50 ? 'warning' : 'success'}
            title="🌐 Network Vulnerability Scan Complete"
            message={`Network analysis complete - ${result.vulnerabilities.length} vulnerabilities identified`}
            details={
              <div className="network-scan-results">
                <div className="risk-overview">
                  <div className="overall-score">
                    <FaShieldAlt className="score-icon" />
                    <div className="score-details">
                      <span className="score-label">Network Security Score</span>
                      <span className={`score-value ${result.overallRiskScore > 70 ? 'high-risk' : result.overallRiskScore > 50 ? 'medium-risk' : 'low-risk'}`}>
                        {result.overallRiskScore}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="network-info">
                    <h4><FaWifi className="section-icon" />Network Information</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Public IP:</span>
                        <span className="info-value">{result.networkInfo.publicIP}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Local Network:</span>
                        <span className="info-value">{result.networkInfo.localNetwork}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Gateway:</span>
                        <span className="info-value">{result.networkInfo.gateway}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="vulnerabilities-section">
                  <h4><FaExclamationTriangle className="section-icon" />Security Vulnerabilities</h4>
                  {result.vulnerabilities.map((vuln, idx) => (
                    <div key={idx} className={`vulnerability-item ${vuln.severity.toLowerCase()}`}>
                      <div className="vuln-header">
                        <span className="vuln-type">{vuln.type}</span>
                        <span className={`vuln-severity ${vuln.severity.toLowerCase()}`}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="vuln-description">{vuln.description}</p>
                      <p className="vuln-recommendation">
                        <strong>Recommendation:</strong> {vuln.recommendation}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="ports-section">
                  <h4><FaServer className="section-icon" />Open Ports Analysis</h4>
                  <div className="ports-grid">
                    {result.openPorts.map((port, idx) => (
                      <div key={idx} className={`port-item ${port.risk.toLowerCase()}`}>
                        <div className="port-number">:{port.port}</div>
                        <div className="port-service">{port.service}</div>
                        <div className="port-status">{port.status}</div>
                        <div className={`port-risk ${port.risk.toLowerCase()}`}>{port.risk}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="firewall-section">
                  <h4><FaShieldAlt className="section-icon" />Firewall Status</h4>
                  <div className="firewall-info">
                    <div className="firewall-status">
                      <FaCheckCircle className="status-icon" />
                      <span>Firewall: {result.firewallStatus.enabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="firewall-details">
                      <span>Rules: {result.firewallStatus.rulesCount}</span>
                      <span>Policy: {result.firewallStatus.defaultPolicy}</span>
                      <span>Status: {result.firewallStatus.status}</span>
                    </div>
                  </div>
                </div>

                <div className="recommendations-section">
                  <h4><FaShieldAlt className="section-icon" />Security Recommendations</h4>
                  <ul>
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx}>
                        <FaShieldAlt className="rec-icon" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="scan-metadata">
                  <p>Scan completed: {result.scanDate}</p>
                  <p>Next recommended scan: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            }
            actions={[
              {
                label: 'Download Security Report',
                icon: <FaShieldAlt />,
                variant: 'primary',
                onClick: () => {
                  console.log('Download network security report');
                }
              },
              {
                label: 'Schedule Monitoring',
                icon: <FaNetworkWired />,
                variant: 'secondary',
                onClick: () => {
                  console.log('Schedule network monitoring');
                }
              },
              {
                label: 'Run Scan Again',
                icon: <FaShieldAlt />,
                variant: 'secondary',
                onClick: runNetworkScan
              }
            ]}
          />
        )}
      </div>
    </BaseTool>
  );
};

export default NetworkScanTool;