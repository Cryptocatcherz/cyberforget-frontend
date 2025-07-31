// Area Code Checker Tool - Check phone numbers for scam patterns
import React, { useState } from 'react';
import BaseTool, { ToolResult, ToolLoading, ToolError } from './BaseTool';
import { FaPhone, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const AreaCodeCheckerTool = ({ onComplete, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return digits;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError(null);
    setResult(null);
  };

  const extractAreaCode = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 3) {
      return digits.slice(0, 3);
    }
    return null;
  };

  const handleCheck = async () => {
    const areaCode = extractAreaCode(phoneNumber);
    
    if (!areaCode) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      // Simulate area code lookup
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock scam detection logic
      const scamAreas = ['315', '712', '641', '712', '515']; // Known scam area codes
      const isScamArea = scamAreas.includes(areaCode);
      
      const resultData = {
        phoneNumber,
        areaCode,
        location: getAreaCodeLocation(areaCode),
        riskLevel: isScamArea ? 'high' : Math.random() < 0.3 ? 'medium' : 'low',
        scamReports: Math.floor(Math.random() * 100),
        recommendation: isScamArea ? 'Block this number' : 'Exercise normal caution'
      };

      setResult(resultData);
      
      onComplete({
        type: 'phone_check',
        data: resultData,
        summary: `Phone ${phoneNumber}: ${
          resultData.riskLevel === 'high' ? '⚠️ High scam risk' : 
          resultData.riskLevel === 'medium' ? '⚠️ Medium risk' : 
          '✅ Low risk'
        }`
      });

    } catch (err) {
      setError('Failed to check phone number. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const getAreaCodeLocation = (code) => {
    // Mock location data - in real implementation, use area code database
    const locations = {
      '315': 'Syracuse, NY',
      '712': 'Iowa (Rural)',
      '641': 'Iowa (Rural)',
      '515': 'Des Moines, IA',
      '212': 'New York, NY',
      '310': 'Los Angeles, CA',
      '415': 'San Francisco, CA',
      '305': 'Miami, FL'
    };
    return locations[code] || 'Unknown Location';
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return '#ff3b3b';
      case 'medium': return '#ffc107';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  };

  return (
    <BaseTool
      toolName="Phone Number Checker"
      toolIcon="📞"
      toolDescription="Check phone numbers and area codes for scam patterns"
      onClose={onClose}
    >
      <div className="area-code-checker-content">
        <div className="phone-input-section">
          <div className="phone-input-wrapper">
            <FaPhone className="input-icon" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="(555) 123-4567"
              className="phone-input"
              maxLength={14}
            />
          </div>
          
          <button 
            className="check-btn"
            onClick={handleCheck}
            disabled={!phoneNumber || isChecking}
          >
            <FaSearch />
            Check Number
          </button>
        </div>

        {isChecking && (
          <ToolLoading message="Checking scam databases..." />
        )}

        {error && (
          <ToolError error={error} onRetry={handleCheck} />
        )}

        {result && !isChecking && (
          <ToolResult
            status={result.riskLevel === 'high' ? 'error' : result.riskLevel === 'medium' ? 'warning' : 'success'}
            title={`Risk Level: ${result.riskLevel.toUpperCase()}`}
            message={`Area code ${result.areaCode} - ${result.location}`}
            details={
              <div className="phone-details">
                <div className="risk-indicator">
                  <span 
                    className="risk-badge"
                    style={{ backgroundColor: getRiskColor(result.riskLevel) }}
                  >
                    {result.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                
                <div className="scam-info">
                  <p><strong>Scam Reports:</strong> {result.scamReports} in the last 30 days</p>
                  <p><strong>Recommendation:</strong> {result.recommendation}</p>
                </div>

                {result.riskLevel === 'high' && (
                  <div className="warning-box">
                    <FaExclamationTriangle />
                    <p>This area code is frequently used by scammers. Be extremely cautious.</p>
                  </div>
                )}
              </div>
            }
            actions={[
              {
                label: 'Check Another Number',
                icon: '🔄',
                variant: 'secondary',
                onClick: () => {
                  setPhoneNumber('');
                  setResult(null);
                }
              },
              {
                label: 'Report as Scam',
                icon: '⚠️',
                variant: 'primary',
                onClick: () => {
                  // Would open scam reporting form
                  alert('Scam reporting feature would open here');
                }
              }
            ]}
          />
        )}
      </div>
    </BaseTool>
  );
};

export default AreaCodeCheckerTool;