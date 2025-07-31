// App.js

import React, { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ClerkProvider, useAuth as useClerkAuth } from '@clerk/clerk-react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import NewDashboard from './pages/NewDashboard';
import EditInfoPage from './pages/EditInfoPage';
import SuccessPage from './pages/SuccessPage';
import DataRemovalsPage from './pages/DataRemovalsPage';
import SupportPage from './pages/SupportPage';
import LocationPage from './pages/LocationPage';
import ScanningPage from './pages/ScanningPage';
import TrialSignupPage from './pages/TrialSignupPage';
import DataLeakPage from './pages/DataLeakPage';
import PasswordCheckPage from './pages/PasswordCheckPage';
import FileScanPage from './pages/FileScanPage';
import ChatPage from './pages/ChatPage';
import EmailScanPage from './components/EmailScanPage';
import ResultsPage from './pages/ResultsPage';
import SitesPage from './pages/SitesPage';
import ChangePlanPage from './pages/ChangePlanPage';
import PricingPage from './pages/PricingPage';
import HourlyScansTestPage from './pages/HourlyScansTestPage';
import Navbar from './components/Navbar';
import MobileNavbar from './components/MobileNavbar';
import Sidebar from './components/Sidebar';
import useWindowSize from './hooks/useWindowSize';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Using Clerk directly instead of custom AuthProvider
import LoadingSpinner from './components/LoadingSpinner';
import DeleteAccountPage from './pages/DeleteAccountPage';
import DeleteAccountMainPage from './pages/DeleteAccountMainPage';
import { initGA, logPageView } from './utils/analytics';
import AreaCodeMainPage from './pages/AreaCodeMainPage';
import AreaCodeDetailPage from './pages/AreaCodeDetailPage';
import DoorStepProtectionPage from './pages/DoorStepProtectionPage';
import { Footer } from './components/footer';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ThreatManagement from './components/admin/ThreatManagement';
import AdminSettings from './components/admin/AdminSettings';
import SetupPasswordPage from './pages/SetupPasswordPage';
import AuthNavigationHandler from './components/AuthNavigationHandler';
import TOSPage from './pages/TOSPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import useSubscriptionSync from './hooks/useSubscriptionSync';
import ContactPage from './pages/ContactPage';
import PasswordManagerPage from './pages/PasswordManagerPage';
import VPNPage from './pages/VPNPage';
import DataRemovalDashboard from './pages/DataRemovalDashboard';
import DataRemovalPage from './pages/DataRemovalPage';
import OnboardingPage from './pages/OnboardingPage';
import PremiumFlowTest from './components/PremiumFlowTest';
import PremiumDashboard from './pages/PremiumDashboard';
import NotFoundPage from './pages/NotFoundPage';

const PrivateRoute = ({ children }) => {
    const { isLoaded, isSignedIn } = useClerkAuth();
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!isLoaded) {
        return <LoadingSpinner />;
    }

    if (!isSignedIn && !isDevelopment) {
        return <Navigate to="/login" />;
    }

    return children;
};

const AdminRoute = ({ children }) => {
    const { isLoaded, isSignedIn, user } = useClerkAuth();
    const location = useLocation();

    if (!isLoaded) {
        return <LoadingSpinner />;
    }

    const isAdmin = user?.publicMetadata?.role === 'admin';

    if (!isSignedIn || !isAdmin) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

const AppContent = React.memo(() => {
    const location = useLocation();
    const { isLoaded, isSignedIn } = useClerkAuth();
    const { width } = useWindowSize();
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Initialize subscription sync for authenticated users
    useSubscriptionSync();

    useEffect(() => {
        logPageView();
    }, [location.pathname, location.search]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    // Only show sidebar on dashboard and other authenticated pages
    const showSidebarPages = [
        '/dashboard',
        '/data-removal',
        '/vpn'
    ];
    
    const shouldShowSidebar = showSidebarPages.some(page => 
        location.pathname.startsWith(page)
    ) && (isSignedIn || isDevelopment);

    // Debug logging for sidebar visibility
    if (location.pathname === '/dashboard') {
        console.log('[App] Sidebar Debug:', {
            pathname: location.pathname,
            isSignedIn,
            isDevelopment,
            shouldShowSidebar,
            shouldHideSidebar: !shouldShowSidebar
        });
    }

    // List of all known routes (both public and private)
    const knownRoutes = [
        '/', '/login', '/signup', '/dashboard', '/payment', '/edit-info', '/success',
        '/data-removals', '/support', '/location', '/scanning', '/trial-signup',
        '/data-leak', '/password-check', '/file-scan', '/scamai', '/email-scan',
        '/results', '/sites', '/change-plan', '/pricing', '/hourly-scans-test',
        '/admin', '/delete-account', '/area-codes', '/doorstep-protection',
        '/setup-password', '/tos', '/privacy-policy', '/contact', '/password-managers'
    ];

    const isKnownRoute = knownRoutes.some(route => {
        if (route === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(route);
    });

    const shouldHideSidebar = !shouldShowSidebar;
    
    // Show navbar on all pages except where explicitly hidden
    const shouldHideNavbar = false;
    const shouldShowNavbar = true;

    return (
        <div className={`app-container ${shouldHideSidebar ? 'full-screen' : ''}`}>
            {!shouldHideSidebar && <Sidebar />}
            {shouldShowNavbar && <Navbar />}
            <div className={`main-content ${!shouldHideSidebar ? 'with-sidebar' : 'full-screen'}`}>
                {shouldShowNavbar && <MobileNavbar />}
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/sites" element={<SitesPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/data-removals" element={<DataRemovalsPage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/threats" element={<ThreatManagement />} />
                    <Route path="/admin/settings" element={
                        <AdminRoute>
                            <AdminSettings />
                        </AdminRoute>
                    } />
                    
                    {/* Terms of Service */}
                    <Route
                        path="/tos"
                        element={
                            <>
                                <Helmet>
                                    <title>Terms of Service - CyberForget | AI-First Privacy Protection</title>
                                    <meta
                                        name="description"
                                        content="Read the Terms of Service for CyberForget AI-first identity protection and fraud prevention services. Learn about your rights and responsibilities."
                                    />
                                </Helmet>
                                <TOSPage />
                            </>
                        }
                    />
                    
                    {/* Privacy Policy */}
                    <Route
                        path="/privacy-policy"
                        element={
                            <>
                                <Helmet>
                                    <title>Privacy Policy - CyberForget | AI-First Privacy Protection</title>
                                    <meta
                                        name="description"
                                        content="Read the Privacy Policy for CyberForget AI-first identity protection and fraud prevention services. Learn how we collect, use, and protect your personal information."
                                    />
                                </Helmet>
                                <PrivacyPolicyPage />
                            </>
                        }
                    />
                    
                    {/* Contact Page */}
                    <Route
                        path="/contact"
                        element={
                            <>
                                <Helmet>
                                    <title>Contact Us - CyberForget | AI-First Identity Protection Support</title>
                                    <meta
                                        name="description"
                                        content="Contact CyberForget for support, questions, or to learn more about our AI-first identity protection services. We're here to help prevent fraud and protect your privacy."
                                    />
                                </Helmet>
                                <ContactPage />
                            </>
                        }
                    />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <NewDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/dashboard-old"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    
                    <Route
                        path="/hourly-scans-test"
                        element={
                            <PrivateRoute>
                                <HourlyScansTestPage />
                            </PrivateRoute>
                        }
                    />
                    
                    <Route
                        path="/change-plan"
                        element={
                            <PrivateRoute>
                                <ChangePlanPage />
                            </PrivateRoute>
                        }
                    />
                    
                    {/* Onboarding Route */}
                    <Route
                        path="/onboarding"
                        element={
                            <PrivateRoute>
                                <>
                                    <Helmet>
                                        <title>Welcome to CyberForget - Complete Your Setup</title>
                                        <meta
                                            name="description"
                                            content="Complete your CyberForget account setup in just a few quick steps. Personalize your cybersecurity experience."
                                        />
                                    </Helmet>
                                    <OnboardingPage />
                                </>
                            </PrivateRoute>
                        }
                    />

                    {/* Edit Info Routes */}
                    <Route path="/edit-info/:token" element={<EditInfoPage />} />
                    <Route
                        path="/edit-info"
                        element={
                            <PrivateRoute>
                                <EditInfoPage />
                            </PrivateRoute>
                        }
                    />

                    {/* Signup Page */}
                    <Route
                        path="/signup"
                        element={
                            <>
                                <Helmet>
                                    <title>Sign Up - CyberForget | AI-First Identity Protection</title>
                                    <meta
                                        name="description"
                                        content="Create an account to secure your personal information and protect your online identity with AI-first fraud prevention and identity protection services."
                                    />
                                </Helmet>
                                <SignupPage />
                            </>
                        }
                    />

                    {/* Success Page */}
                    <Route
                        path="/success"
                        element={
                            <>
                                <Helmet>
                                    <title>Success - CyberForget | Identity Protection Activated</title>
                                    <meta
                                        name="description"
                                        content="Your identity protection setup has been successfully completed. Your AI-first fraud prevention is now active."
                                    />
                                </Helmet>
                                <SuccessPage />
                            </>
                        }
                    />

                    {/* Location Page */}
                    <Route
                        path="/location"
                        element={
                            <>
                                <Helmet>
                                    <title>Location - CyberForget | AI-First Identity Intelligence</title>
                                    <meta
                                        name="description"
                                        content="Provide your location to tailor AI-powered identity protection services to your specific region and prevent fraud."
                                    />
                                </Helmet>
                                <LocationPage />
                            </>
                        }
                    />

                    {/* Scanning Page */}
                    <Route
                        path="/scanning"
                        element={
                            <>
                                <Helmet>
                                    <title>Scanning - CyberForget | AI-Powered Identity Analysis</title>
                                    <meta
                                        name="description"
                                        content="Our AI is scanning digital threats and analyzing your identity exposure to prevent fraud and protect your privacy."
                                    />
                                </Helmet>
                                <ScanningPage />
                            </>
                        }
                    />

                    {/* Results Page */}
                    <Route
                        path="/results"
                        element={
                            <>
                                <Helmet>
                                    <title>Scan Results - CyberForget | AI Identity Threat Analysis</title>
                                    <meta
                                        name="description"
                                        content="View the results of your AI-powered identity scan and see where your personal information is exposed to fraud risks."
                                    />
                                </Helmet>
                                <ResultsPage />
                            </>
                        }
                    />

                    {/* Pricing Page */}
                    <Route
                        path="/pricing"
                        element={
                            <>
                                <Helmet>
                                    <title>Pricing - CyberForget AI | Identity Protection Plans</title>
                                    <meta
                                        name="description"
                                        content="Choose your CyberForget AI plan and start protecting your identity today. AI-first fraud prevention with continuous threat monitoring."
                                    />
                                </Helmet>
                                <PricingPage />
                            </>
                        }
                    />

                    {/* Trial Signup Page */}
                    <Route
                        path="/trial-signup"
                        element={
                            <>
                                <Helmet>
                                    <title>Free Trial Signup - CyberForget | AI-First Identity Protection</title>
                                    <meta
                                        name="description"
                                        content="Sign up for a free trial to get started with our AI-first identity protection and fraud prevention services. Protect yourself today."
                                    />
                                </Helmet>
                                <TrialSignupPage />
                            </>
                        }
                    />

                    {/* Data Leak Check Page */}
                    <Route
                        path="/data-leak"
                        element={
                            <>
                                <Helmet>
                                    <title>AI Threat Intelligence Scanner - CyberForget | Breach Detection</title>
                                    <meta
                                        name="description"
                                        content="Check if your email was compromised in data breaches using our AI-powered threat intelligence scanner. Secure your identity today."
                                    />
                                </Helmet>
                                <DataLeakPage />
                            </>
                        }
                    />

                    {/* Password Strength Checker Page */}
                    <Route
                        path="/password-check"
                        element={
                            <>
                                <Helmet>
                                    <title>Password Strength Checker - CyberForget | AI-Powered Security</title>
                                    <meta
                                        name="description"
                                        content="Evaluate the strength of your passwords with AI-powered analysis, receive intelligent suggestions for improvement, and generate secure passwords to enhance your online security."
                                    />
                                </Helmet>
                                <PasswordCheckPage />
                            </>
                        }
                    />

                    {/* File Scan Page */}
                    <Route
                        path="/file-scan"
                        element={
                            <>
                                <Helmet>
                                    <title>File Scan - CyberForget | AI Document Privacy Analysis</title>
                                    <meta
                                        name="description"
                                        content="Perform an AI-powered file scan to identify and protect sensitive information within your documents. Enhance your privacy with our intelligent scanning services."
                                    />
                                </Helmet>
                                <FileScanPage />
                            </>
                        }
                    />

                    {/* Scam AI Chat Page */}
                    <Route
                        path="/scamai"
                        element={
                            <>
                                <Helmet>
                                    <title>CyberForget AI - AI-First Identity Protection | Prevent Fraud</title>
                                    <meta
                                        name="description"
                                        content="Chat with CyberForget AI to detect potential scams, prevent identity theft, and protect yourself from fraud with AI-first security."
                                    />
                                </Helmet>
                                <ChatPage />
                            </>
                        }
                    />

                    {/* Delete Account Page */}
                    <Route
                        path="/delete-account"
                        element={
                            <>
                                <Helmet>
                                    <title>Delete Account - CyberForget | Remove Your Account</title>
                                    <meta
                                        name="description"
                                        content="Delete your CyberForget account to remove all your personal information and data from our AI-first identity protection system."
                                    />
                                </Helmet>
                                <DeleteAccountMainPage />
                            </>
                        }
                    />

                    {/* Delete Account Page */}
                    <Route
                        path="/delete-account/*"
                        element={<DeleteAccountPage />}
                    />

                    {/* Area Codes Page */}
                    <Route
                        path="/area-codes"
                        element={
                            <>
                                <Helmet>
                                    <title>Area Codes - CyberForget | Regional Identity Protection</title>
                                    <meta
                                        name="description"
                                        content="Manage your area codes to tailor AI-powered identity protection services to your specific region and prevent regional fraud."
                                    />
                                </Helmet>
                                <AreaCodeMainPage />
                            </>
                        }
                    />

                    {/* Area Code Detail Page */}
                    <Route
                        path="/area-codes/:areaCode"
                        element={
                            <>
                                <Helmet>
                                    <title>Area Code Detail - CyberForget | Regional Identity Analysis</title>
                                    <meta
                                        name="description"
                                        content="Manage your area code to tailor AI-powered identity protection services to your specific region and prevent regional fraud."
                                    />
                                </Helmet>
                                <AreaCodeDetailPage />
                            </>
                        }
                    />

                    {/* DoorStepProtection Page */}
                    <Route
                        path="/doorstep-protection"
                        element={
                            <>
                                <Helmet>
                                    <title>DoorStepProtection - CyberForget | AI-First Home Security</title>
                                    <meta
                                        name="description"
                                        content="Protect your identity with CyberForget's AI-powered home security and fraud prevention."
                                    />
                                </Helmet>
                                <DoorStepProtectionPage />
                            </>
                        }
                    />

                    {/* Setup Password Route */}
                    <Route
                        path="/setup-password/:token"
                        element={
                            <>
                                <Helmet>
                                    <title>Set Up Password - CyberForget | Secure Your Account</title>
                                    <meta
                                        name="description"
                                        content="Set up your password to secure your CyberForget account and protect your personal information with AI-first security."
                                    />
                                </Helmet>
                                <SetupPasswordPage />
                            </>
                        }
                    />

                    {/* Email Scan Page */}
                    <Route
                        path="/email-scan"
                        element={
                            <>
                                <Helmet>
                                    <title>Email Breach Scanner - CyberForget | AI-Powered Threat Detection</title>
                                    <meta
                                        name="description"
                                        content="Scan your email to check if it has been compromised in data breaches using our AI-powered threat intelligence system."
                                    />
                                </Helmet>
                                <EmailScanPage />
                            </>
                        }
                    />

                    {/* Password Manager Comparison Page */}
                    <Route
                        path="/password-managers"
                        element={
                            <>
                                <Helmet>
                                    <title>Password Manager Comparison - CyberForget | AI Security Analysis</title>
                                    <meta
                                        name="description"
                                        content="Compare top password managers with our AI-powered analysis. Find the best solution for your security needs with detailed feature comparisons and expert recommendations."
                                    />
                                </Helmet>
                                <PasswordManagerPage />
                            </>
                        }
                    />

                    {/* VPN Page */}
                    <Route
                        path="/vpn"
                        element={
                            <PrivateRoute>
                                <>
                                    <Helmet>
                                        <title>CyberForget VPN - Secure Your Digital Privacy</title>
                                        <meta
                                            name="description"
                                            content="Download CyberForget VPN for Chrome, Mac, or Windows. Military-grade encryption, zero-logs policy, and lightning-fast speeds."
                                        />
                                    </Helmet>
                                    <VPNPage />
                                </>
                            </PrivateRoute>
                        }
                    />

                    {/* Data Removal Page */}
                    <Route
                        path="/data-removal"
                        element={
                            <PrivateRoute>
                                <>
                                    <Helmet>
                                        <title>CyberForget Data Removal - Take Back Your Privacy</title>
                                        <meta
                                            name="description"
                                            content="Remove your personal information from 500+ data broker sites. Automated removal service with 24/7 monitoring included with CyberForget Pro."
                                        />
                                    </Helmet>
                                    <DataRemovalPage />
                                </>
                            </PrivateRoute>
                        }
                    />

                    {/* Data Removal Dashboard */}
                    <Route
                        path="/data-removal"
                        element={
                            <PrivateRoute>
                                <>
                                    <Helmet>
                                        <title>Data Removal Dashboard - CyberForget | Remove Personal Information</title>
                                        <meta
                                            name="description"
                                            content="Monitor and manage the removal of your personal information from 500+ data broker sites. Track progress and protect your privacy."
                                        />
                                    </Helmet>
                                    <DataRemovalDashboard />
                                </>
                            </PrivateRoute>
                        }
                    />

                    {/* Premium Flow Test Page (Development Only) */}
                    {process.env.NODE_ENV === 'development' && (
                        <Route
                            path="/test-premium-flow"
                            element={
                                <PrivateRoute>
                                    <>
                                        <Helmet>
                                            <title>Premium Flow Test - CyberForget | Development</title>
                                            <meta
                                                name="description"
                                                content="Test page for premium signup and feature access flow."
                                            />
                                        </Helmet>
                                        <div style={{ padding: '20px', minHeight: '100vh', background: 'linear-gradient(135deg, #0A0B1E 0%, #1a1d35 50%, #0A0B1E 100%)' }}>
                                            <PremiumFlowTest />
                                        </div>
                                    </>
                                </PrivateRoute>
                            }
                        />
                    )}

                    {/* Premium Dashboard Debug Page (Development Only) */}
                    {process.env.NODE_ENV === 'development' && (
                        <Route
                            path="/debug-premium-dashboard"
                            element={
                                <PrivateRoute>
                                    <>
                                        <Helmet>
                                            <title>Premium Dashboard Debug - CyberForget | Development</title>
                                            <meta
                                                name="description"
                                                content="Debug page for premium dashboard testing."
                                            />
                                        </Helmet>
                                        <PremiumDashboard />
                                    </>
                                </PrivateRoute>
                            }
                        />
                    )}

                    {/* Default Route - Chat Page */}
                    <Route
                        path="/"
                        element={
                            <>
                                <Helmet>
                                    <title>CyberForget AI - AI-First Identity Protection | Fraud Prevention Assistant</title>
                                    <meta
                                        name="description"
                                        content="Chat with CyberForget AI to protect your identity, prevent fraud, detect scams, and secure your personal data with AI-first protection."
                                    />
                                </Helmet>
                                <ChatPage />
                            </>
                        }
                    />

                    {/* 404 Catch-All Route */}
                    <Route
                        path="*"
                        element={
                            <>
                                <Helmet>
                                    <title>Page Not Found - CyberForget AI</title>
                                    <meta
                                        name="description"
                                        content="The page you're looking for doesn't exist. Return to CyberForget AI for identity protection and fraud prevention."
                                    />
                                </Helmet>
                                <NotFoundPage />
                            </>
                        }
                    />
                </Routes>
                {location.pathname !== '/scamai' && location.pathname !== '/' && location.pathname !== '/email-scan' && location.pathname !== '/pricing' && <Footer className={!shouldHideSidebar ? 'with-sidebar' : ''} />}
            </div>
        </div>
    );
});

function App() {
    useEffect(() => {
        initGA();
    }, []);

    const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

    return (
        <HelmetProvider>
            <ClerkProvider 
                publishableKey={clerkPubKey}
            >
                <React.Suspense fallback={<div>Loading...</div>}>
                    <AuthNavigationHandler />
                    <AppContent />
                </React.Suspense>
            </ClerkProvider>
        </HelmetProvider>
    );
}

const styles = {
    notFoundPage: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        color: '#fff',
        textAlign: 'center',
        backgroundColor: '#1e1e1e',
        padding: '20px',
    },
    homeLink: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#00ff85',
        color: '#000',
        textDecoration: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        transition: 'background-color 0.3s ease',
    }
};

export default App;
