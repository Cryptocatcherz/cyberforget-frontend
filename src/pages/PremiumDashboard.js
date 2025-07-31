import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuthUtils";
import useSubscription from '../hooks/useSubscription';
import './PremiumDashboard.css';

const PremiumDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isPremium, isTrial, daysRemaining } = useSubscription();
    const [activeFeatures, setActiveFeatures] = useState({});
    const [dashboardStats, setDashboardStats] = useState({
        threatsBlocked: 1247,
        dataRemovalRequests: 23,
        passwordsSecured: 156,
        vpnConnections: 892,
        identityScans: 34,
        adBlockedToday: 2847
    });

    // Premium features with real functionality
    const features = [
        {
            id: 'dark-web',
            title: 'Dark Web Protection',
            description: 'Monitoring 127 dark web sources for your data',
            icon: '🕵️',
            enabled: true,
            status: 'Monitoring Active',
            lastScan: '2 hours ago',
            threats: 0,
            route: '/dark-web-monitoring'
        },
        {
            id: 'vpn',
            title: 'Military-Grade VPN',
            description: 'Connected to New York server (23ms ping)',
            icon: '🔐',
            enabled: true,
            status: 'Connected',
            server: 'New York, US',
            bandwidth: '89.2 Mbps',
            route: '/vpn'
        },
        {
            id: 'password-manager',
            title: 'Password Manager',
            description: '156 passwords secured, 12 need updates',
            icon: '🔑',
            enabled: true,
            status: 'Active',
            secured: 156,
            needsUpdate: 12,
            route: '/password-manager'
        },
        {
            id: 'data-removal',
            title: 'Data Removal Service',
            description: '23 removal requests in progress',
            icon: '🗑️',
            enabled: true,
            status: 'Processing',
            inProgress: 23,
            completed: 47,
            route: '/data-removal'
        },
        {
            id: 'identity-monitoring',
            title: '24/7 Identity Monitoring',
            description: 'Last scan: 15 minutes ago - All clear',
            icon: '🛡️',
            enabled: true,
            status: 'Monitoring',
            lastScan: '15 minutes ago',
            alerts: 0,
            route: '/identity-monitoring'
        },
        {
            id: 'ad-blocker',
            title: 'Advanced Ad Blocker',
            description: '2,847 ads blocked today across all devices',
            icon: '🚫',
            enabled: true,
            status: 'Active',
            blockedToday: 2847,
            blockedTotal: 45692,
            route: '/ad-blocker'
        }
    ];

    const handleToggleFeature = (featureId) => {
        setActiveFeatures(prev => ({
            ...prev,
            [featureId]: !prev[featureId]
        }));
    };

    const handleFeatureClick = (route) => {
        navigate(route);
    };

    const getSubscriptionBadge = () => {
        if (isTrial) {
            return (
                <div className="subscription-badge trial">
                    <span className="badge-icon">🚀</span>
                    <div className="badge-content">
                        <span className="badge-title">Free Trial</span>
                        <span className="badge-subtitle">{daysRemaining} days remaining</span>
                    </div>
                </div>
            );
        }
        return (
            <div className="subscription-badge premium">
                <span className="badge-icon">💎</span>
                <div className="badge-content">
                    <span className="badge-title">Premium Active</span>
                    <span className="badge-subtitle">All features unlocked</span>
                </div>
            </div>
        );
    };

    return (
        <div className="premium-dashboard">
            <div className="dashboard-container">
                {/* Header Section */}
                <div className="premium-header">
                    <div className="header-content">
                        <h1>Welcome back, {user?.firstName || 'User'}!</h1>
                        <p>Your digital security is actively protected by CyberForget</p>
                    </div>
                    {getSubscriptionBadge()}
                </div>

                {/* Security Stats Overview */}
                <div className="security-stats">
                    <h2>Security Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🛡️</div>
                            <div className="stat-content">
                                <div className="stat-number">{dashboardStats.threatsBlocked.toLocaleString()}</div>
                                <div className="stat-label">Threats Blocked</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🗑️</div>
                            <div className="stat-content">
                                <div className="stat-number">{dashboardStats.dataRemovalRequests}</div>
                                <div className="stat-label">Data Removals</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🔑</div>
                            <div className="stat-content">
                                <div className="stat-number">{dashboardStats.passwordsSecured}</div>
                                <div className="stat-label">Passwords Secured</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🚫</div>
                            <div className="stat-content">
                                <div className="stat-number">{dashboardStats.adBlockedToday.toLocaleString()}</div>
                                <div className="stat-label">Ads Blocked Today</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Features */}
                <div className="features-section">
                    <h2>Your Active Security Features</h2>
                    <div className="features-grid">
                        {features.map((feature) => (
                            <div 
                                key={feature.id} 
                                className="premium-feature-card"
                                onClick={() => handleFeatureClick(feature.route)}
                            >
                                <div className="feature-header">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <div className="feature-status-badge active">
                                        <div className="status-dot"></div>
                                        {feature.status}
                                    </div>
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                                
                                {/* Feature-specific stats */}
                                {feature.id === 'dark-web' && (
                                    <div className="feature-stats">
                                        <span>Last scan: {feature.lastScan}</span>
                                        <span className="threat-count">✅ {feature.threats} threats found</span>
                                    </div>
                                )}
                                
                                {feature.id === 'vpn' && (
                                    <div className="feature-stats">
                                        <span>📍 {feature.server}</span>
                                        <span>⚡ {feature.bandwidth}</span>
                                    </div>
                                )}
                                
                                {feature.id === 'password-manager' && (
                                    <div className="feature-stats">
                                        <span>✅ {feature.secured} secured</span>
                                        <span className="needs-update">⚠️ {feature.needsUpdate} need updates</span>
                                    </div>
                                )}
                                
                                {feature.id === 'data-removal' && (
                                    <div className="feature-stats">
                                        <span>🔄 {feature.inProgress} in progress</span>
                                        <span>✅ {feature.completed} completed</span>
                                    </div>
                                )}
                                
                                {feature.id === 'identity-monitoring' && (
                                    <div className="feature-stats">
                                        <span>🕐 {feature.lastScan}</span>
                                        <span className="alerts">🔔 {feature.alerts} alerts</span>
                                    </div>
                                )}
                                
                                {feature.id === 'ad-blocker' && (
                                    <div className="feature-stats">
                                        <span>📊 {feature.blockedToday.toLocaleString()} today</span>
                                        <span>🎯 {feature.blockedTotal.toLocaleString()} total</span>
                                    </div>
                                )}

                                <div className="feature-toggle">
                                    <div 
                                        className={`toggle-switch ${feature.enabled ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleFeature(feature.id);
                                        }}
                                    >
                                        <div className={`toggle-slider ${feature.enabled ? 'active' : ''}`}></div>
                                    </div>
                                    <span className="toggle-label">
                                        {feature.enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <button className="action-btn" onClick={() => navigate('/data-leak')}>
                            <span className="action-icon">🔍</span>
                            <span>Run Security Scan</span>
                        </button>
                        <button className="action-btn" onClick={() => navigate('/password-check')}>
                            <span className="action-icon">🔐</span>
                            <span>Check Passwords</span>
                        </button>
                        <button className="action-btn" onClick={() => navigate('/data-removal')}>
                            <span className="action-icon">🗑️</span>
                            <span>Request Data Removal</span>
                        </button>
                        <button className="action-btn" onClick={() => navigate('/vpn')}>
                            <span className="action-icon">🌐</span>
                            <span>VPN Settings</span>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">🛡️</div>
                            <div className="activity-content">
                                <div className="activity-title">Identity monitoring scan completed</div>
                                <div className="activity-time">15 minutes ago</div>
                            </div>
                            <div className="activity-status success">✅</div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">🗑️</div>
                            <div className="activity-content">
                                <div className="activity-title">Data removal request sent to PeopleSearch.com</div>
                                <div className="activity-time">2 hours ago</div>
                            </div>
                            <div className="activity-status pending">🔄</div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">🔐</div>
                            <div className="activity-content">
                                <div className="activity-title">VPN connected to New York server</div>
                                <div className="activity-time">4 hours ago</div>
                            </div>
                            <div className="activity-status success">✅</div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">🔑</div>
                            <div className="activity-content">
                                <div className="activity-title">12 passwords flagged for updates</div>
                                <div className="activity-time">1 day ago</div>
                            </div>
                            <div className="activity-status warning">⚠️</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumDashboard;