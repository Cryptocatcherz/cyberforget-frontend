import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaEnvelope, FaArrowLeft, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EmailScanResult from './EmailScanResult';
import CleanDataEmailWiper from '../services/breachService';
import ScanningOverlay from './ScanningOverlay';
import Navbar from './Navbar';
import MobileNavbar from './MobileNavbar';
import './EmailScanPage.css';
import '../pages/EmailScan.css';

const EmailScanPage = () => {
    console.log('EmailScanPage component is rendering');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const theme = searchParams.get('theme') || 'default';
    
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanningMessage, setScanningMessage] = useState('');
    const [foundBreaches, setFoundBreaches] = useState([]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setIsValidEmail(validateEmail(newEmail));
        setError(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && isValidEmail) {
            handleScan();
        }
    };

    const handleDataBrokerRedirect = () => {
        window.open('https://app.cleandata.me/location', '_blank');
    };

    const handleScan = async () => {
        if (!isValidEmail) return;
        
        setIsScanning(true);
        setError(null);
        setScanProgress(0);
        setFoundBreaches([]);
        setScanningMessage('Initializing scan...');

        try {
            // Start scanning animation
            setScanProgress(20);
            setScanningMessage('Checking email against breach databases...');
            
            // Perform actual scan
            const result = await CleanDataEmailWiper.checkEmailBreaches(email);
            
            if (result.success) {
                setScanProgress(60);
                setScanningMessage('Processing breach information...');
                
                if (result.breaches && result.breaches.length > 0) {
                    setFoundBreaches(result.breaches);
                    setScanningMessage(`Found ${result.breaches.length} breaches. Analyzing...`);
                } else {
                    setScanningMessage('No breaches found. Finalizing report...');
                }
                
                setScanProgress(100);
                setScanResult(result);
            } else {
                throw new Error(result.error || 'Failed to scan email');
            }
            
        } catch (error) {
            console.error('Scan error:', error);
            setError('Unable to scan email. Please try again later.');
        } finally {
            setTimeout(() => {
                setIsScanning(false);
                setScanProgress(0);
                setScanningMessage('');
            }, 1000);
        }
    };

    if (isScanning) {
        return (
            <>
                <Navbar />
                <MobileNavbar />
                <ScanningOverlay
                    progress={scanProgress}
                    message={scanningMessage}
                    breaches={foundBreaches}
                />
            </>
        );
    }

    if (scanResult) {
        return (
            <>
                <Navbar />
                <MobileNavbar />
                <div className="email-scan-page">
                    <div className="scan-page-header">
                        <button className="back-button" onClick={() => navigate('/')}>
                            <FaArrowLeft />
                            <span>Back</span>
                        </button>
                        <h1>Security Report</h1>
                    </div>
                    
                    <EmailScanResult result={scanResult} />
                    
                    <div className="next-steps-section">
                        <div className="next-steps-card">
                            <h3><FaShieldAlt /> Your Data Needs Protection</h3>
                            <p>
                                We've detected that your personal information has been compromised. Let us help you secure your data with our comprehensive protection plan, which includes:
                            </p>
                            <ul className="protection-features">
                                <li><FaCheck /> Immediate removal from data broker sites</li>
                                <li><FaCheck /> Continuous monitoring of your personal information</li>
                                <li><FaCheck /> 24/7 protection against future exposures</li>
                                <li><FaCheck /> Expert support to secure your digital footprint</li>
                            </ul>
                            <div className="action-buttons">
                                <button 
                                    className="data-broker-button"
                                    onClick={handleDataBrokerRedirect}
                                >
                                    <FaShieldAlt />
                                    Start Free Protection Plan
                                    <FaExternalLinkAlt />
                                </button>
                                
                                <button 
                                    className="scan-another-button"
                                    onClick={() => {
                                        setScanResult(null);
                                        setEmail('');
                                        setIsValidEmail(false);
                                    }}
                                >
                                    <FaEnvelope />
                                    Scan Another Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <MobileNavbar />
            <div className="email-scan-page">
                <div className="scan-page-header">
                    <button className="back-button" onClick={() => navigate('/')}>
                        <FaArrowLeft />
                        Back to Chat
                    </button>
                    <h1>Email Security Scan</h1>
                </div>

                <div className="scan-page-content">
                    <motion.div 
                        className="scan-hero-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1>Check Your Email's Security Status</h1>
                        <p className="hero-subtitle">
                            Discover if your email has been compromised in any known data breaches. 
                            Our advanced scanning technology checks against 12B+ records instantly.
                        </p>
                    </motion.div>

                    <motion.div 
                        className="email-input-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h2>Enter Email Address to Scan</h2>
                        <div className="input-description">
                            <p>💡 <strong>Pro Tip:</strong> Use an old email address you don't actively use anymore for the most interesting results. This helps you understand your digital footprint without compromising current accounts.</p>
                        </div>
                        
                        <div className={`email-input-wrapper ${isValidEmail ? 'valid' : email ? 'invalid' : ''}`}>
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter email"
                                autoFocus
                            />
                            {isValidEmail && <FaCheck className="check-icon" />}
                        </div>
                        
                        {email && !isValidEmail && (
                            <span className="email-error">Please enter a valid email address</span>
                        )}
                        
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button 
                            className="scan-button"
                            onClick={handleScan}
                            disabled={!isValidEmail || isScanning}
                        >
                            <FaShieldAlt />
                            {isScanning ? 'Scanning...' : 'Scan Email for Breaches'}
                        </button>
                    </motion.div>

                    <motion.div 
                        className="security-info"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <div className="security-badge">
                            <FaShieldAlt />
                            <span>100% Secure & Private Scanning</span>
                        </div>
                        <p>Our advanced scanning technology checks your email against our curated database of verified data breaches without storing any personal information. All scans are performed in real-time and results are displayed instantly.</p>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default EmailScanPage;