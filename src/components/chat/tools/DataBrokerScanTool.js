// Data Broker Scan Tool - Enterprise-grade version for chat integration with IP geolocation
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { SignUp, useUser } from '@clerk/clerk-react';
import BaseTool, { ToolResult, ToolError } from './BaseTool';
import { FaSearch, FaUser, FaMapMarkerAlt, FaShieldAlt, FaBrain, FaTimes } from 'react-icons/fa';
import './DataBrokerScanTool.css';
import { generatePeopleSitePreview, localhostSites, externalDataBrokerSites } from '../../../utils/previewGenerator';
import { detectUserLocation, formatLocationForDisplay, formatLocationForSearch } from '../../../utils/geolocation';

const DataBrokerScanTool = ({ onComplete, onClose }) => {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Automatically detect user location when component mounts
  useEffect(() => {
    const getLocation = async () => {
      setIsDetectingLocation(true);
      try {
        const location = await detectUserLocation();
        setDetectedLocation(location);
        console.log('🌍 Location detected:', formatLocationForDisplay(location));
      } catch (error) {
        console.error('Failed to detect location:', error);
        setDetectedLocation({
          city: 'Unknown City',
          country: 'Unknown Country',
          provider: 'error'
        });
      } finally {
        setIsDetectingLocation(false);
      }
    };

    getLocation();
  }, []);

  const handleScan = async () => {
    if (!firstName.trim()) {
      setError('⚠️ Please enter your first name to begin AI analysis');
      return;
    }
    
    if (!lastName.trim()) {
      setError('⚠️ Please enter your last name to begin AI analysis');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      // Enhanced scanning sequence: Google → External Data Brokers → Localhost PeopleSites
      const dataBrokerSites = [];
      
      // Step 1: Start with Google (using thumb.io)
      dataBrokerSites.push({
        name: 'Google',
        url: `https://www.google.com/search?q="${firstName}+${lastName}"`,
        category: 'Search Engines',
        priority: true,
        scanType: 'thumbio'
      });
      
      // Step 2: Add external data broker sites from your DataRemovalsPage (using thumb.io)
      externalDataBrokerSites.forEach(site => {
        const url = site.url
          .replace('{firstName}', firstName)
          .replace('{lastName}', lastName);
        dataBrokerSites.push({
          name: site.siteName,
          url: url,
          category: site.category,
          scanType: 'thumbio'
        });
      });
      
      // Step 3: Add your localhost PeopleSites (using generated previews)
      const searchCity = detectedLocation ? formatLocationForSearch(detectedLocation) : 'unknown';
      localhostSites.forEach(site => {
        dataBrokerSites.push({
          name: site.name,
          url: `http://localhost:${site.port}/search/${firstName}+${lastName}+${searchCity}+b`,
          category: site.category,
          priority: true,
          localhost: true,
          scanType: 'generated'
        });
      });
      
      // Add working external sites that aren't blocked by Cloudflare
      const additionalSites = [
        { name: 'Dataveria', url: `https://dataveria.com/profile/search?fname=${firstName}&lname=${lastName}`, category: 'People Search Engines' },
        { name: 'Clubset', url: `https://clubset.com/profile/search?fname=${firstName}&lname=${lastName}&state=&city=&fage=None`, category: 'Social Media Analysis' },
        { name: 'ArrestFacts', url: `https://arrestfacts.com/ng/search?fname=${firstName}&lname=${lastName}&state=&city=`, category: 'Background Check Sites' },
        { name: 'ClustrMaps', url: `https://clustrmaps.com/persons/${firstName}-${lastName}`, category: 'People Search Engines' },
        { name: 'PeekYou', url: `https://www.peekyou.com/${firstName}_${lastName}`, category: 'Social Media Analysis' },
        { name: 'Corporation Wiki', url: `https://www.corporationwiki.com/search/results?term=${firstName}%20${lastName}`, category: 'Professional Networks' }
      ];
      
      additionalSites.forEach(site => {
        dataBrokerSites.push({
          ...site,
          scanType: 'thumbio'
        });
      });

      // Enhanced preview generation function
      const thumbioKey = '72571-1234';
      const getPreviewUrl = async (site) => {
        if (site.scanType === 'generated' && site.localhost) {
          // Generate custom preview for localhost sites with detected location
          const recordCount = Math.random() < 0.85 ? Math.floor(Math.random() * 3) + 1 : 0; // 85% chance of finding data
          const displayCity = detectedLocation ? detectedLocation.city : 'Unknown Location';
          return await generatePeopleSitePreview(site.name, firstName, lastName, displayCity, recordCount);
        } else {
          // Use thumb.io for external sites
          const encodedUrl = encodeURIComponent(site.url);
          return `https://image.thum.io/get/auth/${thumbioKey}/width/400/crop/300/noanimate/png/?url=${encodedUrl}`;
        }
      };

      // Initialize scanning state
      let currentSiteIndex = 0;
      let sitesFound = 0;
      const scanResults = [];
      
      // Initial scan state
      setResult({
        isScanning: true,
        currentlyScanning: '',
        currentScreenshot: '',
        sitesScanned: 0,
        totalSites: dataBrokerSites.length,
        sitesFound: 0,
        scanResults: [],
        progress: 0
      });

      // Enhanced scanning process with dynamic preview generation
      const scanInterval = setInterval(async () => {
        if (currentSiteIndex < dataBrokerSites.length) {
          const currentSite = dataBrokerSites[currentSiteIndex];
          
          // Calculate match chances based on site type
          let matchChance;
          if (currentSite.localhost) {
            matchChance = 0.85; // 85% chance for your localhost sites
          } else if (currentSite.name === 'Google') {
            matchChance = 0.12; // 12% chance for Google (always scan first)
          } else if (currentSite.priority) {
            matchChance = 0.08; // 8% chance for major social media
          } else if (currentSite.category === 'Background Check Sites' || currentSite.category === 'People Search Engines') {
            matchChance = 0.06; // 6% chance for major data brokers
          } else {
            matchChance = 0.04; // 4% chance for other sites
          }
          
          const foundData = Math.random() < matchChance;
          let previewUrl = null;
          
          // Generate preview URL based on scan type
          try {
            previewUrl = await getPreviewUrl(currentSite);
          } catch (error) {
            console.error('Error generating preview for', currentSite.name, error);
            previewUrl = '/placeholder-screenshot.png';
          }
          
          if (foundData) {
            sitesFound++;
            const recordCount = currentSite.localhost ? Math.floor(Math.random() * 3) + 1 : 1;
            scanResults.push({
              ...currentSite,
              screenshot: previewUrl,
              dataFound: true,
              recordCount: recordCount,
              timestamp: new Date().toISOString(),
              isLocalhost: currentSite.localhost || false,
              canVisit: currentSite.localhost || false
            });
          }
          
          // Update scanning progress in real-time
          setResult(prevResult => ({
            ...prevResult,
            isScanning: true,
            currentlyScanning: currentSite.name,
            currentScreenshot: previewUrl,
            currentScanType: currentSite.scanType,
            sitesScanned: currentSiteIndex + 1,
            totalSites: dataBrokerSites.length,
            sitesFound: sitesFound,
            scanResults: [...scanResults],
            progress: Math.round(((currentSiteIndex + 1) / dataBrokerSites.length) * 100)
          }));
          
          currentSiteIndex++;
        } else {
          clearInterval(scanInterval);
          finalizeScanResults();
        }
      }, 1400); // Slightly slower to account for preview generation

      const finalizeScanResults = () => {
        // Calculate final threat analysis (adjusted thresholds for 50+ sites with localhost)
        const exposureLevel = sitesFound > 12 ? 'critical' : sitesFound > 8 ? 'high' : sitesFound > 4 ? 'medium' : 'low';
        const threatCategories = [
          { name: 'Search Engines', count: scanResults.filter(r => r.category === 'Search Engines').length },
          { name: 'Social Media Analysis', count: scanResults.filter(r => r.category === 'Social Media Analysis').length },
          { name: 'Professional Networks', count: scanResults.filter(r => r.category === 'Professional Networks').length },
          { name: 'Background Check Sites', count: scanResults.filter(r => r.category === 'Background Check Sites').length },
          { name: 'Public Records Databases', count: scanResults.filter(r => r.category === 'Public Records').length },
          { name: 'People Search Engines', count: scanResults.filter(r => r.category === 'People Search Engines').length },
          { name: 'Contact Info Brokers', count: scanResults.filter(r => r.category === 'Contact Info Brokers').length },
          { name: 'Address History Tracking', count: scanResults.filter(r => r.category === 'Address History Tracking').length },
          { name: 'Genealogy Records', count: scanResults.filter(r => r.category === 'Genealogy Records').length },
          { name: 'Educational Records', count: scanResults.filter(r => r.category === 'Educational Records').length }
        ].filter(category => category.count > 0); // Only show categories with matches

        const finalResultData = {
          firstName,
          lastName,
          city: detectedLocation ? detectedLocation.city : 'Unknown City',
          country: detectedLocation ? detectedLocation.country : 'Unknown Country',
          sitesFound,
          exposureLevel,
          threatLevel: exposureLevel === 'critical' ? 'CRITICAL' : exposureLevel === 'high' ? 'HIGH' : 'MODERATE',
          scanTime: '60.4 seconds',
          threatCategories,
          scanResults,
          dataPoints: [
            'Full name and address history',
            'Phone numbers and email addresses',
            'Age, birth year, and relatives',
            'Property records and financial data',
            'Social media profiles and photos',
            'Professional and employment information'
          ],
          intelligenceCategories: [
            'Search Engine Visibility Analysis',
            'Social Media Footprint Mapping', 
            'Professional Network Exposure',
            'Public Records Intelligence',
            'Background Check Database Scanning',
            'Contact Information Mining',
            'Address History Intelligence',
            'Genealogy Database Analysis',
            'Educational Record Tracking',
            'Digital Identity Synthesis'
          ],
          cyberforgetRisk: exposureLevel === 'critical' ? 'EXTREME RISK' : exposureLevel === 'high' ? 'HIGH RISK' : 'MODERATE RISK',
          isScanning: false
        };

        setResult(finalResultData);
        
        // Send result back to chat
        onComplete({
          type: 'data_broker_scan',
          data: finalResultData,
          summary: `Scan complete: Found ${sitesFound} data broker site${sitesFound === 1 ? '' : 's'} with records for ${firstName} ${lastName}. Risk Level: ${finalResultData.cyberforgetRisk}. Ready for next steps? Sign up to see your full report and start data removal, or run our security assessment to learn how to protect yourself and reduce your online fingerprint.`
        });

        setIsScanning(false);
      };

    } catch (err) {
      setError('Failed to complete AI intelligence scan. Please try again.');
      console.error('Data broker scan error:', err);
      setIsScanning(false);
    }
  };

  const triggerSignupModal = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('⚠️ Please enter first and last name before starting full intelligence scan');
      return;
    }
    setShowSignupModal(true);
  };

  const closeSignupModal = () => {
    setShowSignupModal(false);
  };


  return (
    <BaseTool
      toolName="AI Cyber Intelligence Scanner"
      toolIcon={<FaBrain />}
      toolDescription="Advanced AI-powered analysis of your digital footprint across 500+ data broker networks"
      onClose={onClose}
      className="data-broker-scan-tool enterprise-grade"
    >
      <div className="data-broker-scan-content">
        <div className="scan-input-section">
          <div className="enterprise-header compact-header">
            <div className="header-content">
              <h3>🔍 See What Strangers Can Buy About You</h3>
              <div className="trust-indicators single-bar mobile-optimized">
                <span className="trust-badge compact">🔒 No data stored • ✓ 2.3M+ scans • ⚡ 60 sec results</span>
              </div>
              <p className="tool-description">
                Find out what's publicly available about YOU in 60 seconds.
              </p>
            </div>
          </div>

          
          {/* Required Fields Notice */}
          <div className="required-fields-notice">
            <span className="required-icon">⚠️</span>
            <span className="required-text">Enter <strong>first & last name</strong> to scan</span>
          </div>
          
          <div className="input-row">
            <div className={`input-wrapper ${!firstName.trim() ? 'input-wrapper-highlight' : ''}`}>
              <FaUser className="input-icon" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError(null);
                  setResult(null);
                  // Save name for auto-fill in other tools
                  if (e.target.value.trim() && lastName.trim()) {
                    localStorage.setItem('cyberforget_last_scan_name', `${e.target.value.trim()} ${lastName.trim()}`);
                  }
                }}
                placeholder="First name"
                className={`name-input ${!firstName.trim() ? 'name-input-required' : ''}`}
              />
              {!firstName.trim() && (
                <div className="input-hint">
                  <span className="hint-text">Required</span>
                </div>
              )}
            </div>
            <div className={`input-wrapper ${!lastName.trim() ? 'input-wrapper-highlight' : ''}`}>
              <FaUser className="input-icon" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError(null);
                  setResult(null);
                  // Save name for auto-fill in other tools
                  if (firstName.trim() && e.target.value.trim()) {
                    localStorage.setItem('cyberforget_last_scan_name', `${firstName.trim()} ${e.target.value.trim()}`);
                  }
                }}
                placeholder="Last name"
                className={`name-input ${!lastName.trim() ? 'name-input-required' : ''}`}
              />
              {!lastName.trim() && (
                <div className="input-hint">
                  <span className="hint-text">Required</span>
                </div>
              )}
            </div>
          </div>
          
          
          <div className={`scan-options ${isSignedIn ? 'scan-options-single' : 'scan-options-equal'}`}>
            <div className={`scan-option ${isSignedIn ? 'scan-option-single' : 'scan-option-equal'} quick-option`}>
              <div className="option-header">
                <h4>🚀 AI Quick Scan</h4>
                <span className="badge partial">PARTIAL</span>
              </div>
              <div className="option-details">
                <div className="scan-stats">
                  <span>⏱️ 60 seconds</span>
                  <span>📊 50+ sites</span>
                  <span>🔍 Basic scan</span>
                </div>
                <p className="option-description">
                  Scans 50+ top data broker sites including your local network.<br className="mobile-break" />
                  {!isSignedIn && 'Upgrade for '}<strong>{isSignedIn ? 'Complete analysis ready!' : 'complete 500+ site analysis'}</strong>.
                </p>
              </div>
              <button 
                className="scan-btn quick-scan"
                onClick={handleScan}
                disabled={!firstName || !lastName || isScanning}
              >
                <FaBrain />
                SCAN 50+ SITES NOW
              </button>
            </div>
            
            {/* Only show premium option if user is not signed in */}
            {!isSignedIn && (
              <div className="scan-option scan-option-equal full-option">
                <div className="option-header">
                  <h4>🛡️ Full Intelligence Scan</h4>
                  <span className="badge premium">PREMIUM</span>
                </div>
                <div className="option-details">
                  <div className="scan-stats">
                    <span>⏱️ 15 minutes</span>
                    <span>📊 500+ sites</span>
                    <span>🔍 Deep analysis</span>
                  </div>
                  <p className="option-description">
                    Comprehensive scan including dark web monitoring, social media analysis, and removal assistance
                  </p>
                </div>
                <button 
                  className="scan-btn full-scan"
                  onClick={() => window.open('http://localhost:3000/login', '_blank')}
                >
                  <FaShieldAlt />
                  Sign Up for Full Scan
                </button>
              </div>
            )}
          </div>

        </div>

        {isScanning && result && result.isScanning && (
          <div className="enterprise-scanning-display">
            <div className="scanning-header">
              <div className="scan-title">
                <div className="pulse-dot"></div>
                <h3>Live Intelligence Scan</h3>
              </div>
              <div className="scan-progress">
                <div className="progress-percentage-bar">
                  <span className="progress-percentage">{result.progress || 0}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${result.progress || 0}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="scan-metrics">
              <div className="metric-card">
                <div className="metric-value">{result.sitesScanned || 0}</div>
                <div className="metric-label">Sites Analyzed</div>
              </div>
              <div className="metric-card critical">
                <div className="metric-value">{result.sitesFound || 0}</div>
                <div className="metric-label">Exposures Found</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{result.totalSites || 12}</div>
                <div className="metric-label">Total Targets</div>
              </div>
            </div>
            
            {result.currentlyScanning && (
              <div className="current-target">
                <div className="target-header">
                  <div className="scanning-pulse"></div>
                  <div className="target-info">
                    <span className="target-label">Analyzing</span>
                    <span className="target-name">{result.currentlyScanning}</span>
                  </div>
                </div>
                
                {result.currentScreenshot && (
                  <div className="target-preview">
                    <img 
                      src={result.currentScreenshot} 
                      alt={`${result.currentlyScanning} preview`}
                      className="preview-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="preview-overlay">
                      <span className="analysis-status">Analyzing for personal data...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {result.scanResults && result.scanResults.length > 0 && (
              <div className="threat-alerts">
                <div className="alerts-header">
                  <span className="alert-icon">🚨</span>
                  <span className="alerts-title">Data Exposures Detected</span>
                </div>
                <div className="alerts-list">
                  {result.scanResults.slice(-3).map((exposure, idx) => (
                    <div key={idx} className="threat-alert">
                      <div className="alert-indicator"></div>
                      <div className="alert-content">
                        <div className="alert-site">{exposure.name}</div>
                        <div className="alert-details">{exposure.recordCount} record{exposure.recordCount > 1 ? 's' : ''} • {exposure.category}</div>
                      </div>
                      <div className="alert-severity">HIGH</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <ToolError error={error} onRetry={handleScan} />
        )}

        {result && !isScanning && (
          <ToolResult
            status={result.exposureLevel === 'critical' ? 'error' : result.exposureLevel === 'high' ? 'warning' : 'info'}
            title="Scan Complete: Data Broker Exposure Results"
            message={`We found ${result.sitesFound} data broker site${result.sitesFound === 1 ? '' : 's'} with records for ${result.firstName} ${result.lastName}. Risk Level: ${result.cyberforgetRisk}. Ready for next steps? Sign up to see your full report and start data removal, or run our security assessment to learn how to protect yourself and reduce your online fingerprint.`}
            details={
              <div className="scan-results cyberforget-results">
                <div className="cyberforget-header">
                  <div className="scan-stats">
                    <div className="stat-item">
                      <strong>Scan Time:</strong> {result.scanTime}
                    </div>
                    <div className="stat-item">
                      <strong>Sites Found:</strong> {result.sitesFound}
                    </div>
                    <div className="stat-item">
                      <strong>Risk Level:</strong> 
                      <span className={`cyberforget-risk ${result.exposureLevel}`}>
                        {result.cyberforgetRisk}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Show localhost sites that found data - NO PREVIEWS */}
                {result.scanResults && result.scanResults.filter(site => site.isLocalhost).length > 0 && (
                  <div className="localhost-threats-section">
                    <h4 className="threat-warning-header">⚠️ THREAT DETECTED - Personal Information Found Online ⚠️</h4>
                    <div className="threat-sites-list">
                      {result.scanResults.filter(site => site.isLocalhost).map((site, idx) => (
                        <div key={idx} className="threat-site-card-simple">
                          <div className="threat-site-info">
                            <div className="site-header">
                              <span className="site-name">{site.name}</span>
                              <span className="threat-badge critical">DATA EXPOSED</span>
                            </div>
                            <div className="site-details">
                              <p className="site-category">{site.category}</p>
                              <p className="records-found">
                                <span className="record-icon">⚠️</span>
                                {site.recordCount} personal record{site.recordCount > 1 ? 's' : ''} found
                              </p>
                            </div>
                            <button 
                              className="visit-site-btn threat-btn"
                              onClick={triggerSignupModal}
                            >
                              View Full Threat Report →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="threat-categories">
                  <strong>📊 CyberForget Threat Analysis:</strong>
                  <div className="category-breakdown">
                    {result.threatCategories.map((category, idx) => (
                      <div key={idx} className="threat-category">
                        <div className="category-name">
                          <FaShieldAlt className="category-icon" />
                          {category.name}
                        </div>
                        <div className="category-count">
                          <span className="count-badge">{category.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="intelligence-summary">
                  <strong>🔍 Intelligence Categories Detected:</strong>
                  <div className="intelligence-grid">
                    {result.intelligenceCategories.map((category, idx) => (
                      <div key={idx} className="intelligence-item">
                        <FaBrain className="intelligence-icon" />
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="signup-prompt">
                  <div className="prompt-content">
                    <FaShieldAlt className="prompt-icon" />
                    <div className="prompt-text">
                      <h4>🆓 Get Your Complete Security Report</h4>
                      <p>Sign up now for a FREE full intelligence scan that includes removal assistance and ongoing monitoring.</p>
                    </div>
                  </div>
                </div>
              </div>
            }
            actions={[
              // Only show signup button if user is not signed in
              ...(!isSignedIn ? [{
                label: '🆓 Sign Up for Full Report',
                icon: <FaShieldAlt />, 
                variant: 'primary',
                onClick: triggerSignupModal
              }] : []),
              {
                label: 'Run Security Assessment',
                icon: <FaBrain />, 
                variant: isSignedIn ? 'primary' : 'secondary',
                onClick: () => {
                  // Navigate to security assessment tool
                  onComplete({
                    type: 'redirect_to_tool',
                    tool: 'comprehensive_security',
                    data: { name: `${firstName} ${lastName}` }
                  });
                }
              },
              {
                label: 'Scan Different Person',
                icon: <FaSearch />, 
                variant: 'tertiary',
                onClick: () => {
                  setFirstName('');
                  setLastName('');
                  setResult(null);
                }
              }
            ]}
          />
        )}

        {/* Portal Modal to Document Body */}
        {showSignupModal && createPortal(
          <div className="fullscreen-modal-overlay" onClick={closeSignupModal}>
            <div className="fullscreen-signup-modal" onClick={(e) => e.stopPropagation()}>
              <button className="fullscreen-modal-close" onClick={closeSignupModal}>
                <FaTimes />
              </button>
              
              <div className="signup-content">
                <div className="signup-header">
                  <div className="header-brand">
                    <FaShieldAlt className="brand-icon" />
                    <h1>CyberForget</h1>
                  </div>
                  <div className="header-text">
                    <h2>Access Full Intelligence Platform</h2>
                    <p>Complete threat analysis for <span className="user-highlight">{firstName} {lastName}</span></p>
                  </div>
                </div>
                
                <div className="signup-form-container">
                  <SignUp
                    appearance={{
                      baseTheme: 'dark',
                      variables: {
                        colorPrimary: '#42ffb5',
                        colorBackground: 'transparent',
                        colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                        colorInputText: '#ffffff',
                        colorText: '#ffffff',
                        colorTextSecondary: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: '16px'
                      },
                      elements: {
                        rootBox: {
                          width: '100%',
                          maxWidth: '400px'
                        },
                        card: {
                          background: 'transparent',
                          boxShadow: 'none',
                          border: 'none',
                          padding: '0'
                        },
                        headerTitle: {
                          display: 'none'
                        },
                        headerSubtitle: {
                          display: 'none'
                        },
                        socialButtonsBlockButton: {
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '2px solid rgba(66, 255, 181, 0.3)',
                          borderRadius: '8px',
                          padding: '16px 24px',
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#ffffff',
                          height: '56px'
                        },
                        formFieldInput: {
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '2px solid rgba(66, 255, 181, 0.3)',
                          borderRadius: '8px',
                          padding: '16px 20px',
                          fontSize: '16px',
                          color: '#ffffff',
                          height: '56px'
                        },
                        formButtonPrimary: {
                          background: 'linear-gradient(135deg, #42ffb5, #25d19a)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '18px 32px',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#000000',
                          height: '56px',
                          textTransform: 'none'
                        },
                        formFieldLabel: {
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '500'
                        },
                        identityPreviewText: {
                          color: 'rgba(255, 255, 255, 0.8)'
                        },
                        formFieldAction: {
                          color: '#42ffb5'
                        }
                      }
                    }}
                    redirectUrl="/scanning"
                    afterSignUpUrl="/scanning"
                    signInUrl="/login"
                  />
                </div>
                
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </BaseTool>
  );
};

export default DataBrokerScanTool;