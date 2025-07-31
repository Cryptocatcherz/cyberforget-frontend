// Email Breach Tool - Check email for data breaches
import React, { useState } from 'react';
import BaseTool, { ToolResult, ToolLoading, ToolError } from './BaseTool';
import { FaEnvelope, FaShieldAlt, FaExclamationTriangle, FaSearch, FaDatabase } from 'react-icons/fa';
import CyberForgetEmailWiper from '../../../services/breachService';
import './EmailBreachTool.css';

const EmailBreachTool = ({ onComplete, onClose }) => {
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCheck = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const breachResult = await CyberForgetEmailWiper.checkEmailBreaches(email);
      
      const resultData = {
        email: email,
        isCompromised: breachResult.status === 'compromised',
        breachCount: breachResult.count || 0,
        breaches: breachResult.breaches || [],
        riskLevel: breachResult.riskLevel || 'low'
      };

      setResult(resultData);
      
      // Send result back to chat
      onComplete({
        type: 'email_breach',
        data: resultData,
        summary: `Email ${email}: ${
          resultData.isCompromised 
            ? `⚠️ Found in ${resultData.breachCount} breaches` 
            : '✅ No breaches found'
        }`
      });

    } catch (err) {
      setError('Failed to check email. Please try again.');
      console.error('Email check error:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isChecking) {
      handleCheck();
    }
  };

  return (
    <BaseTool
      toolName="Email Breach Scanner"
      toolIcon="📧"
      toolDescription="Check if your email appears in known data breaches"
      onClose={onClose}
      className="email-breach-tool"
    >
      <div className="email-breach-content">
        <div className="email-input-section">
          <div className="email-input-wrapper">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
                setResult(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter email address..."
              className="email-input"
              autoComplete="email"
            />
          </div>
          
          <button 
            className="check-btn"
            onClick={handleCheck}
            disabled={!email || isChecking}
          >
            <FaShieldAlt className="check-btn-icon" />
            Check for Breaches
          </button>
          
          <div className="scan-description">
            <FaDatabase className="description-icon" />
            <p>Scanning <strong>15+ billion</strong> breach records across major incidents including Equifax, Yahoo, LinkedIn, and 500+ other data breaches to identify where your email has been exposed.</p>
          </div>
        </div>

        {isChecking && (
          <ToolLoading message="Scanning billions of breach records..." />
        )}

        {error && (
          <ToolError error={error} onRetry={handleCheck} />
        )}

        {result && !isChecking && (
          <ToolResult
            status={result.isCompromised ? 'error' : 'success'}
            title={result.isCompromised ? 'Email Found in Breaches!' : 'Email is Clean'}
            message={
              result.isCompromised 
                ? `Your email was found in ${result.breachCount} data breach${result.breachCount > 1 ? 'es' : ''}.`
                : 'Your email was not found in any known data breaches.'
            }
            details={
              result.isCompromised && result.breaches.length > 0 ? (
                <div className="breach-details">
                  <h5>Affected Services:</h5>
                  <ul className="breach-list">
                    {result.breaches.slice(0, 5).map((breach, idx) => (
                      <li key={idx} className="breach-item">
                        <strong>{breach.name || breach.Name}</strong>
                        {(breach.date || breach.BreachDate) && <span className="breach-date"> ({breach.date || breach.BreachDate})</span>}
                        {(breach.dataClasses || breach.DataClasses) && (
                          <div className="data-classes">
                            Exposed: {(breach.dataClasses || breach.DataClasses).join(', ')}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  {result.breaches.length > 5 && (
                    <p className="more-breaches">...and {result.breaches.length - 5} more breaches</p>
                  )}
                </div>
              ) : null
            }
            actions={[
              {
                label: 'Check Another Email',
                icon: '🔄',
                variant: 'secondary',
                onClick: () => {
                  setEmail('');
                  setResult(null);
                }
              },
              ...(result.isCompromised ? [{
                label: 'Run Data Broker Scan',
                icon: '🔍',
                variant: 'primary',
                onClick: () => {
                  // This would trigger the data broker scan tool
                  onComplete({
                    type: 'trigger_tool',
                    tool: '/data-broker-scan',
                    context: `Email ${email} was compromised, running broader scan`
                  });
                }
              }] : [])
            ]}
          />
        )}
      </div>
    </BaseTool>
  );
};

export default EmailBreachTool;