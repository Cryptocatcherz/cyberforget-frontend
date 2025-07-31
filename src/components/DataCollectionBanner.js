import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldAlt, 
    faSearch, 
    faExclamationTriangle, 
    faTimes,
    faArrowRight,
    faUserEdit,
    faGlobe
} from '@fortawesome/free-solid-svg-icons';
import './DataCollectionBanner.css';

const DataCollectionBanner = ({ user, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Check if user has provided enough info for scanning
    const hasBasicInfo = user?.firstName && user?.lastName;
    const hasDetailedInfo = hasBasicInfo && (user?.address || user?.phone || user?.dateOfBirth);

    // Don't show banner if user already has detailed info
    if (hasDetailedInfo || !isVisible) {
        return null;
    }

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
    };

    return (
        <AnimatePresence>
            <motion.div
                className="data-collection-banner"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                <div className="banner-background"></div>
                
                <div className="banner-content">
                    <button 
                        className="banner-dismiss"
                        onClick={handleDismiss}
                        aria-label="Dismiss banner"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>

                    <div className="banner-header">
                        <div className="alert-icon">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                        </div>
                        <div className="header-text">
                            <h3>🛡️ Start Your Data Broker Scan</h3>
                            <p>Your personal information may be exposed across <strong>300+ data broker websites</strong></p>
                        </div>
                    </div>

                    <div className="banner-stats">
                        <div className="stat-item">
                            <span className="stat-number">300+</span>
                            <span className="stat-label">Data Brokers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">2.5B+</span>
                            <span className="stat-label">Records Exposed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">$14K</span>
                            <span className="stat-label">Avg Identity Theft Cost</span>
                        </div>
                    </div>

                    <div className="banner-action">
                        <div className="action-content">
                            <div className="action-text">
                                <h4>
                                    <FontAwesomeIcon icon={faShieldAlt} />
                                    {hasBasicInfo 
                                        ? "Add More Details for Deeper Scan" 
                                        : "Add Your Information to Begin Scanning"
                                    }
                                </h4>
                                <p>
                                    {hasBasicInfo 
                                        ? "Add your address, phone, or date of birth for a comprehensive 300+ site scan"
                                        : "We need your name and details to search for your information across the <strong>dark web</strong>"
                                    }
                                </p>
                            </div>
                            
                            <Link to="/edit-info" className="cta-button">
                                <FontAwesomeIcon icon={faUserEdit} />
                                <span>Complete Profile</span>
                                <FontAwesomeIcon icon={faArrowRight} className="arrow-icon" />
                            </Link>
                        </div>
                    </div>

                    <div className="banner-features">
                        <div className="feature-item">
                            <FontAwesomeIcon icon={faSearch} />
                            <span>Deep Web Scanning</span>
                        </div>
                        <div className="feature-item">
                            <FontAwesomeIcon icon={faGlobe} />
                            <span>300+ Data Brokers</span>
                        </div>
                        <div className="feature-item">
                            <FontAwesomeIcon icon={faShieldAlt} />
                            <span>Removal Assistance</span>
                        </div>
                    </div>

                    <div className="progress-indicator">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: hasBasicInfo ? '60%' : '20%' }}
                            ></div>
                        </div>
                        <span className="progress-text">
                            Profile: {hasBasicInfo ? '60%' : '20%'} Complete
                        </span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DataCollectionBanner;