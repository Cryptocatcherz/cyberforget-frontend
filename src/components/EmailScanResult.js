import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaExternalLinkAlt, FaChartBar } from 'react-icons/fa';
import { SECURITY_TOOLS } from '../config/constants';

const EmailScanResult = ({ result, onActionClick }) => {
    if (!result) {
        console.error('EmailScanResult: No result provided');
        return null;
    }

    // Handle different data structures - check if result has a nested report
    const scanData = result.report || result;
    
    // Ensure scanData has required properties
    if (!scanData.email || !scanData.status) {
        console.error('EmailScanResult: Invalid result structure', result);
        return (
            <div className="email-scan-result error">
                <p>Error: Invalid scan result data</p>
            </div>
        );
    }

    const getStatusIcon = () => {
        switch (scanData.status) {
            case 'clean':
                return <FaCheckCircle className="status-icon clean" />;
            case 'compromised':
                return <FaExclamationTriangle className="status-icon compromised" />;
            default:
                return <FaShieldAlt className="status-icon" />;
        }
    };

    const getStatusColor = () => {
        switch (scanData.status) {
            case 'clean':
                return 'clean';
            case 'compromised':
                return 'compromised';
            default:
                return 'neutral';
        }
    };

    const handleActionClick = (action) => {
        if (action === 'data_broker_scan') {
            window.open(SECURITY_TOOLS.data_broker_scan.url, '_blank');
        } else {
            onActionClick && onActionClick(action);
        }
    };

    return (
        <motion.div
            className={`email-scan-result ${getStatusColor()}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Top Brand Bar */}
            <div className="cleandata-top-bar">
                <div className="brand-info">
                    <FaShieldAlt className="brand-icon" />
                    <span className="brand-text">CleanData Email Wiper</span>
                    <span className="powered-by">Powered by 12B+ Records</span>
                </div>
            </div>

            {/* Header */}
            <div className="scan-result-header">
                <div className="header-content">
                    {getStatusIcon()}
                    <div className="header-text">
                        <h3>{scanData.title}</h3>
                        <p>{scanData.subtitle}</p>
                    </div>
                </div>
            </div>

            {/* Email Info */}
            <div className="email-info">
                <div className="email-display">
                    <span className="email-label">Scanned Email:</span>
                    <code className="email-address">{scanData.email}</code>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card critical">
                    <div className="stat-number">{scanData.count}</div>
                    <div className="stat-label">Breaches Found</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">12B+</div>
                    <div className="stat-label">Records Scanned</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">850+</div>
                    <div className="stat-label">Data Sources</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">705M+</div>
                    <div className="stat-label">Accounts Affected</div>
                </div>
            </div>

            {/* Risk Level Indicator */}
            {scanData.status === 'compromised' && (
                <div className="risk-level-indicator critical">
                    <div className="risk-icon">⚠️</div>
                    <div className="risk-content">
                        <div className="risk-title">CRITICAL RISK LEVEL</div>
                        <div className="risk-description">Immediate action required - multiple breaches detected</div>
                    </div>
                </div>
            )}

            {/* Message */}
            <div className="scan-message">
                <p>{scanData.message}</p>
            </div>

            {/* Breaches (if compromised) */}
            {scanData.breaches && Array.isArray(scanData.breaches) && scanData.breaches.length > 0 && (
                <div className="breaches-section">
                    <h4>
                        <FaExclamationTriangle />
                        Data Breaches Found
                    </h4>
                    <div className="breaches-list">
                        {scanData.breaches.map((breach, index) => (
                            <div key={index} className="breach-item">
                                <div className="breach-header">
                                    <div className="breach-title-section">
                                        <span className="breach-name">{breach.name || breach.Name}</span>
                                        <span className="breach-description">{breach.description || breach.Description}</span>
                                    </div>
                                    <span className="breach-date">{new Date(breach.date || breach.BreachDate).getFullYear()}</span>
                                </div>
                                <div className="breach-details">
                                    <div className="breach-data-types">
                                        {(breach.dataClasses || breach.DataClasses) && Array.isArray(breach.dataClasses || breach.DataClasses) ? (
                                            <>
                                                {(breach.dataClasses || breach.DataClasses).slice(0, 4).map((dataType, idx) => (
                                                    <span key={idx} className="data-type-chip">{dataType}</span>
                                                ))}
                                                {(breach.dataClasses || breach.DataClasses).length > 4 && (
                                                    <span className="data-type-chip more">+{(breach.dataClasses || breach.DataClasses).length - 4} more</span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="data-type-chip">Account data</span>
                                        )}
                                    </div>
                                    <span className="breach-affected">
                                        {!(breach.pwnCount || breach.PwnCount) || (breach.pwnCount || breach.PwnCount) === 0 ? 'Unknown' : 
                                         (breach.pwnCount || breach.PwnCount) >= 1000000 ? `${((breach.pwnCount || breach.PwnCount) / 1000000).toFixed(1)}M` : 
                                         (breach.pwnCount || breach.PwnCount) >= 1000 ? `${((breach.pwnCount || breach.PwnCount) / 1000).toFixed(0)}k` : 
                                         (breach.pwnCount || breach.PwnCount)} accounts
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Data Protection Call-to-Action */}
            {scanData.status === 'compromised' && scanData.count > 0 && (
                <div className="data-protection-cta">
                    <div className="cta-header">
                        <FaExclamationTriangle className="cta-icon" />
                        <h4>⚠️ URGENT: {scanData.count} Data Breaches Found</h4>
                    </div>
                    <div className="cta-content">
                        <p className="cta-description">
                            Your data is actively exposed on the dark web. Take immediate action to protect your identity and accounts.
                        </p>
                    <div className="risk-points">
                        <div className="risk-point">
                            <span className="risk-bullet">⚠️</span>
                            <span>Identity Theft Risk</span>
                        </div>
                        <div className="risk-point">
                            <span className="risk-bullet">🔒</span>
                            <span>Account Security</span>
                        </div>
                        <div className="risk-point">
                            <span className="risk-bullet">🛡️</span>
                            <span>Data Protection</span>
                        </div>
                    </div>
                    <div className="protection-features">
                        <h5>CleanData Protection Features:</h5>
                        <div className="feature-grid">
                            <div className="feature">
                                <FaShieldAlt />
                                <span>150+ Data Broker Removal</span>
                            </div>
                            <div className="feature">
                                <FaCheckCircle />
                                <span>95% Success Rate</span>
                            </div>
                            <div className="feature">
                                <FaChartBar />
                                <span>24/7 Dark Web Monitoring</span>
                            </div>
                        </div>
                    </div>
                    <motion.button
                        className="start-protection-button"
                        onClick={() => window.open('https://app.cleandata.me/location', '_blank')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FaShieldAlt />
                        Start Full Protection
                        <FaExternalLinkAlt />
                    </motion.button>
                </div>
                </div>
            )}

            {/* Recommendations (if clean) */}
            {scanData.recommendations && scanData.status === 'clean' && (
                <div className="recommendations">
                    <h4>
                        <FaChartBar />
                        Recommended Next Steps
                    </h4>
                    <div className="recommendations-grid">
                        {scanData.recommendations.map((rec, index) => (
                            <motion.div
                                key={index}
                                className="recommendation-card"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => rec.action && handleActionClick(rec.action)}
                                style={{ cursor: rec.action ? 'pointer' : 'default' }}
                            >
                                <div className="rec-icon">{rec.icon}</div>
                                <div className="rec-content">
                                    <h5>{rec.title}</h5>
                                    <p>{rec.description}</p>
                                </div>
                                {rec.action && <FaExternalLinkAlt className="rec-link" />}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer CTA */}
            <div className="scan-result-footer">
                {scanData.status === 'compromised' ? (
                    <motion.button
                        className="cta-button critical"
                        onClick={() => handleActionClick('data_broker_scan')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaShieldAlt />
                        Run Data Broker Scanner - Critical
                    </motion.button>
                ) : (
                    <motion.button
                        className="cta-button recommended"
                        onClick={() => handleActionClick('data_broker_scan')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaChartBar />
                        Run Data Broker Scanner - Recommended
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default EmailScanResult;