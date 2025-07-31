import React, { useState, useEffect } from 'react';
import { SignIn, SignUp, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from "../hooks/useAuthUtils";
import './LoginPage.css';

const LoginPage = () => {
    const { isAuthenticated } = useAuth();
    const { isSignedIn } = useClerkAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // If already authenticated via either method, redirect to dashboard
        if (isAuthenticated || isSignedIn) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, isSignedIn, navigate]);

    const handleAuthComplete = () => {
        const state = location.state || {};
        const searchParams = new URLSearchParams(location.search);
        const queryReturnUrl = searchParams.get('returnUrl');
        const returnUrl = state.returnUrl || queryReturnUrl || '/dashboard';
        
        // Ensure the return URL is safe
        const isSafeUrl = returnUrl.startsWith('/') && !returnUrl.startsWith('//');
        navigate(isSafeUrl ? returnUrl : '/dashboard', { replace: true });
    };

    return (
        <div className="cyberforget-login-page">
            <div className="cyberforget-auth-container">
                <div className="cyberforget-auth-content">
                    <div className="cyberforget-auth-header">
                        <div className="cyberforget-logo">
                            <div className="logo-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h1 className="cyberforget-brand">CyberForget</h1>
                        </div>
                        <h2 className="cyberforget-auth-title">
                            {isSignUp ? 'Create an account' : 'Welcome back'}
                        </h2>
                        <p className="cyberforget-auth-subtitle">
                            {isSignUp 
                                ? 'Create your account to get started' 
                                : 'Sign in to your account'}
                        </p>
                    </div>

                    <div className="cyberforget-clerk-container">
                        {isSignUp ? (
                            <SignUp 
                                appearance={{
                                    baseTheme: 'dark',
                                    variables: {
                                        colorPrimary: '#00D4FF',
                                        colorBackground: 'transparent',
                                        colorInputBackground: 'rgba(16, 23, 42, 0.8)',
                                        colorInputText: '#ffffff',
                                        colorText: '#ffffff',
                                        colorTextSecondary: 'rgba(255, 255, 255, 0.8)',
                                        colorDanger: '#ff4444',
                                        colorSuccess: '#42FFB5',
                                        borderRadius: '12px',
                                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                                    },
                                    elements: {
                                        card: 'cyberforget-clerk-card',
                                        headerTitle: 'cyberforget-clerk-header-title',
                                        headerSubtitle: 'cyberforget-clerk-header-subtitle',
                                        formButtonPrimary: 'cyberforget-clerk-primary-button',
                                        formFieldInput: 'cyberforget-clerk-input',
                                        socialButtonsBlockButton: 'cyberforget-clerk-social-button',
                                        footerActionLink: 'cyberforget-clerk-link',
                                        formFieldLabel: 'cyberforget-clerk-label',
                                        dividerLine: 'cyberforget-clerk-divider',
                                        dividerText: 'cyberforget-clerk-divider-text',
                                        footer: 'cyberforget-clerk-footer-hidden'
                                    },
                                    layout: {
                                        socialButtonsPlacement: 'bottom',
                                        socialButtonsVariant: 'blockButton',
                                        termsPageUrl: '/tos',
                                        privacyPageUrl: '/privacy-policy',
                                        showOptionalFields: false
                                    }
                                }}
                                afterSignUpUrl="/edit-info"
                            />
                        ) : (
                            <SignIn 
                                appearance={{
                                    baseTheme: 'dark',
                                    variables: {
                                        colorPrimary: '#00D4FF',
                                        colorBackground: 'transparent',
                                        colorInputBackground: 'rgba(16, 23, 42, 0.8)',
                                        colorInputText: '#ffffff',
                                        colorText: '#ffffff',
                                        colorTextSecondary: 'rgba(255, 255, 255, 0.8)',
                                        colorDanger: '#ff4444',
                                        colorSuccess: '#42FFB5',
                                        borderRadius: '12px',
                                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                                    },
                                    elements: {
                                        card: 'cyberforget-clerk-card',
                                        headerTitle: 'cyberforget-clerk-header-title',
                                        headerSubtitle: 'cyberforget-clerk-header-subtitle',
                                        formButtonPrimary: 'cyberforget-clerk-primary-button',
                                        formFieldInput: 'cyberforget-clerk-input',
                                        socialButtonsBlockButton: 'cyberforget-clerk-social-button',
                                        footerActionLink: 'cyberforget-clerk-link',
                                        formFieldLabel: 'cyberforget-clerk-label',
                                        dividerLine: 'cyberforget-clerk-divider',
                                        dividerText: 'cyberforget-clerk-divider-text',
                                        footer: 'cyberforget-clerk-footer-hidden'
                                    },
                                    layout: {
                                        socialButtonsPlacement: 'bottom',
                                        socialButtonsVariant: 'blockButton',
                                        showOptionalFields: false
                                    }
                                }}
                                afterSignInUrl="/dashboard"
                            />
                        )}
                    </div>

                    <div className="cyberforget-auth-toggle">
                        <p>
                            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                            <button 
                                className="cyberforget-toggle-link"
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? 'Log in' : 'Sign up'}
                            </button>
                        </p>
                    </div>

                    <div className="cyberforget-legal-links">
                        <Link to="/privacy-policy" className="legal-link">Privacy Policy</Link>
                        <span className="legal-separator">•</span>
                        <Link to="/tos" className="legal-link">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;