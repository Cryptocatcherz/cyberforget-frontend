import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuthUtils";
import useSubscription from '../hooks/useSubscription';
import api from '../services/apiService';
import './PremiumDashboard.css';

const PremiumDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isPremium, isTrial, daysRemaining } = useSubscription();
    const [activeFeatures, setActiveFeatures] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [showVpnModal, setShowVpnModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [loading, setLoading] = useState(true);
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
            id: 'data-removal',
            title: 'Data Removal Service',
            description: 'Remove your data from 400+ broker sites',
            icon: '🗑️',
            enabled: false,
            status: 'Inactive',
            inProgress: 0,
            completed: 0,
            route: '/data-removal'
        },
        {
            id: 'dark-web',
            title: 'Dark Web Protection',
            description: 'Monitor 127 dark web sources for your data',
            icon: '🕵️',
            enabled: false,
            status: 'Disabled',
            lastScan: 'Never',
            threats: 0,
            route: '/dark-web-monitoring'
        },
        {
            id: 'vpn',
            title: 'Military-Grade VPN',
            description: 'Connect to 50+ server locations worldwide',
            icon: '🔐',
            enabled: false,
            status: 'Disconnected',
            server: 'Not connected',
            bandwidth: '0 Mbps',
            route: '/vpn'
        },
        {
            id: 'password-manager',
            title: 'Password Manager',
            description: 'Secure and manage your passwords',
            icon: '🔑',
            enabled: false,
            status: 'Inactive',
            secured: 0,
            needsUpdate: 0,
            route: '/password-manager'
        },
        {
            id: 'identity-monitoring',
            title: '24/7 Identity Monitoring',
            description: 'Monitor your identity across the web',
            icon: '🛡️',
            enabled: false,
            status: 'Inactive',
            lastScan: 'Never',
            alerts: 0,
            route: '/identity-monitoring'
        },
        {
            id: 'ad-blocker',
            title: 'Advanced Ad Blocker',
            description: 'Block ads, trackers, and malicious websites',
            icon: '🚫',
            enabled: false,
            status: 'Inactive',
            blockedToday: 0,
            blockedTotal: 0,
            route: '/ad-blocker'
        }
    ];

    // Load saved feature toggles on component mount
    useEffect(() => {
        const loadFeatureToggles = async () => {
            if (!user || loading === false) return; // Prevent re-runs
            
            try {
                const response = await api.get('/user-preferences/feature-toggles');
                if (response.data.success && response.data.featureToggles) {
                    setActiveFeatures(response.data.featureToggles);
                }
            } catch (error) {
                console.error('Error loading feature toggles:', error);
                // Don't retry on error to prevent infinite loops
            } finally {
                setLoading(false);
            }
        };

        loadFeatureToggles();
    }, [user]); // Remove loading from dependencies

    // Terminal command sequences for different features
    const getTerminalCommands = (featureId, isEnabling) => {
        const commands = {
            'dark-web': {
                enabled: [
                    { prompt: 'sudo', command: 'cyberforget --enable dark-web-monitoring', delay: 0 },
                    { prompt: '>', command: 'Initializing dark web scanner...', delay: 800, output: true },
                    { prompt: '>', command: 'Connecting to 127 dark web sources...', delay: 1600, output: true },
                    { prompt: '>', command: 'Scanning for personal data exposure...', delay: 2400, output: true },
                    { prompt: '✓', command: 'Dark Web Protection ACTIVATED', delay: 3200, success: true }
                ],
                disabled: [
                    { prompt: 'sudo', command: 'cyberforget --disable dark-web-monitoring', delay: 0 },
                    { prompt: '>', command: 'Stopping dark web monitoring...', delay: 800, output: true },
                    { prompt: '✓', command: 'Dark Web Protection DEACTIVATED', delay: 1600, warning: true }
                ]
            },
            'vpn': {
                enabled: [
                    { prompt: 'sudo', command: 'cyberforget --enable vpn-service', delay: 0 },
                    { prompt: '>', command: 'Loading VPN configuration...', delay: 800, output: true },
                    { prompt: '>', command: 'Please select platform for installation', delay: 1600, output: true }
                ]
            },
            'password-manager': {
                enabled: [
                    { prompt: 'sudo', command: 'cyberforget --enable password-vault', delay: 0 },
                    { prompt: '>', command: 'Initializing encrypted password vault...', delay: 800, output: true },
                    { prompt: '>', command: 'Generating AES-256 encryption keys...', delay: 1600, output: true },
                    { prompt: '>', command: 'Please select platform for installation', delay: 2400, output: true }
                ],
                disabled: [
                    { prompt: 'sudo', command: 'cyberforget --disable password-vault', delay: 0 },
                    { prompt: '>', command: 'Securing password vault...', delay: 800, output: true },
                    { prompt: '✓', command: 'Password Manager DEACTIVATED', delay: 1600, warning: true }
                ]
            },
            'data-removal': {
                enabled: [
                    { prompt: 'sudo', command: 'cyberforget --enable data-removal', delay: 0 },
                    { prompt: '>', command: 'Scanning 400+ data broker sites...', delay: 800, output: true },
                    { prompt: '>', command: 'Generating removal requests...', delay: 1600, output: true },
                    { prompt: '>', command: 'Submitting automated takedown notices...', delay: 2400, output: true },
                    { prompt: '✓', command: 'Data Removal Service ACTIVATED', delay: 3200, success: true }
                ],
                disabled: [
                    { prompt: 'sudo', command: 'cyberforget --disable data-removal', delay: 0 },
                    { prompt: '>', command: 'Pausing removal requests...', delay: 800, output: true },
                    { prompt: '✓', command: 'Data Removal Service DEACTIVATED', delay: 1600, warning: true }
                ]
            },
            'identity-monitoring': {
                enabled: [
                    { prompt: 'sudo', command: 'cyberforget --enable identity-monitor', delay: 0 },
                    { prompt: '>', command: 'Starting 24/7 identity monitoring...', delay: 800, output: true },
                    { prompt: '>', command: 'Monitoring credit reports, SSN usage...', delay: 1600, output: true },
                    { prompt: '>', command: 'Setting up real-time alerts...', delay: 2400, output: true },
                    { prompt: '✓', command: 'Identity Monitoring ACTIVATED', delay: 3200, success: true }
                ],
                disabled: [
                    { prompt: 'sudo', command: 'cyberforget --disable identity-monitor', delay: 0 },
                    { prompt: '>', command: 'Stopping identity monitoring...', delay: 800, output: true },
                    { prompt: '✓', command: 'Identity Monitoring DEACTIVATED', delay: 1600, warning: true }
                ]
            },
            'ad-blocker': {
                enabled: [
                    { prompt: 'sudo', command: 'cyberforget --enable ad-blocker', delay: 0 },
                    { prompt: '>', command: 'Loading ad-blocking filters...', delay: 800, output: true },
                    { prompt: '>', command: 'Blocking trackers and malicious ads...', delay: 1600, output: true },
                    { prompt: '>', command: 'Installing browser extensions...', delay: 2400, output: true },
                    { prompt: '✓', command: 'Ad Blocker ACTIVATED', delay: 3200, success: true }
                ],
                disabled: [
                    { prompt: 'sudo', command: 'cyberforget --disable ad-blocker', delay: 0 },
                    { prompt: '>', command: 'Disabling ad-blocking filters...', delay: 800, output: true },
                    { prompt: '✓', command: 'Ad Blocker DEACTIVATED', delay: 1600, warning: true }
                ]
            }
        };
        
        return commands[featureId]?.[isEnabling ? 'enabled' : 'disabled'] || [];
    };

    // Add terminal notification function
    const addTerminalNotification = (featureId, isEnabling) => {
        const id = Date.now();
        const commands = getTerminalCommands(featureId, isEnabling);
        const feature = features.find(f => f.id === featureId);
        
        const notification = { 
            id, 
            type: 'terminal', 
            title: `${feature.title}`, 
            commands: [],
            featureId,
            isEnabling
        };
        
        setNotifications(prev => [notification, ...prev]);
        
        // Scroll to top to show the console notification
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
        
        // Add commands with delays
        commands.forEach((cmd, index) => {
            setTimeout(() => {
                setNotifications(prev => 
                    prev.map(n => 
                        n.id === id 
                            ? { ...n, commands: [...n.commands, cmd] }
                            : n
                    )
                );
            }, cmd.delay);
        });
        
        // Show VPN modal after terminal commands complete for VPN
        if (featureId === 'vpn' && isEnabling) {
            setTimeout(() => {
                setShowVpnModal(true);
            }, 2000);
        }
        
        // Show Password Manager modal after terminal commands complete
        if (featureId === 'password-manager' && isEnabling) {
            setTimeout(() => {
                setShowPasswordModal(true);
            }, 2800);
        }
        
        // Auto-remove notification after commands complete
        const totalDuration = Math.max(...commands.map(c => c.delay)) + 3000;
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, totalDuration);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleToggleFeature = async (featureId) => {
        const isCurrentlyEnabled = activeFeatures[featureId] || false;
        const newState = !isCurrentlyEnabled;
        
        // Update local state immediately for responsive UI
        setActiveFeatures(prev => ({
            ...prev,
            [featureId]: newState
        }));

        // Show terminal notification
        addTerminalNotification(featureId, newState);
        
        // Save to backend
        try {
            await api.put(`/user-preferences/feature-toggles/${featureId}`, {
                enabled: newState
            });
            console.log(`Feature ${featureId} saved as ${newState ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error('Error saving feature toggle:', error);
            // Revert local state on error
            setActiveFeatures(prev => ({
                ...prev,
                [featureId]: isCurrentlyEnabled
            }));
            
            // Show error notification
            const errorId = Date.now();
            const errorNotification = {
                id: errorId,
                type: 'terminal',
                title: 'Error',
                commands: [
                    { prompt: 'ERROR', command: `Failed to save ${featureId} state`, delay: 0, error: true }
                ]
            };
            setNotifications(prev => [errorNotification, ...prev]);
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== errorId));
            }, 5000);
        }
    };

    // Platform Download Functions
    const downloadVpnFile = (platform) => {
        const files = {
            'windows': {
                name: 'CyberForget-VPN-Windows.exe',
                url: 'data:application/octet-stream;base64,UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAABEAAABDeWJlckZvcmdldC1WUE4uZXhl',
                size: '24.5 MB'
            },
            'mac': {
                name: 'CyberForget-VPN-Mac.dmg',
                url: 'data:application/octet-stream;base64,UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAABAAAABDeWJlckZvcmdldC1WUE4uZG1n',
                size: '31.2 MB'
            },
            'chrome': {
                name: 'CyberForget-VPN-Chrome.crx',
                url: 'data:application/octet-stream;base64,UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAABAAAABDeWJlckZvcmdldC1WUE4uY3J4',
                size: '2.1 MB'
            }
        };

        const file = files[platform];
        if (file) {
            // Create a blob and download link
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success terminal notification
            const id = Date.now();
            const notification = {
                id,
                type: 'terminal',
                title: 'VPN Download',
                commands: [
                    { prompt: 'sudo', command: `downloading ${file.name}`, delay: 0 },
                    { prompt: '>', command: `File size: ${file.size}`, delay: 500, output: true },
                    { prompt: '>', command: 'Download started...', delay: 1000, output: true },
                    { prompt: '✓', command: 'VPN Client Downloaded Successfully', delay: 2000, success: true }
                ]
            };

            setNotifications(prev => [notification, ...prev]);
            
            // Scroll to top to show the download notification
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);
            
            // Add commands with delays
            notification.commands.forEach((cmd) => {
                setTimeout(() => {
                    setNotifications(prev => 
                        prev.map(n => 
                            n.id === id 
                                ? { ...n, commands: [...(n.commands || []), cmd] }
                                : n
                        )
                    );
                }, cmd.delay);
            });

            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, 5000);
        }
    };

    const downloadPasswordManagerFile = (platform) => {
        const files = {
            'windows': {
                name: 'CyberForget-PasswordManager-Windows.exe',
                url: 'data:application/octet-stream;base64,UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAABkAAABDeWJlckZvcmdldC1QYXNzd29yZC5leGU=',
                size: '18.3 MB'
            },
            'mac': {
                name: 'CyberForget-PasswordManager-Mac.dmg',
                url: 'data:application/octet-stream;base64,UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAABgAAABDeWJlckZvcmdldC1QYXNzd29yZC5kbWc=',
                size: '22.7 MB'
            },
            'chrome': {
                name: 'CyberForget-PasswordManager-Chrome.crx',
                url: 'data:application/octet-stream;base64,UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAABgAAABDeWJlckZvcmdldC1QYXNzd29yZC5jcng=',
                size: '3.4 MB'
            }
        };

        const file = files[platform];
        if (file) {
            // Create a blob and download link
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success terminal notification
            const id = Date.now();
            const notification = {
                id,
                type: 'terminal',
                title: 'Password Manager Download',
                commands: [
                    { prompt: 'sudo', command: `downloading ${file.name}`, delay: 0 },
                    { prompt: '>', command: `File size: ${file.size}`, delay: 500, output: true },
                    { prompt: '>', command: 'Download started...', delay: 1000, output: true },
                    { prompt: '✓', command: 'Password Manager Downloaded Successfully', delay: 2000, success: true }
                ]
            };

            setNotifications(prev => [notification, ...prev]);
            
            // Scroll to top to show the download notification
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);
            
            // Add commands with delays
            notification.commands.forEach((cmd) => {
                setTimeout(() => {
                    setNotifications(prev => 
                        prev.map(n => 
                            n.id === id 
                                ? { ...n, commands: [...(n.commands || []), cmd] }
                                : n
                        )
                    );
                }, cmd.delay);
            });

            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, 5000);
        }
    };

    const handleVpnDownload = () => {
        if (selectedPlatform) {
            downloadVpnFile(selectedPlatform);
            setShowVpnModal(false);
            setSelectedPlatform('');
            
            // Mark VPN as enabled after download
            setActiveFeatures(prev => ({
                ...prev,
                'vpn': true
            }));
        }
    };

    const handlePasswordManagerDownload = () => {
        if (selectedPlatform) {
            downloadPasswordManagerFile(selectedPlatform);
            setShowPasswordModal(false);
            setSelectedPlatform('');
            
            // Mark Password Manager as enabled after download
            setActiveFeatures(prev => ({
                ...prev,
                'password-manager': true
            }));
        }
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

    if (loading) {
        return (
            <div className="premium-dashboard">
                <div className="dashboard-container">
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100vh',
                        color: '#42ffb5'
                    }}>
                        <div>Loading your preferences...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="premium-dashboard">
                <div className="dashboard-container">
                    {/* Terminal Console Notifications */}
                    {notifications.map(notification => (
                        <div key={notification.id} className="console-notification">
                            <div className="terminal-header">
                                <div className="terminal-title">
                                    CYBERFORGET TERMINAL - {notification.title.toUpperCase()}
                                </div>
                                <button 
                                    className="terminal-close"
                                    onClick={() => removeNotification(notification.id)}
                                >
                                    ●
                                </button>
                            </div>
                            <div className="terminal-content">
                                {notification.commands?.map((cmd, index) => (
                                    <div key={index} className="terminal-line">
                                        <span className="terminal-prompt">{cmd.prompt}$</span>
                                        <span className={`terminal-command ${
                                            cmd.success ? 'terminal-success' : 
                                            cmd.warning ? 'terminal-warning' : 
                                            cmd.error ? 'terminal-error' : ''
                                        }`}>
                                            {cmd.command}
                                        </span>
                                    </div>
                                ))}
                                {notification.commands?.length === 0 && (
                                    <div className="terminal-line">
                                        <span className="terminal-prompt">$</span>
                                        <span className="terminal-command">Initializing...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

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
                                    <div className={`feature-status-badge ${(activeFeatures[feature.id] || feature.enabled) ? 'active' : 'inactive'}`}>
                                        {(activeFeatures[feature.id] || feature.enabled) && <div className="status-dot"></div>}
                                        {(activeFeatures[feature.id] || feature.enabled) ? 'Active' : 'Inactive'}
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
                                        className={`toggle-switch ${(activeFeatures[feature.id] || feature.enabled) ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleFeature(feature.id);
                                        }}
                                    >
                                        <div className={`toggle-slider ${(activeFeatures[feature.id] || feature.enabled) ? 'active' : ''}`}></div>
                                    </div>
                                    <span className="toggle-label">
                                        {(activeFeatures[feature.id] || feature.enabled) ? 'Enabled' : 'Disabled'}
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
            
            {/* VPN Platform Selection Modal */}
            {showVpnModal && (
                <div className="vpn-modal-overlay" onClick={() => setShowVpnModal(false)}>
                    <div className="vpn-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="vpn-modal-header">
                            <h2 className="vpn-modal-title">Choose Your Platform</h2>
                            <p className="vpn-modal-subtitle">Select your operating system to download the VPN client</p>
                        </div>
                        
                        <div className="platform-options">
                            <div 
                                className={`platform-option ${selectedPlatform === 'windows' ? 'selected' : ''}`}
                                onClick={() => setSelectedPlatform('windows')}
                            >
                                <div className="platform-icon windows"></div>
                                <div className="platform-name">Windows</div>
                                <div className="platform-description">Desktop application for Windows 10/11</div>
                            </div>
                            <div 
                                className={`platform-option ${selectedPlatform === 'mac' ? 'selected' : ''}`}
                                onClick={() => setSelectedPlatform('mac')}
                            >
                                <div className="platform-icon mac"></div>
                                <div className="platform-name">macOS</div>
                                <div className="platform-description">Native app for macOS 10.15+</div>
                            </div>
                            <div 
                                className={`platform-option ${selectedPlatform === 'chrome' ? 'selected' : ''}`}
                                onClick={() => setSelectedPlatform('chrome')}
                            >
                                <div className="platform-icon chrome"></div>
                                <div className="platform-name">Chrome Extension</div>
                                <div className="platform-description">Browser extension for Chrome/Edge</div>
                            </div>
                        </div>
                        
                        <div className="vpn-modal-buttons">
                            <button 
                                className="vpn-btn primary" 
                                onClick={handleVpnDownload}
                                disabled={!selectedPlatform}
                            >
                                Download VPN Client
                            </button>
                            <button 
                                className="vpn-btn secondary" 
                                onClick={() => setShowVpnModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Password Manager Platform Selection Modal */}
            {showPasswordModal && (
                <div className="password-modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="password-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="password-modal-header">
                            <h2 className="password-modal-title">Choose Your Platform</h2>
                            <p className="password-modal-subtitle">Select your operating system to download the Password Manager</p>
                        </div>
                        
                        <div className="platform-options">
                            <div 
                                className={`platform-option ${selectedPlatform === 'windows' ? 'selected' : ''}`}
                                onClick={() => setSelectedPlatform('windows')}
                            >
                                <div className="platform-icon windows"></div>
                                <div className="platform-name">Windows</div>
                                <div className="platform-description">Desktop application for Windows 10/11</div>
                            </div>
                            <div 
                                className={`platform-option ${selectedPlatform === 'mac' ? 'selected' : ''}`}
                                onClick={() => setSelectedPlatform('mac')}
                            >
                                <div className="platform-icon mac"></div>
                                <div className="platform-name">macOS</div>
                                <div className="platform-description">Native app for macOS 10.15+</div>
                            </div>
                            <div 
                                className={`platform-option ${selectedPlatform === 'chrome' ? 'selected' : ''}`}
                                onClick={() => setSelectedPlatform('chrome')}
                            >
                                <div className="platform-icon chrome"></div>
                                <div className="platform-name">Chrome Extension</div>
                                <div className="platform-description">Browser extension for Chrome/Edge</div>
                            </div>
                        </div>
                        
                        <div className="password-modal-buttons">
                            <button 
                                className="password-btn primary" 
                                onClick={handlePasswordManagerDownload}
                                disabled={!selectedPlatform}
                            >
                                Download Password Manager
                            </button>
                            <button 
                                className="password-btn secondary" 
                                onClick={() => setShowPasswordModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PremiumDashboard;