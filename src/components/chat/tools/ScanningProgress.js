// Scanning Progress Component - CyberForget branded scanning animation
import React, { useState, useEffect } from 'react';
import { FaSearch, FaShieldAlt, FaDatabase, FaBrain, FaChartLine } from 'react-icons/fa';
import './ScanningProgress.css';

const ScanningProgress = ({ onComplete, firstName, lastName }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sitesScanned, setSitesScanned] = useState(0);
  const [threatsFound, setThreatsFound] = useState(0);

  const stages = [
    {
      id: 1,
      name: 'Initializing CyberForget AI',
      icon: <FaBrain />,
      message: 'Establishing secure encrypted connection...',
      duration: 800,
      color: '#42ffb5'
    },
    {
      id: 2,
      name: 'Scanning Data Broker Networks',
      icon: <FaDatabase />,
      message: 'Analyzing 500+ data broker databases...',
      duration: 1200,
      color: '#00d4ff'
    },
    {
      id: 3,
      name: 'Cross-Referencing Intelligence',
      icon: <FaSearch />,
      message: 'Matching identity patterns across sources...',
      duration: 1000,
      color: '#d8ff60'
    },
    {
      id: 4,
      name: 'AI Threat Analysis',
      icon: <FaChartLine />,
      message: 'Processing threat intelligence data...',
      duration: 800,
      color: '#ff6b6b'
    },
    {
      id: 5,
      name: 'Generating Security Report',
      icon: <FaShieldAlt />,
      message: 'Compiling comprehensive analysis...',
      duration: 400,
      color: '#42ffb5'
    }
  ];

  useEffect(() => {
    let progressInterval;
    let siteInterval;
    let threatInterval;

    const startScanning = () => {
      // Progress simulation
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / 200); // 4 seconds total (200 intervals of 20ms)
          return Math.min(newProgress, 100);
        });
      }, 20);

      // Sites scanned simulation
      siteInterval = setInterval(() => {
        setSitesScanned(prev => {
          const increment = Math.floor(Math.random() * 8) + 3;
          const newCount = prev + increment;
          return Math.min(newCount, 523);
        });
      }, 150);

      // Threats found simulation
      threatInterval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance each interval
          setThreatsFound(prev => Math.min(prev + 1, 67));
        }
      }, 300);
    };

    // Stage progression
    const stageTimeout = setTimeout(() => {
      if (currentStage < stages.length - 1) {
        setCurrentStage(prev => prev + 1);
      } else {
        // Scanning complete
        clearInterval(progressInterval);
        clearInterval(siteInterval);
        clearInterval(threatInterval);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, stages[currentStage]?.duration || 800);

    if (currentStage === 0) {
      startScanning();
    }

    return () => {
      clearTimeout(stageTimeout);
      clearInterval(progressInterval);
      clearInterval(siteInterval);
      clearInterval(threatInterval);
    };
  }, [currentStage, onComplete]);

  const currentStageData = stages[currentStage];

  return (
    <div className="cyberforget-scanning-container">
      <div className="scanning-header">
        <div className="scan-target">
          <FaShieldAlt className="shield-icon" />
          <span>Scanning: {firstName} {lastName}</span>
        </div>
        <div className="scan-status">
          Stage {currentStage + 1} of {stages.length}
        </div>
      </div>

      <div className="scanning-stage">
        <div className="stage-icon" style={{ color: currentStageData?.color }}>
          {currentStageData?.icon}
        </div>
        <div className="stage-info">
          <h4 className="stage-name">{currentStageData?.name}</h4>
          <div className="scan-percentage" style={{margin: '4px 0 0 0', fontWeight: 600, color: '#42ffb5', fontSize: '15px'}}>
            {Math.round(progress)}% Complete
          </div>
          <p className="stage-message">{currentStageData?.message}</p>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar-container">
          <div className="progress-label">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${currentStageData?.color}, #42ffb5)`
              }}
            />
          </div>
        </div>

        <div className="scanning-stats">
          <div className="stat-item">
            <div className="stat-value">{sitesScanned}</div>
            <div className="stat-label">Sites Scanned</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-value">{threatsFound}</div>
            <div className="stat-label">Threats Found</div>
          </div>
        </div>
      </div>

      <div className="stage-timeline">
        {stages.map((stage, index) => (
          <div 
            key={stage.id}
            className={`timeline-item ${index <= currentStage ? 'completed' : 'pending'} ${index === currentStage ? 'active' : ''}`}
          >
            <div className="timeline-icon" style={{ color: stage.color }}>
              {stage.icon}
            </div>
            <div className="timeline-label">{stage.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScanningProgress;