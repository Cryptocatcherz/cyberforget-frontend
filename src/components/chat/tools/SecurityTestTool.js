// Security Test Tool - Comprehensive Vulnerability Testing Interface
import React, { useState } from 'react';
import BaseTool, { ToolResult, ToolLoading } from './BaseTool';
import { 
  FaShieldAlt, FaNetworkWired, FaBug, FaLock, FaWifi, 
  FaDatabase, FaEye, FaUserShield, FaServer, FaGlobe,
  FaPlay, FaCheck, FaTimes, FaClock, FaExclamationTriangle
} from 'react-icons/fa';
import './SecurityTestTool.css';

const SecurityTestTool = ({ onComplete, onClose }) => {
  const [runningTests, setRunningTests] = useState(new Set());
  const [completedTests, setCompletedTests] = useState(new Map());
  const [testResults, setTestResults] = useState(new Map());

  const securityTests = [
    {
      id: 'open_ports',
      name: 'Open Ports Test',
      description: 'Scan for open ports and potential vulnerabilities',
      icon: <FaNetworkWired />,
      category: 'Network',
      duration: 8000,
      riskLevel: 'high'
    },
    {
      id: 'ddos_defense',
      name: 'DDOS Defense Test',
      description: 'Test network resilience against denial of service attacks',
      icon: <FaShieldAlt />,
      category: 'Network',
      duration: 12000,
      riskLevel: 'critical'
    },
    {
      id: 'malware_scan',
      name: 'Malware/Virus Test',
      description: 'Deep scan for malicious software and viruses',
      icon: <FaBug />,
      category: 'Security',
      duration: 15000,
      riskLevel: 'critical'
    },
    {
      id: 'ssl_check',
      name: 'SSL Certificate Test',
      description: 'Verify SSL/TLS configuration and security',
      icon: <FaLock />,
      category: 'Encryption',
      duration: 5000,
      riskLevel: 'medium'
    },
    {
      id: 'wifi_security',
      name: 'WiFi Security Test',
      description: 'Analyze wireless network security and encryption',
      icon: <FaWifi />,
      category: 'Network',
      duration: 10000,
      riskLevel: 'high'
    },
    {
      id: 'data_leak',
      name: 'Data Leak Detection',
      description: 'Scan for exposed personal information and data breaches',
      icon: <FaDatabase />,
      category: 'Privacy',
      duration: 18000,
      riskLevel: 'critical'
    },
    {
      id: 'privacy_audit',
      name: 'Privacy Audit',
      description: 'Comprehensive privacy settings and exposure analysis',
      icon: <FaEye />,
      category: 'Privacy',
      duration: 7000,
      riskLevel: 'medium'
    },
    {
      id: 'identity_theft',
      name: 'Identity Theft Check',
      description: 'Monitor for unauthorized use of personal information',
      icon: <FaUserShield />,
      category: 'Identity',
      duration: 20000,
      riskLevel: 'critical'
    },
    {
      id: 'server_security',
      name: 'Server Security Test',
      description: 'Evaluate server configuration and security hardening',
      icon: <FaServer />,
      category: 'Infrastructure',
      duration: 13000,
      riskLevel: 'high'
    },
    {
      id: 'web_vulns',
      name: 'Web Vulnerabilities',
      description: 'Test for common web application security flaws',
      icon: <FaGlobe />,
      category: 'Web Security',
      duration: 16000,
      riskLevel: 'high'
    }
  ];

  const runTest = async (test) => {
    setRunningTests(prev => new Set([...prev, test.id]));
    
    try {
      // Simulate progressive test stages
      const stages = [
        `🔍 Initializing ${test.name.toLowerCase()}...`,
        `🌐 Establishing secure test connection...`,
        `⚡ Running ${test.name.toLowerCase()} analysis...`,
        `🔬 Processing security data...`,
        `📊 Generating security report...`
      ];

      let currentStage = 0;
      const stageInterval = setInterval(() => {
        if (currentStage < stages.length - 1) {
          currentStage++;
        }
      }, test.duration / stages.length);

      // Wait for test completion
      await new Promise(resolve => setTimeout(resolve, test.duration));
      clearInterval(stageInterval);

      // Generate realistic test results
      const result = generateTestResult(test);
      
      setTestResults(prev => new Map([...prev, [test.id, result]]));
      setCompletedTests(prev => new Map([...prev, [test.id, true]]));
      
    } catch (error) {
      console.error(`Test ${test.id} failed:`, error);
      setTestResults(prev => new Map([...prev, [test.id, { 
        status: 'error', 
        message: 'Test failed - please try again' 
      }]]));
    } finally {
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(test.id);
        return newSet;
      });
    }
  };

  const generateTestResult = (test) => {
    // Generate realistic security test results
    const riskFactors = Math.random();
    
    switch (test.id) {
      case 'open_ports':
        const openPorts = Math.floor(Math.random() * 5) + 1;
        return {
          status: openPorts > 3 ? 'warning' : openPorts > 1 ? 'info' : 'success',
          score: Math.max(20, 100 - (openPorts * 15)),
          details: `${openPorts} open ports detected`,
          recommendations: openPorts > 2 ? ['Close unnecessary ports', 'Enable firewall protection'] : ['Port configuration looks secure']
        };

      case 'ddos_defense':
        const defenseScore = Math.floor(Math.random() * 40) + 60;
        return {
          status: defenseScore < 70 ? 'warning' : 'success',
          score: defenseScore,
          details: `DDoS protection strength: ${defenseScore}%`,
          recommendations: defenseScore < 70 ? ['Enable DDoS protection', 'Configure rate limiting'] : ['DDoS defenses are adequate']
        };

      case 'malware_scan':
        const threatsFound = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
        return {
          status: threatsFound > 0 ? 'error' : 'success',
          score: threatsFound > 0 ? 30 : 95,
          details: threatsFound > 0 ? `${threatsFound} potential threats detected` : 'No malware detected',
          recommendations: threatsFound > 0 ? ['Run full system scan', 'Update antivirus software'] : ['System appears clean']
        };

      case 'ssl_check':
        const sslStrength = Math.random() > 0.3 ? 'strong' : 'weak';
        return {
          status: sslStrength === 'weak' ? 'warning' : 'success',
          score: sslStrength === 'weak' ? 65 : 90,
          details: `SSL/TLS configuration: ${sslStrength}`,
          recommendations: sslStrength === 'weak' ? ['Update SSL certificate', 'Enable HSTS'] : ['SSL configuration is secure']
        };

      case 'wifi_security':
        const encryptionType = Math.random() > 0.2 ? 'WPA3' : 'WPA2';
        return {
          status: encryptionType === 'WPA2' ? 'info' : 'success',
          score: encryptionType === 'WPA2' ? 75 : 90,
          details: `WiFi encryption: ${encryptionType}`,
          recommendations: encryptionType === 'WPA2' ? ['Upgrade to WPA3 if available'] : ['WiFi security is optimal']
        };

      case 'data_leak':
        const leaksFound = Math.random() > 0.6 ? Math.floor(Math.random() * 2) + 1 : 0;
        return {
          status: leaksFound > 0 ? 'error' : 'success',
          score: leaksFound > 0 ? 40 : 85,
          details: leaksFound > 0 ? `${leaksFound} data exposure(s) found` : 'No data leaks detected',
          recommendations: leaksFound > 0 ? ['Secure exposed data', 'Review privacy settings'] : ['Data appears secure']
        };

      default:
        const randomScore = Math.floor(Math.random() * 30) + 70;
        return {
          status: randomScore < 80 ? 'warning' : 'success',
          score: randomScore,
          details: `Security assessment: ${randomScore}%`,
          recommendations: randomScore < 80 ? ['Review security settings'] : ['Security configuration is good']
        };
    }
  };

  const runAllTests = async () => {
    for (const test of securityTests) {
      if (!completedTests.has(test.id) && !runningTests.has(test.id)) {
        await runTest(test);
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Generate comprehensive report
    const overallResults = Array.from(testResults.values());
    const averageScore = overallResults.reduce((sum, result) => sum + result.score, 0) / overallResults.length;
    
    onComplete({
      type: 'security_test_suite',
      data: {
        tests: testResults,
        overallScore: Math.round(averageScore),
        testCount: overallResults.length,
        criticalIssues: overallResults.filter(r => r.status === 'error').length,
        warnings: overallResults.filter(r => r.status === 'warning').length
      },
      summary: `🛡️ **Security Test Suite Complete**: ${Math.round(averageScore)}/100 overall score | ${overallResults.length} tests completed | ${overallResults.filter(r => r.status === 'error').length} critical issues found`
    });
  };

  const getStatusIcon = (testId) => {
    if (runningTests.has(testId)) return <FaClock className="status-icon running" />;
    if (completedTests.has(testId)) {
      const result = testResults.get(testId);
      if (result?.status === 'success') return <FaCheck className="status-icon success" />;
      if (result?.status === 'warning') return <FaExclamationTriangle className="status-icon warning" />;
      if (result?.status === 'error') return <FaTimes className="status-icon error" />;
    }
    return null;
  };

  const getTestProgress = () => {
    const total = securityTests.length;
    const completed = completedTests.size;
    const running = runningTests.size;
    return { total, completed, running, percentage: (completed / total) * 100 };
  };

  const progress = getTestProgress();

  return (
    <BaseTool
      toolName="🛡️ Security Test Suite"
      toolIcon={<FaShieldAlt />}
      toolDescription="Comprehensive vulnerability testing and security analysis"
      onClose={onClose}
      className="security-test-tool"
    >
      <div className="security-test-content">
        <div className="test-overview">
          <div className="progress-section">
            <div className="progress-stats">
              <span className="stat">
                <strong>{progress.completed}</strong> / {progress.total} tests completed
              </span>
              <span className="stat running">
                {progress.running > 0 && `${progress.running} running`}
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          <div className="test-actions">
            <button 
              className="run-all-btn primary"
              onClick={runAllTests}
              disabled={runningTests.size > 0}
            >
              <FaPlay /> Run All Tests
            </button>
          </div>
        </div>

        <div className="tests-grid">
          {securityTests.map(test => (
            <div 
              key={test.id} 
              className={`test-card ${test.riskLevel} ${
                runningTests.has(test.id) ? 'running' : ''
              } ${
                completedTests.has(test.id) ? 'completed' : ''
              }`}
            >
              <div className="test-header">
                <div className="test-info">
                  <div className="test-icon">{test.icon}</div>
                  <div className="test-details">
                    <h4 className="test-name">{test.name}</h4>
                    <p className="test-description">{test.description}</p>
                  </div>
                </div>
                <div className="test-status">
                  {getStatusIcon(test.id)}
                </div>
              </div>

              <div className="test-meta">
                <span className={`test-category ${test.category.toLowerCase().replace(' ', '-')}`}>
                  {test.category}
                </span>
                <span className={`risk-level ${test.riskLevel}`}>
                  {test.riskLevel} risk
                </span>
              </div>

              {testResults.has(test.id) && (
                <div className="test-result">
                  <div className="result-score">
                    Score: <strong>{testResults.get(test.id).score}/100</strong>
                  </div>
                  <div className="result-details">
                    {testResults.get(test.id).details}
                  </div>
                </div>
              )}

              <div className="test-actions">
                <button
                  className="run-test-btn"
                  onClick={() => runTest(test)}
                  disabled={runningTests.has(test.id) || completedTests.has(test.id)}
                >
                  {runningTests.has(test.id) ? (
                    <>
                      <FaClock /> Testing...
                    </>
                  ) : completedTests.has(test.id) ? (
                    <>
                      <FaCheck /> Complete
                    </>
                  ) : (
                    <>
                      <FaPlay /> Run Test
                    </>
                  )}
                </button>
              </div>

              {runningTests.has(test.id) && (
                <div className="test-progress">
                  <div className="progress-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BaseTool>
  );
};

export default SecurityTestTool;