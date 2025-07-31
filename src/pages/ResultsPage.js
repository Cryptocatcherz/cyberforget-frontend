// src/pages/ResultsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResultsPage.css';
import { 
    FaLock,
    FaExclamationTriangle, 
    FaShieldAlt, 
    FaCheck, 
    FaUserShield,
    FaGlobe,
    FaSearch,
    FaDatabase,
    FaCheckCircle,
    FaUser,
    FaPhone,
    FaFileAlt,
    FaHome,
    FaMobile,
    FaAddressCard,
    FaUserCircle,
    FaBrain,
    FaCrosshairs,
    FaNetworkWired
} from 'react-icons/fa';

// Add this utility function at the top of the file
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Add these constants at the top of the file
const RISK_LEVELS = {
    HIGH: { label: 'High', color: '#ff4444', weight: 60 }, // 60% chance
    MEDIUM: { label: 'Medium', color: '#ffbb33', weight: 30 }, // 30% chance
    LOW: { label: 'Low', color: '#00C851', weight: 10 } // 10% chance
};

// Add this function to get random risk level
const getRandomRiskLevel = () => {
    const random = Math.random() * 100;
    if (random < RISK_LEVELS.LOW.weight) {
        return RISK_LEVELS.LOW;
    } else if (random < RISK_LEVELS.LOW.weight + RISK_LEVELS.MEDIUM.weight) {
        return RISK_LEVELS.MEDIUM;
    }
    return RISK_LEVELS.HIGH;
};

const ResultsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showRedirect, setShowRedirect] = useState(false);
    
    // Get data from location state
    const { 
        threats = [], 
        firstName = '', 
        lastName = '', 
        totalMatches = 0 
    } = location.state || {};

    const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

    // Set up redirect timer
    useEffect(() => {
        // Start showing redirect message after 12 seconds
        const showRedirectTimer = setTimeout(() => {
            setShowRedirect(true);
        }, 12000);

        // Redirect after 18 seconds
        const redirectTimer = setTimeout(() => {
            document.body.classList.add('fade-out');
            setTimeout(() => {
                navigate('/pricing');
            }, 500); // Additional 0.5s for fade-out animation
        }, 18000);

        return () => {
            clearTimeout(showRedirectTimer);
            clearTimeout(redirectTimer);
            document.body.classList.remove('fade-out');
        };
    }, []);

    // Add this useEffect to scroll to the right position
    useEffect(() => {
        // Scroll to the results header when component mounts
        const resultsHeader = document.querySelector('.results-header');
        if (resultsHeader) {
            resultsHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const formatThreatMessage = (siteName, category, details) => {
        const icons = {
            'Public Records': <FaDatabase className="threat-icon" />,
            'Address History': <FaGlobe className="threat-icon" />,
            'Contact Info': <FaSearch className="threat-icon" />,
            'Social Media': <FaUserShield className="threat-icon" />,
            'Background Check': <FaExclamationTriangle className="threat-icon" />,
            'People Search': <FaSearch className="threat-icon" />
        };

        return {
            icon: icons[category] || <FaExclamationTriangle className="threat-icon" />,
            details: details || `Personal information exposed on ${siteName}`
        };
    };

    // Add this function to count threats by category
    const getCategoryCounts = (threats) => {
        const counts = threats.reduce((acc, threat) => {
            acc[threat.category] = (acc[threat.category] || 0) + 1;
            return acc;
        }, {});
        return counts;
    };

    const categoryCounts = getCategoryCounts(threats);

    return (
        <div className="results-page page-container">
            <div className="results-header">
                {totalMatches > 0 ? (
                    <>
                        <FaShieldAlt className="warning-icon" />
                        <h1>Cyber Intelligence Report</h1>
                        <h2>{threats.length} Active Threat Vectors Identified</h2>
                        <p>AI intelligence analysis detected multiple cyber exposures for {capitalizedFirstName} {capitalizedLastName}</p>
                    </>
                ) : (
                    <>
                        <FaCheckCircle className="success-icon" />
                        <h1>Cyber Intelligence Scan Complete</h1>
                        <h2>Minimal Threat Surface Detected</h2>
                        <p>Advanced AI analysis found limited exposure vectors for {capitalizedFirstName} {capitalizedLastName}</p>
                    </>
                )}
            </div>

            <div className="exposure-summary">
                <div className="stat-box">
                    <FaNetworkWired className="stat-icon" />
                    <div className="stat-content">
                        <h3>{totalMatches}</h3>
                        <p>Intelligence Sources</p>
                    </div>
                </div>
                <div className="stat-box">
                    <FaCrosshairs className="stat-icon" />
                    <div className="stat-content">
                        <h3>High Risk</h3>
                        <p>Threat Level</p>
                    </div>
                </div>
                <div className="stat-box">
                    <FaBrain className="stat-icon" />
                    <div className="stat-content">
                        <h3>AI Analysis</h3>
                        <p>Complete</p>
                    </div>
                </div>
            </div>

            <div className="category-breakdown">
                <h3>Cyber Threat Intelligence by Vector:</h3>
                <div className="category-grid">
                    {Object.entries(categoryCounts).map(([category, count]) => (
                        <div key={category} className="category-item">
                            <div className="category-icon">
                                {formatThreatMessage('', category).icon}
                            </div>
                            <div className="category-content">
                                <h4>{category}</h4>
                                <p>{count} threat sources identified</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="threats-container">
                <h2>
                    <FaCrosshairs className="section-icon" />
                    Active Threat Intelligence
                </h2>
                <div className="threats-list">
                    {threats.map((threat, index) => (
                        <div className="exposure-item" key={index}>
                            <div className="app-icon">
                                {threat.category === 'Address History' && <FaHome className="globe-icon" />}
                                {threat.category === 'People Search' && <FaUserCircle className="search-icon" />}
                                {threat.category === 'Social Media' && <FaUser className="social-icon" />}
                                {threat.category === 'Contact Info' && <FaPhone className="contact-icon" />}
                                {threat.category === 'Public Records' && <FaFileAlt className="document-icon" />}
                                {threat.category === 'Background Check' && <FaDatabase className="database-icon" />}
                            </div>
                            <div className="exposure-content">
                                <span className="site-name">{threat.siteName}</span>
                                <span className="exposure-category">{threat.category}</span>
                                <p className="exposure-details">
                                    {threat.details}
                                    {threat.hasLocation && (
                                        <span className="location-indicator"> 📍</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="action-steps">
                <h2>Cyber Defense Strategy</h2>
                <div className="steps-container">
                    <div className="step">
                        <FaBrain className="step-icon" />
                        <h3>Deploy AI Protection</h3>
                        <p>Activate enterprise-grade cyber intelligence defense systems</p>
                    </div>
                    <div className="step">
                        <FaCrosshairs className="step-icon" />
                        <h3>Automated Threat Removal</h3>
                        <p>AI-powered systems eliminate threats across all identified vectors</p>
                    </div>
                    <div className="step">
                        <FaShieldAlt className="step-icon" />
                        <h3>Continuous Monitoring</h3>
                        <p>24/7 AI surveillance and threat surface analysis protection</p>
                    </div>
                </div>
            </div>

            <div className="cta-container">
                <h2>Deploy CyberForget AI Protection</h2>
                <p>Activate enterprise-grade cyber intelligence defense to eliminate these threat vectors</p>
                <button 
                    className="primary-button cta-button"
                    onClick={() => navigate('/pricing')}
                    style={{ 
                        color: '#FFFFFF',
                        background: 'linear-gradient(135deg, #00D4FF 0%, #42FFB5 100%)',
                        width: 'auto',
                        minWidth: '250px'
                    }}
                >
                    Activate AI Defense
                </button>
                <p className="guarantee">
                    <FaShieldAlt /> Enterprise Security Guarantee
                </p>
            </div>

            {/* Updated Redirect Notice with New Loading Animation */}
            {showRedirect && (
                <div className="redirect-notice">
                    <div className="pulse-loader"></div>
                    <span>Initializing cyber defense deployment...</span>
                </div>
            )}
        </div>
    );
};

export default ResultsPage;

// Add these styles to your ResultsPage.css
const styles = `
    .success-icon {
        font-size: 48px;
        color: #4CAF50;
        margin-bottom: 20px;
    }

    .pulse-loader {
        width: 20px;
        height: 20px;
        background-color: #D8FF60;
        border-radius: 50%;
        animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.2);
            opacity: 1;
        }
        100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
    }

    /* Fade-out animation for redirect */
    .fade-out {
        animation: fadeOut 0.5s ease-in-out forwards;
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
