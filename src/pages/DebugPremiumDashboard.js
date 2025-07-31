import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuthUtils";
import useSubscription from '../hooks/useSubscription';
import PremiumDashboard from './PremiumDashboard';
import './NewDashboard.css';

const DebugPremiumDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { shouldShowPaywall, isPremium, isTrial, daysRemaining, getUpgradeMessage } = useSubscription();
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Debug info for development
    const debugInfo = {
        user: user ? {
            id: user.id,
            email: user.email,
            subscriptionStatus: user.subscriptionStatus
        } : null,
        subscription: {
            isPremium,
            isTrial,
            daysRemaining,
            shouldShowPaywall
        },
        isDevelopment
    };

    // Show premium dashboard if user is premium/trial or in development mode
    const shouldShowPremium = isPremium || isTrial || isDevelopment;

    if (!shouldShowPremium) {
        // Redirect non-premium users to regular dashboard (which shows presale)
        return (
            <div className="debug-access-denied">
                <div className="access-denied-content">
                    <h2>🔒 Premium Dashboard Access Required</h2>
                    <p>This is a premium feature. Please upgrade your subscription to access the full dashboard.</p>
                    
                    <div className="subscription-status">
                        <h3>Current Status:</h3>
                        <ul>
                            <li><strong>Premium:</strong> {isPremium ? '✅ Yes' : '❌ No'}</li>
                            <li><strong>Trial:</strong> {isTrial ? '✅ Yes' : '❌ No'}</li>
                            <li><strong>Days Remaining:</strong> {daysRemaining || 'N/A'}</li>
                        </ul>
                    </div>

                    <div className="debug-actions">
                        <button 
                            className="cta-button primary"
                            onClick={() => navigate('/pricing')}
                        >
                            Upgrade to Premium
                        </button>
                        <button 
                            className="cta-button secondary"
                            onClick={() => navigate('/dashboard')}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Debug info for development */}
                {isDevelopment && (
                    <div className="debug-info">
                        <h4>🔧 Debug Info (Dev Mode Only)</h4>
                        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                    </div>
                )}

                <style jsx>{`
                    .debug-access-denied {
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 40px 20px;
                        background: linear-gradient(135deg, #0A0B1E 0%, #1a1d35 100%);
                        color: white;
                    }

                    .access-denied-content {
                        max-width: 600px;
                        text-align: center;
                        background: rgba(26, 29, 53, 0.8);
                        padding: 40px;
                        border-radius: 16px;
                        border: 1px solid rgba(66, 255, 181, 0.2);
                    }

                    .access-denied-content h2 {
                        color: #42ffb5;
                        margin-bottom: 20px;
                        font-size: 2rem;
                    }

                    .access-denied-content p {
                        margin-bottom: 30px;
                        color: #e2e8f0;
                        font-size: 1.1rem;
                        line-height: 1.6;
                    }

                    .subscription-status {
                        background: rgba(0, 0, 0, 0.3);
                        padding: 20px;
                        border-radius: 12px;
                        margin: 30px 0;
                        text-align: left;
                    }

                    .subscription-status h3 {
                        color: #42ffb5;
                        margin-bottom: 15px;
                        text-align: center;
                    }

                    .subscription-status ul {
                        list-style: none;
                        padding: 0;
                    }

                    .subscription-status li {
                        padding: 8px 0;
                        border-bottom: 1px solid rgba(66, 255, 181, 0.1);
                        display: flex;
                        justify-content: space-between;
                    }

                    .subscription-status li:last-child {
                        border-bottom: none;
                    }

                    .debug-actions {
                        display: flex;
                        gap: 16px;
                        justify-content: center;
                        flex-wrap: wrap;
                        margin-top: 30px;
                    }

                    .cta-button {
                        padding: 12px 24px;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 1rem;
                    }

                    .cta-button.primary {
                        background: linear-gradient(135deg, #42ffb5 0%, #00d4aa 100%);
                        color: #0A0B1E;
                    }

                    .cta-button.primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 16px rgba(66, 255, 181, 0.3);
                    }

                    .cta-button.secondary {
                        background: transparent;
                        color: #42ffb5;
                        border: 2px solid #42ffb5;
                    }

                    .cta-button.secondary:hover {
                        background: rgba(66, 255, 181, 0.1);
                    }

                    .debug-info {
                        margin-top: 40px;
                        max-width: 800px;
                        background: rgba(0, 0, 0, 0.5);
                        padding: 20px;
                        border-radius: 12px;
                        border: 1px solid rgba(255, 255, 0, 0.3);
                    }

                    .debug-info h4 {
                        color: #ffd700;
                        margin-bottom: 15px;
                    }

                    .debug-info pre {
                        background: rgba(0, 0, 0, 0.7);
                        padding: 15px;
                        border-radius: 8px;
                        overflow-x: auto;
                        font-size: 0.9rem;
                        color: #e2e8f0;
                    }

                    @media (max-width: 768px) {
                        .access-denied-content {
                            padding: 30px 20px;
                        }

                        .debug-actions {
                            flex-direction: column;
                        }

                        .cta-button {
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        );
    }

    // Show premium dashboard for premium/trial users
    return (
        <div className="debug-premium-dashboard">
            {/* Debug Header for Development */}
            {isDevelopment && (
                <div className="debug-header">
                    <div className="debug-badge">
                        🔧 DEBUG: Premium Dashboard Access Granted
                    </div>
                    <div className="debug-status">
                        Premium: {isPremium ? '✅' : '❌'} | Trial: {isTrial ? '✅' : '❌'} | Days: {daysRemaining || 'N/A'}
                    </div>
                </div>
            )}

            {/* Premium Dashboard Content */}
            <PremiumDashboard />

            {/* Debug Styles */}
            <style jsx>{`
                .debug-premium-dashboard {
                    position: relative;
                }

                .debug-header {
                    position: fixed;
                    top: 70px;
                    right: 20px;
                    z-index: 9999;
                    background: rgba(0, 0, 0, 0.9);
                    padding: 12px 16px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 0, 0.5);
                    font-size: 12px;
                    color: #ffd700;
                    max-width: 300px;
                }

                .debug-badge {
                    font-weight: 600;
                    margin-bottom: 4px;
                }

                .debug-status {
                    font-size: 11px;
                    opacity: 0.8;
                }

                @media (max-width: 768px) {
                    .debug-header {
                        position: relative;
                        top: 0;
                        right: 0;
                        margin: 10px;
                        max-width: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default DebugPremiumDashboard;