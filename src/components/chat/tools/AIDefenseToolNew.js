// AI-Powered Cyber Defense - Mobile-Optimized Staged Experience
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseTool from './BaseTool';
import { FaRobot, FaShieldAlt, FaBrain, FaLock, FaEye, FaNetworkWired, FaWifi, FaGlobe, FaExclamationTriangle, FaChevronDown } from 'react-icons/fa';
import './AIDefenseTool.css';

const AIDefenseToolNew = ({ onComplete, onClose }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const stageRefs = useRef([]);

  const stages = [
    {
      title: "🧠 AI Analysis Starting",
      description: "Initializing cyber defense neural networks...",
      duration: 2000
    },
    {
      title: "🌐 Network Discovery",
      description: "Scanning your digital perimeter...",
      duration: 3000
    },
    {
      title: "🔍 Vulnerability Assessment", 
      description: "AI is analyzing security weaknesses...",
      duration: 4000
    },
    {
      title: "🛡️ Defense Recommendations",
      description: "Generating personalized protection strategies...",
      duration: 2000
    }
  ];

  const scrollToStage = (stageIndex) => {
    if (stageRefs.current[stageIndex]) {
      stageRefs.current[stageIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const startScan = async () => {
    setIsScanning(true);
    
    // Stage 1: AI Initialization
    setCurrentStage(0);
    scrollToStage(0);
    await new Promise(resolve => setTimeout(resolve, stages[0].duration));

    // Stage 2: Network Discovery
    setCurrentStage(1);
    scrollToStage(1);
    
    // Get real network info
    const info = await getNetworkInfo();
    setNetworkInfo(info);
    await new Promise(resolve => setTimeout(resolve, stages[1].duration));

    // Stage 3: Vulnerability Assessment
    setCurrentStage(2);
    scrollToStage(2);
    
    const vulns = generateVulnerabilities(info);
    setVulnerabilities(vulns);
    await new Promise(resolve => setTimeout(resolve, stages[2].duration));

    // Stage 4: Recommendations
    setCurrentStage(3);
    scrollToStage(3);
    await new Promise(resolve => setTimeout(resolve, stages[3].duration));
    
    setIsScanning(false);
    setScanComplete(true);
    setShowRecommendations(true);
  };

  const getNetworkInfo = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        return {
          ip: data.ip,
          location: `${data.city}, ${data.country_name}`,
          isp: data.org,
          browser: getBrowserName(navigator.userAgent),
          vpnDetected: data.org?.toLowerCase().includes('vpn')
        };
      }
    } catch (e) {
      // Fallback
      return {
        ip: 'Hidden',
        location: 'Protected by privacy tools',
        isp: 'ISP information secured',
        browser: getBrowserName(navigator.userAgent),
        vpnDetected: false
      };
    }
  };

  const getBrowserName = (userAgent) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Unknown';
  };

  const generateVulnerabilities = (info) => {
    const baseVulns = [
      {
        level: 'high',
        title: 'IP Address Exposed',
        description: 'Your real location is visible to websites',
        solution: 'Use a VPN service'
      },
      {
        level: 'medium',
        title: 'Browser Fingerprinting',
        description: 'Your browser can be tracked across sites',
        solution: 'Enable privacy mode'
      }
    ];

    if (!info.vpnDetected) {
      baseVulns.push({
        level: 'critical',
        title: 'No VPN Protection',
        description: 'Traffic is unencrypted and trackable',
        solution: 'Install a VPN immediately'
      });
    }

    return baseVulns;
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'critical': return '#ff4757';
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa726';
      case 'low': return '#66bb6a';
      default: return '#64748b';
    }
  };

  const calculateSecurityScore = () => {
    const criticalCount = vulnerabilities.filter(v => v.level === 'critical').length;
    const highCount = vulnerabilities.filter(v => v.level === 'high').length;
    const mediumCount = vulnerabilities.filter(v => v.level === 'medium').length;
    
    let score = 100;
    score -= criticalCount * 30;
    score -= highCount * 15;
    score -= mediumCount * 10;
    
    return Math.max(score, 0);
  };

  useEffect(() => {
    startScan();
  }, []);

  return (
    <BaseTool
      toolName="AI Cyber Defense Strategist"
      toolIcon="🤖"
      toolDescription="AI-powered network security analysis and defense recommendations"
      onClose={onClose}
      className="ai-defense-tool"
    >
      <div className="ai-defense-content">
        
        {/* Stage Progress */}
        <div className="stage-progress">
          {stages.map((stage, index) => (
            <div 
              key={index}
              ref={el => stageRefs.current[index] = el}
              className={`stage ${index <= currentStage ? 'active' : ''} ${index === currentStage ? 'current' : ''}`}
            >
              <motion.div 
                className="stage-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: index <= currentStage ? 1 : 0.3, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
                
                {index === currentStage && isScanning && (
                  <div className="scanning-indicator">
                    <div className="pulse-circle"></div>
                  </div>
                )}
                
                {/* Stage Content */}
                {index === 1 && networkInfo && (
                  <motion.div 
                    className="network-info-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="info-row">
                      <span>🌍 Location:</span>
                      <span>{networkInfo.location}</span>
                    </div>
                    <div className="info-row">
                      <span>🌐 IP Address:</span>
                      <span>{networkInfo.ip}</span>
                    </div>
                    <div className="info-row">
                      <span>💻 Browser:</span>
                      <span>{networkInfo.browser}</span>
                    </div>
                  </motion.div>
                )}
                
                {index === 2 && vulnerabilities.length > 0 && (
                  <motion.div 
                    className="vulnerabilities-preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="security-score">
                      <div className="score-circle">
                        <span className="score-number">{calculateSecurityScore()}</span>
                        <span className="score-label">/100</span>
                      </div>
                      <p>Security Score</p>
                    </div>
                    
                    <div className="vuln-summary">
                      <p>{vulnerabilities.length} vulnerabilities detected</p>
                    </div>
                  </motion.div>
                )}
                
                {index === 3 && showRecommendations && (
                  <motion.div 
                    className="recommendations-preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="recommendation-cards">
                      {vulnerabilities.slice(0, 2).map((vuln, i) => (
                        <div key={i} className="recommendation-card">
                          <div className="vuln-header">
                            <span 
                              className="vuln-level"
                              style={{ backgroundColor: getLevelColor(vuln.level) }}
                            >
                              {vuln.level}
                            </span>
                            <h4>{vuln.title}</h4>
                          </div>
                          <p>{vuln.description}</p>
                          <div className="solution">
                            <strong>💡 Solution:</strong> {vuln.solution}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {scanComplete && (
                      <div className="action-buttons">
                        <button 
                          className="primary-btn"
                          onClick={() => onComplete({
                            type: 'ai_defense',
                            data: { vulnerabilities, networkInfo, securityScore: calculateSecurityScore() },
                            summary: `AI Defense analysis complete. Security score: ${calculateSecurityScore()}/100 with ${vulnerabilities.length} vulnerabilities detected.`
                          })}
                        >
                          <FaShieldAlt /> Get Full Defense Plan
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </BaseTool>
  );
};

export default AIDefenseToolNew;