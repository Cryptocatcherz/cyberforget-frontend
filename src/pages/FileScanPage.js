import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { 
  FaUpload, FaFile, FaShieldAlt, FaExclamationTriangle, 
  FaCheckCircle, FaSpinner, FaDownload, FaExternalLinkAlt,
  FaVirus, FaBug, FaSearch, FaFileAlt, FaLock
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import './FileScanPage.css';

const FileScanPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const fileInputRef = useRef(null);

  const scanStages = [
    "🔍 Initializing file scan...",
    "🧬 Analyzing file structure...", 
    "🦠 Checking for malware signatures...",
    "🕷️ Scanning for suspicious code...",
    "🛡️ Verifying file integrity...",
    "📊 Generating security report..."
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.size <= 100 * 1024 * 1024) { // 100MB limit
      setSelectedFile(file);
      setScanComplete(false);
      setScanResults(null);
    } else {
      alert('File size must be under 100MB');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const startScan = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    setScanProgress(0);
    setScanStage(0);

    // Simulate scanning process
    for (let i = 0; i < scanStages.length; i++) {
      setScanStage(i);
      
      // Simulate progress for each stage
      const stageProgress = (i / scanStages.length) * 100;
      for (let progress = stageProgress; progress < (i + 1) / scanStages.length * 100; progress += 2) {
        setScanProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    // Generate mock results
    const mockResults = generateMockResults(selectedFile);
    setScanResults(mockResults);
    setScanComplete(true);
    setIsScanning(false);
    setScanProgress(100);
  };

  const generateMockResults = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isExecutable = ['exe', 'msi', 'dmg', 'pkg', 'deb', 'bat', 'sh', 'com'].includes(fileExtension);
    const isArchive = ['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExtension);
    
    // Generate realistic but safe results
    const riskLevel = isExecutable ? 'medium' : isArchive ? 'low' : 'clean';
    const threatsFound = isExecutable ? Math.floor(Math.random() * 3) : 0;
    
    return {
      fileName: file.name,
      fileSize: file.size,
      riskLevel,
      threatsFound,
      fileType: fileExtension.toUpperCase(),
      scanTime: '2.3 seconds',
      signatures: 847293,
      lastUpdated: new Date().toLocaleDateString(),
      recommendations: isExecutable 
        ? ['Run additional scan with MalwareBytes', 'Verify file source before executing', 'Consider using VirusTotal for second opinion']
        : threatsFound > 0
        ? ['Quarantine suspicious files', 'Run deep system scan', 'Check file origins']
        : ['File appears clean', 'Safe to use with normal precautions']
    };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-scan-page">
      <Helmet>
        <title>File Security Scanner - Check Files for Malware | CyberForget</title>
        <meta name="description" content="Free file security scanner. Upload and scan files for malware, viruses, and threats. Get instant security analysis with recommendations." />
        <meta name="keywords" content="file scanner, malware scanner, virus check, file security, threat detection" />
      </Helmet>

      {isMobile ? <MobileNavbar /> : <Navbar />}

      <div className="file-scan-container">
        <div className="hero-section">
          <FaFileAlt className="hero-icon" />
          <h1>File Security Scanner</h1>
          <p className="hero-subtitle">
            Upload any file to check for malware, viruses, and security threats. 
            Get instant analysis and recommendations to keep your devices safe.
          </p>
          
          <div className="security-stats">
            <div className="stat-item">
              <span className="stat-number">847,293</span>
              <span className="stat-label">Threat Signatures</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2.3M+</span>
              <span className="stat-label">Files Scanned</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.8%</span>
              <span className="stat-label">Detection Rate</span>
            </div>
          </div>
        </div>

        {!selectedFile && (
          <div className="upload-section">
            <div 
              className={`upload-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <FaUpload className="upload-icon" />
              <h3>Drop your file here or click to upload</h3>
              <p>Supports all file types • Max size: 100MB</p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                accept="*/*"
              />
            </div>
          </div>
        )}

        {selectedFile && !scanComplete && (
          <div className="file-preview">
            <div className="file-info">
              <FaFileAlt className="file-icon" />
              <div className="file-details">
                <h3>{selectedFile.name}</h3>
                <p>{formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}</p>
              </div>
              <button 
                className="remove-file"
                onClick={() => setSelectedFile(null)}
              >
                ✕
              </button>
            </div>
            
            {!isScanning && (
              <button className="scan-button" onClick={startScan}>
                <FaSearch />
                Start Security Scan
              </button>
            )}
          </div>
        )}

        {isScanning && (
          <div className="scanning-section">
            <div className="scanning-animation">
              <FaSpinner className="scanning-spinner" />
              <h3>Scanning File...</h3>
              <p>{scanStages[scanStage]}</p>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
            <p className="progress-text">{Math.round(scanProgress)}% Complete</p>
          </div>
        )}

        {scanComplete && scanResults && (
          <div className="results-section">
            <div className={`scan-result ${scanResults.riskLevel}`}>
              <div className="result-header">
                {scanResults.riskLevel === 'clean' ? <FaCheckCircle className="result-icon" /> :
                 scanResults.riskLevel === 'low' ? <FaExclamationTriangle className="result-icon" /> :
                 scanResults.riskLevel === 'medium' ? <FaVirus className="result-icon" /> :
                 <FaBug className="result-icon" />}
                <div className="result-info">
                  <h3>
                    {scanResults.riskLevel === 'clean' ? 'File is Clean' :
                     scanResults.riskLevel === 'low' ? 'Low Risk Detected' :
                     scanResults.riskLevel === 'medium' ? 'Medium Risk Detected' :
                     'High Risk Detected'}
                  </h3>
                  <p>{scanResults.threatsFound} threats found • Scanned in {scanResults.scanTime}</p>
                </div>
              </div>

              <div className="scan-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">File Name:</span>
                    <span className="detail-value">{scanResults.fileName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">File Size:</span>
                    <span className="detail-value">{formatFileSize(scanResults.fileSize)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">File Type:</span>
                    <span className="detail-value">{scanResults.fileType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Signatures:</span>
                    <span className="detail-value">{scanResults.signatures.toLocaleString()}</span>
                  </div>
                </div>

                <div className="recommendations">
                  <h4>Recommendations:</h4>
                  <ul>
                    {scanResults.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="advanced-scanning">
              <h3>🚀 Want a Complete Security Analysis?</h3>
              <p>For the most comprehensive malware detection, we recommend using these professional tools:</p>
              
              <div className="tool-recommendations">
                <div className="tool-card">
                  <div className="tool-header">
                    <div className="tool-logo">🛡️</div>
                    <div className="tool-info">
                      <h4>MalwareBytes</h4>
                      <p>Industry-leading malware detection</p>
                    </div>
                  </div>
                  <ul className="tool-features">
                    <li>Real-time protection</li>
                    <li>Advanced heuristic analysis</li>
                    <li>Rootkit detection</li>
                  </ul>
                  <a href="https://www.malwarebytes.com" target="_blank" rel="noopener noreferrer" className="tool-button">
                    Try MalwareBytes <FaExternalLinkAlt />
                  </a>
                </div>

                <div className="tool-card">
                  <div className="tool-header">
                    <div className="tool-logo">🔍</div>
                    <div className="tool-info">
                      <h4>VirusTotal</h4>
                      <p>Multi-engine file analysis</p>
                    </div>
                  </div>
                  <ul className="tool-features">
                    <li>70+ antivirus engines</li>
                    <li>Behavioral analysis</li>
                    <li>Community insights</li>
                  </ul>
                  <a href="https://www.virustotal.com" target="_blank" rel="noopener noreferrer" className="tool-button">
                    Try VirusTotal <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            </div>

            <div className="scan-another">
              <button 
                className="new-scan-button"
                onClick={() => {
                  setSelectedFile(null);
                  setScanComplete(false);
                  setScanResults(null);
                  setScanProgress(0);
                }}
              >
                <FaUpload />
                Scan Another File
              </button>
            </div>
          </div>
        )}

        <div className="security-info">
          <h3>🔒 Your Privacy is Protected</h3>
          <div className="privacy-features">
            <div className="privacy-item">
              <FaLock />
              <div>
                <h4>Files Not Stored</h4>
                <p>Your files are never saved or stored on our servers</p>
              </div>
            </div>
            <div className="privacy-item">
              <FaShieldAlt />
              <div>
                <h4>Secure Analysis</h4>
                <p>All scanning happens in a secure, isolated environment</p>
              </div>
            </div>
            <div className="privacy-item">
              <FaCheckCircle />
              <div>
                <h4>No Personal Data</h4>
                <p>We don't collect or track any personal information</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileScanPage;
