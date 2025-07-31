import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShieldAlt, FaEnvelope } from 'react-icons/fa';

const EmailScanPopup = ({ isOpen, onClose, onScan }) => {
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    // Prevent body scroll when popup is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('popup-open');
            // Scroll popup to top when it opens
            setTimeout(() => {
                const popup = document.querySelector('.email-popup');
                if (popup) {
                    popup.scrollTop = 0;
                }
            }, 100);
        } else {
            document.body.classList.remove('popup-open');
        }

        return () => {
            document.body.classList.remove('popup-open');
        };
    }, [isOpen]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setIsValidEmail(validateEmail(value));
    };

    const handleScan = async () => {
        if (isValidEmail && !isScanning) {
            setIsScanning(true);
            try {
                await onScan(email);
                onClose();
                setEmail('');
            } catch (error) {
                console.error('Scan error:', error);
            } finally {
                setIsScanning(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && isValidEmail && !isScanning) {
            handleScan();
        }
    };

    // Removed example emails - will use real API scanning

    return createPortal(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99998,
            pointerEvents: isOpen ? 'auto' : 'none'
        }}>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="email-popup-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0, 0, 0, 0.75)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                zIndex: 1
                            }}
                        />
                        
                        {/* Popup */}
                        <motion.div
                            className="email-popup"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '90%',
                                maxWidth: '600px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                zIndex: 10002
                            }}
                        >
                            {/* Header */}
                            <div className="email-popup-header">
                                <div className="popup-title-section">
                                    <FaShieldAlt className="popup-icon" />
                                    <div>
                                        <h2>CleanData Email Wiper</h2>
                                        <p>Advanced Email Security Scanner - Powered by 12+ Billion Records</p>
                                    </div>
                                </div>
                                <button className="popup-close" onClick={onClose}>
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="email-popup-content">
                                {/* How It Works Section */}
                                <div className="how-it-works-section">
                                    <h3>🔍 How Our Email Scanner Works</h3>
                                    <div className="process-steps">
                                        <div className="step">
                                            <span className="step-number">1</span>
                                            <div className="step-content">
                                                <strong>Instant Analysis</strong>
                                                <p>We check your email against our comprehensive database of 12+ billion compromised records from 850+ verified data sources</p>
                                            </div>
                                        </div>
                                        <div className="step">
                                            <span className="step-number">2</span>
                                            <div className="step-content">
                                                <strong>Breach Detection</strong>
                                                <p>Our system identifies any data breaches where your email appeared, including breach dates and exposed data types</p>
                                            </div>
                                        </div>
                                        <div className="step">
                                            <span className="step-number">3</span>
                                            <div className="step-content">
                                                <strong>Detailed Report</strong>
                                                <p>Get a comprehensive security report with actionable recommendations to protect your accounts</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="email-input-section">
                                    <label htmlFor="email-input">Enter Email Address to Scan</label>
                                    <div className="input-description">
                                        <p>💡 <strong>Pro Tip:</strong> Use an old email address you don't actively use anymore for the most interesting results. This helps you understand your digital footprint without compromising current accounts.</p>
                                    </div>
                                    <div className={`email-input-wrapper ${isValidEmail ? 'valid' : email ? 'invalid' : ''}`}>
                                        <FaEnvelope className="input-icon" />
                                        <input
                                            id="email-input"
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            onKeyPress={handleKeyPress}
                                            placeholder="example@gmail.com"
                                            autoFocus
                                        />
                                    </div>
                                    {email && !isValidEmail && (
                                        <span className="email-error">Please enter a valid email address</span>
                                    )}
                                    
                                    {/* Scan button that appears below input when valid */}
                                    {isValidEmail && (
                                        <motion.button
                                            className="email-scan-button"
                                            onClick={handleScan}
                                            disabled={isScanning}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FaShieldAlt />
                                            {isScanning ? 'Scanning for breaches...' : 'Scan for Breaches'}
                                        </motion.button>
                                    )}
                                </div>

                                {/* Trust Indicators */}
                                <div className="trust-indicators">
                                    <div className="trust-item">
                                        <span className="trust-icon">🔒</span>
                                        <div>
                                            <strong>Zero Data Storage</strong>
                                            <p>Your email is never stored, logged, or shared with third parties</p>
                                        </div>
                                    </div>
                                    <div className="trust-item">
                                        <span className="trust-icon">⚡</span>
                                        <div>
                                            <strong>Instant Results</strong>
                                            <p>Get comprehensive breach analysis in under 3 seconds</p>
                                        </div>
                                    </div>
                                    <div className="trust-item">
                                        <span className="trust-icon">🛡️</span>
                                        <div>
                                            <strong>Enterprise-Grade Security</strong>
                                            <p>Used by security professionals and privacy experts worldwide</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Info */}
                                <div className="security-info">
                                    <div className="security-badge">
                                        <FaShieldAlt />
                                        <span>100% Secure & Private Scanning</span>
                                    </div>
                                    <p>Our advanced scanning technology checks your email against our curated database of verified data breaches without storing any personal information. All scans are performed in real-time and results are displayed instantly.</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="email-popup-footer">
                                <button 
                                    className="scan-button"
                                    onClick={handleScan}
                                    disabled={!isValidEmail || isScanning}
                                >
                                    <FaShieldAlt />
                                    {isScanning ? 'Scanning...' : 'Scan Email for Breaches'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>,
        document.body
    );
};

export default EmailScanPopup; 