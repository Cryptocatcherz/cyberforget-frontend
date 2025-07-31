import React, { useState, useEffect } from 'react';
import './EnhancedReportViewer.css';

const EnhancedReportViewer = ({ scanId, reportId }) => {
  const [reportData, setReportData] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reportId || scanId) {
      fetchReportData();
      fetchScreenshots();
    }
  }, [reportId, scanId]);

  const fetchReportData = async () => {
    if (!reportId) return;
    
    try {
      const response = await fetch(`http://localhost:5002/api/reports/summary/${reportId}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error);
      setError('Failed to load report data');
    }
  };

  const fetchScreenshots = async () => {
    if (!scanId) return;
    
    try {
      const response = await fetch(`http://localhost:5002/api/reports/screenshots/${scanId}`);
      if (response.ok) {
        const data = await response.json();
        setScreenshots(data.screenshots || []);
      }
    } catch (error) {
      console.error('Failed to fetch screenshots:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (reportData?.downloadUrl) {
      window.open(`http://localhost:5002${reportData.downloadUrl}`, '_blank');
    }
  };

  const openScreenshot = (screenshot) => {
    setSelectedScreenshot(screenshot);
  };

  const closeScreenshot = () => {
    setSelectedScreenshot(null);
  };

  const formatRiskLevel = (level) => {
    const riskColors = {
      'Critical': '#dc2626',
      'High': '#d97706', 
      'Medium': '#ca8a04',
      'Low': '#16a34a',
      'None': '#6b7280'
    };
    
    return (
      <span 
        className="risk-badge"
        style={{ 
          backgroundColor: riskColors[level] || '#6b7280',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        {level}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="enhanced-report-viewer loading">
        <div className="loading-spinner"></div>
        <p>Loading enhanced report data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="enhanced-report-viewer error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="enhanced-report-viewer">
      {/* Report Summary */}
      {reportData && (
        <div className="report-summary">
          <div className="report-header">
            <h3>📊 Enhanced Scan Report</h3>
            <button className="download-btn" onClick={downloadReport}>
              📥 Download Full Report
            </button>
          </div>
          
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-number">{reportData.summary.totalSitesScanned}</span>
              <span className="summary-label">Sites Scanned</span>
            </div>
            <div className="summary-item">
              <span className="summary-number">{reportData.summary.sitesWithData}</span>
              <span className="summary-label">Sites with Data</span>
            </div>
            <div className="summary-item">
              <span className="summary-number">{reportData.summary.totalDataPoints}</span>
              <span className="summary-label">Data Points</span>
            </div>
            <div className="summary-item">
              <span className="summary-number">{reportData.summary.urgentActions}</span>
              <span className="summary-label">Urgent Actions</span>
            </div>
          </div>

          <div className="risk-assessment">
            <span>Overall Risk Level: </span>
            {formatRiskLevel(reportData.summary.riskLevel)}
          </div>
        </div>
      )}

      {/* Screenshots Gallery */}
      {screenshots.length > 0 && (
        <div className="screenshots-section">
          <h4>🔍 Evidence Screenshots ({screenshots.length})</h4>
          <div className="screenshots-gallery">
            {screenshots.map((screenshot, index) => (
              <div 
                key={index}
                className="screenshot-thumbnail"
                onClick={() => openScreenshot(screenshot)}
              >
                <img 
                  src={`http://localhost:5002${screenshot.path}`}
                  alt={`Evidence ${index + 1}`}
                  loading="lazy"
                />
                <div className="screenshot-overlay">
                  <span className="screenshot-type">
                    {screenshot.type === 'targeted' ? '🎯' : '📄'}
                    {screenshot.type}
                  </span>
                  <span className="screenshot-size">
                    {(screenshot.size / 1024).toFixed(1)}KB
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data Message */}
      {!reportData && screenshots.length === 0 && (
        <div className="no-data">
          <p>📋 No enhanced report data available for this scan.</p>
          <p>Enhanced reports will be generated for new scans using the local scanner.</p>
        </div>
      )}

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="screenshot-modal" onClick={closeScreenshot}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Evidence Screenshot</h4>
              <button className="close-btn" onClick={closeScreenshot}>✕</button>
            </div>
            <div className="modal-body">
              <img 
                src={`http://localhost:5002${selectedScreenshot.path}`}
                alt="Evidence"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <div className="screenshot-details">
                <p><strong>Type:</strong> {selectedScreenshot.type}</p>
                <p><strong>Size:</strong> {(selectedScreenshot.size / 1024).toFixed(1)}KB</p>
                <p><strong>Captured:</strong> {new Date(selectedScreenshot.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedReportViewer;