import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuthUtils";
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorFallback from '../components/ErrorFallback';
import ErrorBoundary from '../components/ErrorBoundary';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNavBar from '../components/MobileNavbar';
import DashboardHeader from '../components/DashboardHeader';
import DashboardStats from '../components/DashboardStats';
import DataBrokerListComponent from '../components/DataBrokerListComponent';
import UserInfo from '../components/UserInfo';
import FeatureToggles from '../components/FeatureToggles';
import './Dashboard.css';
import './Dashboard2.css';

const Dashboard2 = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        user: {
            email: "",
            firstName: "",
            lastName: "",
            memberSince: new Date().toISOString(),
            subscriptionStatus: 'Loading...'
        },
        stats: {
            dataBrokerExposure: 0,
            sitesScanned: 0,
            profilesFound: 0,
            totalMatches: 0,
            progress: 0,
            isScanning: false,
            lastScanTime: null,
            nextScanTime: null,
            currentSite: null
        }
    });
    const [dataBrokerList, setDataBrokerList] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Handle window resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate API call for now
                setTimeout(() => {
                    setDashboardData({
                        user: {
                            email: user?.email || "demo@example.com",
                            firstName: user?.firstName || "John",
                            lastName: user?.lastName || "Wick",
                            memberSince: new Date().toISOString(),
                            subscriptionStatus: 'Active'
                        },
                        stats: {
                            dataBrokerExposure: 75,
                            sitesScanned: 42,
                            profilesFound: 15,
                            totalMatches: 28,
                            progress: 65,
                            isScanning: true,
                            currentSite: "DataBroker.com"
                        }
                    });
                    setDataBrokerList([
                        "DataBroker.com",
                        "InfoFinder.net",
                        "PersonSearch.io",
                        "DataVault.com"
                    ]);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorFallback error={error} />;

    return (
        <>
            {isMobile ? <MobileNavBar /> : <Navbar />}
            <div className="dashboard-page">
                <Sidebar />
                <div className="content-wrapper">
                    <div className="dashboard-main">
                        <div className="dashboard-content">
                            <div className="dashboard-header">
                                <h1>Your Dashboard</h1>
                                <p className="current-task">
                                    Current Task: {dashboardData.stats.currentSite ? 
                                        `Monitoring removal status across all data brokers...` : 
                                        'No active scans'}
                                </p>
                            </div>

                            <div className="dashboard-grid">
                                <div className="stats-section">
                                    <DashboardStats stats={dashboardData.stats} />
                                </div>
                                
                                <div className="data-broker-section">
                                    <DataBrokerListComponent 
                                        dataBrokers={dataBrokerList}
                                        isScanning={dashboardData.stats.isScanning}
                                        currentSite={dashboardData.stats.currentSite}
                                        profilesFound={dashboardData.stats.profilesFound}
                                    />
                                </div>
                                
                                <div className="user-features-section">
                                    <ErrorBoundary>
                                        <UserInfo user={dashboardData.user} />
                                    </ErrorBoundary>
                                    <ErrorBoundary>
                                        <FeatureToggles 
                                            isDevelopment={process.env.NODE_ENV === 'development'}
                                            subscriptionStatus={dashboardData.user.subscriptionStatus}
                                        />
                                    </ErrorBoundary>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard2;
