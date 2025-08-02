import React, { useEffect, useState } from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import './SimpleLoader.css';

const SimpleLoader = () => {
  const [matrixChars, setMatrixChars] = useState([]);
  
  useEffect(() => {
    // Generate random matrix characters
    const chars = ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ'];
    const generated = [];
    for (let i = 0; i < 50; i++) {
      generated.push({
        char: chars[Math.floor(Math.random() * chars.length)],
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1 + Math.random() * 2
      });
    }
    setMatrixChars(generated);
  }, []);

  return (
    <div className="cyber-loader-overlay">
      <div className="matrix-background">
        {matrixChars.map((item, index) => (
          <div
            key={index}
            className="matrix-char"
            style={{
              left: `${item.left}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`
            }}
          >
            {item.char}
          </div>
        ))}
      </div>
      
      <div className="cyber-loader-content">
        <div className="cyber-loader-icon">
          <FaShieldAlt className="shield-icon" />
          <div className="cyber-glow-ring"></div>
          <div className="scan-line"></div>
        </div>
        
        <div className="cyber-loader-text">
          <span className="glitch-text" data-text="CyberForget">CyberForget</span>
          <span className="ai-text">AI</span>
        </div>
        
        <div className="cyber-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <div className="cyber-status">Initializing Cyber Intelligence...</div>
      </div>
    </div>
  );
};

export default SimpleLoader;