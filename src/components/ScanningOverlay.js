import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import './ScanningOverlay.css';

const TypingDots = () => (
  <div className="typing-dots">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

const BreachCard = ({ breach }) => (
  <div className="breach-card">
    <div className="breach-header">
      <h3>{breach.Title || breach.Name}</h3>
      <span className="breach-date">{new Date(breach.BreachDate).getFullYear()}</span>
    </div>
    <p className="breach-description">{breach.Description}</p>
    <div className="breach-details">
      <div className="breach-stat">
        <span className="stat-label">Accounts Affected</span>
        <span className="stat-value">{breach.PwnCount.toLocaleString()}</span>
      </div>
      <div className="breach-data">
        <span className="data-label">Compromised Data</span>
        <div className="data-classes">
          {breach.DataClasses.slice(0, 3).map((dataClass, index) => (
            <span key={index} className="data-class">{dataClass}</span>
          ))}
          {breach.DataClasses.length > 3 && (
            <span className="data-class more">+{breach.DataClasses.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ScanningOverlay = ({ progress, message, breaches = [] }) => {
  return (
    <div className="scanning-overlay">
      <div className="scanning-container">
        <div className="scanning-animation">
          <div className="scanning-shield">
            <FaShieldAlt />
          </div>
          <div className="scanning-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
            <div className="ring ring-4"></div>
          </div>
        </div>

        <div className="scanning-content">
          <div className="scanning-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text">{Math.round(progress)}%</div>
          </div>

          <div className="scanning-message">
            <p>{message}</p>
            <TypingDots />
          </div>

          {breaches.length > 0 && (
            <div className="breaches-container">
              {breaches.map((breach, index) => (
                <BreachCard key={breach.Name + index} breach={breach} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanningOverlay;