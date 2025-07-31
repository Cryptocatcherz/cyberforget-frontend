// ⚠️ TEMPORARY DEVELOPMENT MODE - AUTHENTICATION DISABLED ⚠️
// TODO: Re-enable authentication before production deployment
// This allows dashboard editing without login for development purposes

import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket.js';
import { useHourlyScans } from '../hooks/useHourlyScans.js';
import api from '../services/apiService';
import dashboardService from '../services/dashboardService';
import scanService from '../services/scanService';
import autoScanService from '../services/autoScanService';
import LoadingSpinner from '../components/LoadingSpinner';
import UserInfo from '../components/UserInfo';
import DashboardStats from '../components/DashboardStats';
import FeatureToggles from '../components/FeatureToggles';
import DataBrokerListComponent from '../components/DataBrokerListComponent';
import DataPointsComponent from '../components/DataPointsComponent';
import ErrorFallback from '../components/ErrorFallback';
import ErrorBoundary from '../components/ErrorBoundary';
import HourlyScansTest from '../components/HourlyScansTest';
import HourlyScansComponent from '../components/HourlyScansComponent';
import OnboardingBanner from '../components/OnboardingBanner';
import { useAuth } from "../hooks/useAuthUtils";
import useSubscription from '../hooks/useSubscription';
import usePlanStatus from '../hooks/usePlanStatus';
import DashboardHeader from '../components/DashboardHeader';
import PaywallOverlay from '../components/PaywallOverlay';
import { formatDataBrokerList, getScreenshotUrl } from '../utils';
import { shouldShowComponent, getApiUrl, devLog, environment } from '../config/environment';
import './Dashboard.css';
import ImagePreview from '../components/ImagePreview';
import simulationService from '../services/simulationService';
import Typography from '@mui/material/Typography';
import { Alert } from '@mui/material';

const THUMB_IO_API_KEY = 'YOUR_THUMB_IO_API_KEY'; // Replace with your actual API key

// Constants
const TOTAL_SITES = 42; // Total number of data broker sites to scan

// Initial data broker list
const initialDataBrokers = [
    {
        id: 1,
        name: "Dataveria",
        url: "https://dataveria.com",
        status: "Pending",
        stage: null,
        message: null,
        threatLevel: "high"
    },
    {
        id: 2,
        name: "Clubset",
        url: "https://clubset.com",
        status: "Pending",
        stage: null,
        message: null,
        threatLevel: "medium"
    }
    // Add more data brokers as needed
];

// Memoized components
const MemoizedUserInfo = memo(UserInfo, (prev, next) => {
    return prev.user?.id === next.user?.id && 
           prev.user?.memberSince === next.user?.memberSince &&
           prev.user?.subscriptionStatus === next.user?.subscriptionStatus;
});

const MemoizedDashboardStats = memo(DashboardStats, (prev, next) => {
    return JSON.stringify(prev.stats) === JSON.stringify(next.stats);
});

const MemoizedDataBrokerList = memo(DataBrokerListComponent, (prev, next) => {
    return JSON.stringify(prev.dataBrokers) === JSON.stringify(next.dataBrokers) &&
           prev.isScanning === next.isScanning &&
           prev.currentSite === next.currentSite &&
           prev.progress === next.progress &&
           prev.currentStageFromProps === next.currentStageFromProps &&
           prev.message === next.message &&
           prev.profilesFound === next.profilesFound &&
           prev.sitesScanned === next.sitesScanned &&
           prev.threatsFound === next.threatsFound &&
           prev.lastScanTime === next.lastScanTime &&
           prev.nextScanTime === next.nextScanTime;
});

const MemoizedFeatureToggles = memo(FeatureToggles);

const API_BASE_URL = getApiUrl('/api');

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser, refreshUserData } = useAuth();
    const { shouldShowPaywall, isPremium, isTrial, daysRemaining, getUpgradeMessage } = useSubscription();
    const isDevelopment = process.env.NODE_ENV === 'development';
    const { 
        connected,
        error: socketError, 
        isSimulating, 
        simulationProgress,
        currentSite,
        currentStage,
        statusMessage,
        metrics,
        emit,
        startSimulation,
        stopSimulation,
        roomJoined
    } = useSocket(user?.id);
    
    // Hourly scans integration
    const {
        isActive: hourlyIsActive,
        progress: hourlyProgress,
        currentSite: hourlyCurrentSite,
        currentStage: hourlyCurrentStage,
        error: hourlyError,
        isManualScan,
        metrics: hourlyMetrics
    } = useHourlyScans(user?.id);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
    const [error, setError] = useState(null);
    const [socketErrorState, setSocketError] = useState(null);
    const [currentScanStatus, setCurrentScanStatus] = useState('');
    const [scanProgress, setScanProgress] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const [dataBrokerList, setDataBrokerList] = useState(initialDataBrokers);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            isScanning: false,
            progress: 0,
            currentSite: null,
            currentStage: null,
            message: null,
            sitesScanned: 0,
            potentialThreats: 0,
            totalMatches: 0,
            lastScanTime: null,
            nextScanTime: null,
            status: 'Ready to scan'
        },
        featureToggles: {
            multi_factor_auth: false,
            role_based_access: false,
            monitoring_verification: false,
            data_leak_notification: false
        }
    });

    const dashboardRef = useRef(null);
    const socketRef = useRef(null);
    const retryCountRef = useRef(0);
    const maxRetries = 3;

    const [isLoading, setIsLoading] = useState(true);
    const [scanSubscription, setScanSubscription] = useState(null);
    const [autoScanStats, setAutoScanStats] = useState(null);

    // Memoized live search items - only create when user data is available
    const liveSearchItems = useMemo(() => {
        if (!user?.firstName || !user?.lastName) {
            return []; // Return empty array if user data is not available
        }
        
        return [
            { 
                url: `https://dataveria.com/profile/search?fname=${user.firstName}&lname=${user.lastName}`,
            siteName: 'Dataveria',
            status: 'Monitoring',
            isAnalyzing: true,
                previewUrl: `https://image.thum.io/get/width/600/crop/800/noanimate/auth/${THUMB_IO_API_KEY}/https://dataveria.com/profile/search?fname=${user.firstName}&lname=${user.lastName}`
        },
        { 
                url: `https://clubset.com/profile/search?fname=${user.firstName}&lname=${user.lastName}&state=&city=&fage=None`,
            siteName: 'Clubset',
            status: 'Monitoring',
            isAnalyzing: true,
                previewUrl: `https://image.thum.io/get/width/600/crop/800/noanimate/auth/${THUMB_IO_API_KEY}/https://clubset.com/profile/search?fname=${user.firstName}&lname=${user.lastName}&state=&city=&fage=None`
        }
        ];
    }, [user?.firstName, user?.lastName]);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoadingInitialData(true);
                setError(null);

                // TEMPORARY: Skip token check for development
                // const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                // if (!token) {
                //     console.log('[Dashboard] No token found, redirecting to login...');
                //     navigate('/login');
                //     return;
                // }

                // TEMPORARY: Use mock user data for development
                if (!user) {
                    setUser({
                        id: 'temp-user-123',
                        email: 'demo@cyberforget.com',
                        firstName: 'John',
                        lastName: 'Doe',
                        memberSince: new Date().toISOString(),
                        subscriptionStatus: 'Premium'
                    });
                }

                // Only proceed with other data fetching if we have a user
                if (user?.id) {
                    try {
                        await fetchDashboardData();
                        
                        // Start auto-scan service if enabled
                        if (environment.features.autoSiteScanning) {
                            devLog('Starting auto-scan service');
                            autoScanService.startAutoScan();
                        }
                    } catch (error) {
                        console.error('[Dashboard] Error fetching dashboard data:', error);
                        // Don't set error for 404s - API endpoints might not be ready
                        if (error.response?.status !== 404) {
                            setError('Failed to load some dashboard data');
                        }
                    }
                }

                setIsLoadingInitialData(false);
            } catch (error) {
                console.error('[Dashboard] Error in fetchInitialData:', error);
                setError('Failed to load dashboard data');
                setIsLoadingInitialData(false);
            }
        };

        // TEMPORARY: Always initialize for development
        if (!isInitialized) {
            setIsInitialized(true);
            fetchInitialData();
        }
    }, [user, navigate, refreshUserData, isInitialized]);

    // Scan simulation functions
    const startScan = useCallback(async () => {
        try {
            const scanData = {
                emails: [user?.email],
                phones: user?.phoneNumber ? [user.phoneNumber] : [],
                mode: 'manual'
            };
            
            await scanService.startScan(scanData);
            startSimulation(); // Start the UI simulation
        } catch (error) {
            console.error('[Dashboard] Error starting scan:', error);
            setError('Failed to start scan');
        }
    }, [user, startSimulation]);

    const stopScan = useCallback(() => {
        stopSimulation();
    }, [stopSimulation]);

    const getThreatLevel = (pwnCount) => {
        if (pwnCount === 0) return 'Safe';
        if (pwnCount <= 3) return 'Low';
        if (pwnCount <= 10) return 'Medium';
        return 'High';
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const formatScanProgress = (progress) => {
        return `${Math.round(progress)}%`;
    };

    // Initialize auto-scan service subscription
    useEffect(() => {
        if (!user?.id) return;
        
        // Subscribe to auto-scan updates
        const unsubscribe = autoScanService.subscribe((data) => {
            devLog('Auto-scan update:', data);
            
            // Update auto-scan stats
            setAutoScanStats(autoScanService.getStats());
            
            // Update dashboard data based on scan events
            if (data.type === 'cycle_completed') {
                // Refresh dashboard data after scan cycle completes
                fetchDashboardData().catch(console.error);
            }
        });
        
        // Get initial stats
        setAutoScanStats(autoScanService.getStats());
        
        return () => {
            unsubscribe();
            // Stop auto-scan when component unmounts
            autoScanService.stopAutoScan();
        };
    }, [user?.id]);

    // Fetch dashboard data using the new service with Supabase fallback
    const fetchDashboardData = async () => {
        try {
            setIsLoadingInitialData(true);
            setError(null);

            // Try API first
            try {
                const dashboardResponse = await dashboardService.getDashboardData();
                
                if (dashboardResponse?.success) {
                    setDashboardData(prevData => ({
                        ...prevData,
                        stats: {
                            ...prevData.stats,
                            ...dashboardResponse.stats,
                            profilesFound: dashboardResponse.stats.totalMatches || dashboardResponse.stats.profilesFound || 0,
                            sitesScanned: dashboardResponse.stats.sitesScanned || 0,
                            potentialThreats: dashboardResponse.stats.potentialThreats || 0,
                            totalMatches: dashboardResponse.stats.totalMatches || 0,
                            isScanning: dashboardResponse.stats.isScanning || false,
                            progress: dashboardResponse.stats.progress || 0,
                            currentSite: dashboardResponse.stats.currentSite || null,
                            lastScanTime: dashboardResponse.stats.lastScanTime || null,
                            nextScanTime: dashboardResponse.stats.nextScanTime || null,
                            status: dashboardResponse.stats.status || 'Ready to scan'
                        },
                        featureToggles: dashboardResponse.featureToggles || prevData.featureToggles
                    }));

                    if (dashboardResponse.user && setUser) {
                        setUser(prevUser => ({ ...prevUser, ...dashboardResponse.user }));
                    }
                    
                    setIsLoadingInitialData(false);
                    return;
                }
            } catch (apiError) {
                console.error('[Dashboard] API call failed:', apiError);
                setError('Failed to load dashboard data');
            }

            setIsLoadingInitialData(false);
        } catch (error) {
            console.error('[Dashboard] Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
            setIsLoadingInitialData(false);
        }
    };

    // Handle socket connection
    useEffect(() => {
        if (!user?.id || !connected) {
            console.log('[Dashboard] Waiting for socket connection:', {
                hasUser: !!user?.id,
                connected,
                timestamp: new Date().toISOString()
            });
            return;
        }

        console.log('[Dashboard] Socket connected:', {
            userId: user.id,
            timestamp: new Date().toISOString()
        });

    }, [user?.id, connected]);

    // Update dashboard data when socket events are received (both simulation and hourly scans)
    useEffect(() => {
        console.log('[Dashboard] Socket state change detected:', {
            isSimulating,
            simulationProgress,
            currentSite,
            currentStage,
            metrics,
            hourlyIsActive,
            hourlyProgress,
            hourlyCurrentSite,
            hourlyCurrentStage,
            hourlyMetrics
        });

        // Determine which scan is active and use its data
        const isActivelyScanning = isSimulating || hourlyIsActive;
        const activeProgress = hourlyIsActive ? hourlyProgress : simulationProgress;
        const activeSite = hourlyIsActive ? hourlyCurrentSite : currentSite;
        const activeStage = hourlyIsActive ? hourlyCurrentStage : currentStage;
        const activeMetrics = hourlyIsActive ? hourlyMetrics : metrics;
        const scanType = hourlyIsActive ? (isManualScan ? 'Manual Scan' : 'Hourly Scan') : 'Simulation';

        // Always update dashboard data when socket state changes
        setDashboardData(prev => {
            const newData = {
                ...prev,
                stats: {
                    ...prev.stats,
                    isScanning: isActivelyScanning,
                    progress: activeProgress,
                    currentSite: activeSite,
                    currentStage: activeStage,
                    message: hourlyIsActive ? `${scanType} in progress...` : statusMessage,
                    sitesScanned: (activeMetrics && activeMetrics.sitesScanned) || prev.stats.sitesScanned || 0,
                    potentialThreats: (activeMetrics && (activeMetrics.threatsFound || activeMetrics.potentialThreats)) || prev.stats.potentialThreats || 0,
                    totalMatches: (activeMetrics && (activeMetrics.totalMatches)) || prev.stats.totalMatches || 0,
                    scanType: hourlyIsActive ? scanType : 'Manual Scan'
                }
            };
            
            console.log('[Dashboard] New dashboard data:', newData.stats);
            return newData;
        });
    }, [isSimulating, simulationProgress, currentSite, currentStage, statusMessage, metrics, hourlyIsActive, hourlyProgress, hourlyCurrentSite, hourlyCurrentStage, hourlyMetrics, isManualScan]);

    // Log dashboard data changes
    useEffect(() => {
        // Reduced logging - only log when significant state changes occur
        if (dashboardData.stats.isScanning || dashboardData.stats.progress > 0) {
            console.log('[Dashboard] Dashboard scan state:', {
                isScanning: dashboardData.stats.isScanning,
                progress: dashboardData.stats.progress,
                currentSite: dashboardData.stats.currentSite
            });
        }
    }, [dashboardData]);

    // Log socket connection state
    useEffect(() => {
        console.log('[Dashboard] Socket connection state:', {
            connected,
            roomJoined,
            error: socketError,
            isSimulating,
            simulationProgress
        });
    }, [connected, roomJoined, socketError, isSimulating, simulationProgress]);

    // Handle socket reconnection
    useEffect(() => {
        if (connected && !isSimulating && simulationProgress === 40) {
            // If we're connected but have a partial progress, check scan status
            emit('check_scan_status');
        }
    }, [connected, isSimulating, simulationProgress, emit]);

    // Connection status feedback with more detail
    const connectionStatusMessage = useMemo(() => {
        if (connected) {
            setSocketError(null);
            return { type: 'success', message: 'Connected to real-time updates' };
        } else if (socketError) {
            setSocketError('Unable to connect to the server. Please check your internet connection or try again later.');
            return { type: 'error', message: 'Error connecting to real-time updates - Please refresh the page' };
        }
        return null;
    }, [connected, socketError]);

    // Removed automatic scroll effect to fix scroll interference issues

    // Add window resize listener
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Remove conflicting scroll effect that was causing scroll-to-top issues

    if (isLoadingInitialData) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-loading-container">
                    <div className="dashboard-loading-spinner">
                        <svg viewBox="0 0 50 50" className="spinner-svg">
                            <circle
                                cx="25"
                                cy="25"
                                r="20"
                                fill="none"
                                stroke="#42FFB5"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="spinner-circle"
                            />
                        </svg>
                    </div>
                    <p className="loading-text">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error && !dashboardData.stats) {
        return (
            <div className="dashboard-error">
                <h2>Error Loading Dashboard</h2>
                <p>{error}</p>
                <button onClick={fetchDashboardData} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="content-wrapper">
                    <div className="dashboard-main">
                        {socketErrorState && (
                            <div className="socket-error-banner">
                                <i className="fas fa-exclamation-circle"></i>
                                {socketErrorState}
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="reconnect-button"
                                >
                                    Reconnect
                                </button>
                            </div>
                        )}
                        
                        <div className="dashboard-content">
                            {/* Modern Protection Center Header */}
                            <div className="protection-center">
                                <h1>CyberForget AI Protection Center</h1>
                                <p>Advanced AI-powered data broker removal service with 24/7 automated monitoring</p>
                            </div>
                            
                            {/* Onboarding Banner for Profile Completion */}
                            <ErrorBoundary>
                                <OnboardingBanner />
                            </ErrorBoundary>
                            
                            {/* Debug subscription status - REMOVE IN PRODUCTION */}
                            {process.env.NODE_ENV === 'development' && (
                                <div style={{ 
                                    position: 'fixed',
                                    bottom: '20px',
                                    right: '20px',
                                    background: 'rgba(0, 0, 0, 0.8)', 
                                    color: '#42ffb5', 
                                    padding: '8px 12px', 
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    zIndex: 9999,
                                    border: '1px solid rgba(66, 255, 181, 0.2)'
                                }}>
                                    Debug: {user?.subscriptionStatus} | T:{isTrial ? '✓' : '✗'} | P:{isPremium ? '✓' : '✗'} | Days:{daysRemaining}
                                </div>
                            )}
                            
                            {/* Show trial warning if applicable */}
                            {isTrial && daysRemaining <= 3 && daysRemaining > 0 && (
                                <div className="trial-warning-banner">
                                    <i className="fas fa-clock"></i>
                                    <span>
                                        Your free trial expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}. 
                                        <strong> Upgrade now to continue using premium features.</strong>
                                    </span>
                                </div>
                            )}
                            
                            {/* Conditional Dashboard Content */}
                            {(isTrial || isPremium || daysRemaining > 0) ? (
                                // PREMIUM/TRIAL DASHBOARD
                                <div className="dashboard-content-wrapper premium-dashboard">
                                    {/* Premium Protection Grid */}
                                    <div className="protection-grid">
                                        <div className="protection-card active">
                                            <div className="protection-icon">🔄</div>
                                            <h3 className="protection-title">Automated Hourly Scans</h3>
                                            <p className="protection-status">
                                                {hourlyIsActive ? 
                                                    `Next automated scan in ${Math.ceil((new Date(dashboardData.stats.nextScanTime) - new Date()) / (1000 * 60))} minutes` :
                                                    'Next automated scan in 24 minutes'
                                                }
                                            </p>
                                        </div>
                                        
                                        <div className="protection-card active">
                                            <div className="protection-icon">🛡️</div>
                                            <h3 className="protection-title">Active Protection</h3>
                                            <p className="protection-status">Monitoring 400+ data brokers continuously</p>
                                        </div>
                                    </div>
                                    
                            <div className="dashboard-grid">
                                {/* Main Content - Left Column */}
                                <div className="dashboard-main-content">
                                    {/* Stats Section - 2x2 Grid */}
                                    <ErrorBoundary>
                                        <MemoizedDashboardStats 
                                            stats={{
                                                ...dashboardData.stats,
                                                // Integrate hourly scan data
                                                isScanning: hourlyIsActive || dashboardData.stats.isScanning,
                                                progress: hourlyIsActive ? hourlyProgress : dashboardData.stats.progress,
                                                currentSite: hourlyCurrentSite || dashboardData.stats.currentSite,
                                                currentStage: hourlyCurrentStage || dashboardData.stats.currentStage,
                                                // Use hourly metrics if available, otherwise fall back to dashboard stats
                                                sitesScanned: hourlyMetrics?.sitesScanned || formatScanProgress(dashboardData.stats.progress || 0),
                                                profilesFound: hourlyMetrics?.threatsFound || dashboardData.stats.profilesFound || dashboardData.stats.totalMatches || 0,
                                                potentialThreats: hourlyMetrics?.threatsFound || dashboardData.stats.potentialThreats || 0,
                                                totalMatches: hourlyMetrics?.totalMatches || dashboardData.stats.totalMatches || 0,
                                                lastScanTime: hourlyMetrics?.lastScanTime || dashboardData.stats.lastScanTime,
                                                nextScanTime: hourlyMetrics?.nextScanTime || dashboardData.stats.nextScanTime,
                                                // Pass stage-specific data
                                                stageIcon: hourlyMetrics?.stageIcon,
                                                stageDescription: hourlyMetrics?.stageDescription,
                                                stageDuration: hourlyMetrics?.stageDuration,
                                                timeRemaining: hourlyMetrics?.timeRemaining,
                                                siteIndex: hourlyMetrics?.siteIndex,
                                                totalSites: hourlyMetrics?.totalSites,
                                                scanType: isManualScan ? 'Manual scan' : 'Hourly scan'
                                            }}
                                        />
                                    </ErrorBoundary>

                                    {/* Data Broker Scan Progress */}
                                    <div className="dashboard-data-broker">
                                        <ErrorBoundary>
                                            <MemoizedDataBrokerList 
                                                isScanning={dashboardData.stats.isScanning}
                                                currentSite={dashboardData.stats.currentSite}
                                                progress={Number(dashboardData.stats.progress || 0)}
                                                sitesScanned={dashboardData.stats.sitesScanned || 0}
                                                profilesFound={dashboardData.stats.totalMatches || 0}
                                                threatsFound={dashboardData.stats.potentialThreats || 0}
                                                currentStageFromProps={dashboardData.stats.currentStage}
                                                message={dashboardData.stats.message || dashboardData.stats.status}
                                                lastScanTime={dashboardData.stats.lastScanTime}
                                                nextScanTime={dashboardData.stats.nextScanTime}
                                                threats={[]} // You can add actual threats data here if available
                                                scanType={dashboardData.stats.scanType}
                                            />
                                        </ErrorBoundary>
                                    </div>
                                </div>

                                {/* Sidebar - Right Column */}
                                <div className="dashboard-sidebar">
                                    <ErrorBoundary>
                                        <MemoizedUserInfo 
                                            user={user}
                                        />
                                    </ErrorBoundary>

                                    {shouldShowComponent('featureToggles') && (
                                        <ErrorBoundary>
                                            <MemoizedFeatureToggles 
                                                toggles={dashboardData.featureToggles || {
                                                    multi_factor_auth: false,
                                                    role_based_access: false,
                                                    monitoring_verification: false,
                                                    data_leak_notification: false
                                                }}
                                            />
                                        </ErrorBoundary>
                                    )}

                                    {shouldShowComponent('hourlyScansTest') && (
                                        <ErrorBoundary>
                                            <HourlyScansTest />
                                        </ErrorBoundary>
                                    )}

                                    <div className="live-search-section">
                                        <h3>
                                            Live Search
                                            <div className="live-indicator">
                                                <div className="live-dot"></div>
                                                <span>LIVE</span>
                                            </div>
                                        </h3>
                                        <div className="live-search-images">
                                            {liveSearchItems.length > 0 ? (
                                                liveSearchItems.map(item => (
                                                <div 
                                                    key={item.url}
                                                        className="image-preview-container"
                                                    onClick={() => window.open(item.url, '_blank')}
                                                >
                                                        <ImagePreview 
                                                            item={item} 
                                                            onImageClick={(url) => window.open(url, '_blank')} 
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="live-search-placeholder">
                                                    <p>Loading search previews...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                                </div>
                            ) : (
                                // FREE USER PRESALE DASHBOARD
                                <div className="dashboard-content-wrapper free-user-presale">
                                    {/* Hero Section */}
                                    <div className="presale-hero">
                                        <div className="hero-content">
                                            <h2>🚀 Start Your 5-Day FREE Trial</h2>
                                            <p className="hero-subtitle">Get full access to our premium cyber security suite and protect your digital identity today</p>
                                            <button 
                                                className="cta-button primary large"
                                                onClick={() => navigate('/pricing')}
                                            >
                                                Start Free Trial - No Credit Card Required
                                            </button>
                                        </div>
                                    </div>

                                    {/* Premium Features Grid */}
                                    <div className="premium-features-grid">
                                        <h3 className="features-title">🔓 Unlock Premium Features</h3>
                                        
                                        {/* Data Broker Removal */}
                                        <div className="feature-card locked">
                                            <div className="feature-header">
                                                <div className="feature-icon">🕵️</div>
                                                <div className="lock-badge">🔒 PREMIUM</div>
                                            </div>
                                            <h4>Automated Data Broker Removal</h4>
                                            <p>Scan 500+ data broker sites and automatically remove your personal information</p>
                                            <ul className="feature-benefits">
                                                <li>✓ Hourly automated scans</li>
                                                <li>✓ Remove from 400+ databases</li>
                                                <li>✓ Continuous monitoring</li>
                                            </ul>
                                        </div>

                                        {/* VPN */}
                                        <div className="feature-card locked">
                                            <div className="feature-header">
                                                <div className="feature-icon">🔐</div>
                                                <div className="lock-badge">🔒 PREMIUM</div>
                                            </div>
                                            <h4>Military-Grade VPN</h4>
                                            <p>Secure your internet connection with our lightning-fast VPN service</p>
                                            <ul className="feature-benefits">
                                                <li>✓ 50+ global server locations</li>
                                                <li>✓ AES-256 encryption</li>
                                                <li>✓ No-logs policy</li>
                                            </ul>
                                        </div>

                                        {/* Password Manager */}
                                        <div className="feature-card locked">
                                            <div className="feature-header">
                                                <div className="feature-icon">🔑</div>
                                                <div className="lock-badge">🔒 PREMIUM</div>
                                            </div>
                                            <h4>Advanced Password Manager</h4>
                                            <p>Generate, store, and manage unlimited secure passwords</p>
                                            <ul className="feature-benefits">
                                                <li>✓ Unlimited password storage</li>
                                                <li>✓ Auto-fill and sync</li>
                                                <li>✓ Breach monitoring</li>
                                            </ul>
                                        </div>

                                        {/* Identity Monitoring */}
                                        <div className="feature-card locked">
                                            <div className="feature-header">
                                                <div className="feature-icon">🛡️</div>
                                                <div className="lock-badge">🔒 PREMIUM</div>
                                            </div>
                                            <h4>24/7 Identity Monitoring</h4>
                                            <p>Real-time alerts for identity theft and data breaches</p>
                                            <ul className="feature-benefits">
                                                <li>✓ Dark web monitoring</li>
                                                <li>✓ Instant breach alerts</li>
                                                <li>✓ Credit monitoring</li>
                                            </ul>
                                        </div>

                                        {/* Live Reports */}
                                        <div className="feature-card locked">
                                            <div className="feature-header">
                                                <div className="feature-icon">📊</div>
                                                <div className="lock-badge">🔒 PREMIUM</div>
                                            </div>
                                            <h4>Live Security Reports</h4>
                                            <p>Detailed analytics and real-time threat intelligence</p>
                                            <ul className="feature-benefits">
                                                <li>✓ Weekly security reports</li>
                                                <li>✓ Threat analysis</li>
                                                <li>✓ Risk assessments</li>
                                            </ul>
                                        </div>

                                        {/* Ad Blocker */}
                                        <div className="feature-card locked">
                                            <div className="feature-header">
                                                <div className="feature-icon">🚫</div>
                                                <div className="lock-badge">🔒 PREMIUM</div>
                                            </div>
                                            <h4>Advanced Ad & Tracker Blocker</h4>
                                            <p>Block ads, trackers, and malicious websites across all devices</p>
                                            <ul className="feature-benefits">
                                                <li>✓ Block 2M+ trackers</li>
                                                <li>✓ Malware protection</li>
                                                <li>✓ Faster browsing</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Value Proposition */}
                                    <div className="value-proposition">
                                        <div className="value-content">
                                            <h3>💎 Premium Value - $180+/month worth of security tools</h3>
                                            <div className="pricing-breakdown">
                                                <div className="price-item">
                                                    <span>Data Broker Removal Service</span>
                                                    <span>$99/month</span>
                                                </div>
                                                <div className="price-item">
                                                    <span>Premium VPN Service (ExpressVPN)</span>
                                                    <span>$12.95/month</span>
                                                </div>
                                                <div className="price-item">
                                                    <span>Password Manager (1Password)</span>
                                                    <span>$7.99/month</span>
                                                </div>
                                                <div className="price-item">
                                                    <span>Identity Monitoring (LifeLock)</span>
                                                    <span>$29.99/month</span>
                                                </div>
                                                <div className="price-item">
                                                    <span>Advanced Ad Blocker (AdGuard)</span>
                                                    <span>$5.99/month</span>
                                                </div>
                                                <div className="price-item">
                                                    <span>Security Reports & Analytics</span>
                                                    <span>$39.99/month</span>
                                                </div>
                                                <div className="price-item total">
                                                    <span><strong>Total Competitor Value</strong></span>
                                                    <span><strong>$195.91/month</strong></span>
                                                </div>
                                                <div className="price-item our-price">
                                                    <span><strong>🔥 CyberForget All-in-One</strong></span>
                                                    <span><strong>Only $15/month</strong></span>
                                                </div>
                                                <div className="price-item annual-deal">
                                                    <span><strong>💰 Annual Deal</strong></span>
                                                    <span><strong>Only $10/month*</strong></span>
                                                </div>
                                            </div>
                                            <p className="savings-text">🎉 You save $180+/month with CyberForget!</p>
                                            <p className="annual-note">*$127 billed annually - Save $53!</p>
                                        </div>
                                    </div>

                                    {/* CTA Section */}
                                    <div className="final-cta">
                                        <div className="cta-content">
                                            <h3>🔥 Limited Time: 5 Days FREE</h3>
                                            <p>Join 2.3M+ users protecting their digital identity</p>
                                            <div className="cta-buttons">
                                                <button 
                                                    className="cta-button primary extra-large"
                                                    onClick={() => navigate('/pricing')}
                                                >
                                                    Start Free Trial Now
                                                </button>
                                                <button 
                                                    className="cta-button secondary"
                                                    onClick={() => navigate('/chat')}
                                                >
                                                    Try Free Scan First
                                                </button>
                                            </div>
                                            <p className="guarantee-text">💯 30-day money-back guarantee • Cancel anytime</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default memo(Dashboard);

// Initial state definitions
const initialDashboardState = {
    user: {
        email: "demo@example.com",
        firstName: "John",
        lastName: "Doe",
        memberSince: new Date().toISOString(),
        subscriptionStatus: 'Trial'
    },
    stats: {
        dataBrokerExposure: 75,
        sitesScanned: 0,
        profilesFound: 0,
        totalMatches: 0,
        progress: 0,
        isScanning: false,
        lastScanTime: null,
        nextScanTime: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString(),
        currentSite: null
    },
    featureToggles: {
        multi_factor_auth: false,
        role_based_access: false,
        monitoring_verification: false,
        data_leak_notification: false
    },
    breaches: [] // Added breaches to initial state
};

