import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faUserEdit,
    faExchangeAlt,
    faListAlt,
    faLifeRing,
    faPlus,
    faCircle,
    faShieldAlt,
    faUsers,
    faExclamationTriangle,
    faTimes,
    faRobot,
    faBan,
    faUserSecret,
    faCrown,
    faLock
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import profileImage from '../assets/profile.jpg';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../hooks/useAuthUtils";
import PremiumModal from './PremiumModal';

// Cancel Plan Modal Component
const CancelPlanModal = ({ onClose, user }) => {
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const cancelReasons = [
        'Too expensive',
        'Not finding enough threats',
        'Found all my data',
        'Switching to another service',
        'Technical issues',
        'Privacy concerns',
        'No longer need the service',
        'Other'
    ];

    const handleCancel = async () => {
        setIsProcessing(true);
        try {
            // TODO: Add actual cancellation API call here
            console.log('Cancelling plan:', { reason, feedback });
            // await cancelSubscription(reason, feedback);
            setStep(3); // Success step
        } catch (error) {
            console.error('Error cancelling plan:', error);
            alert('There was an error cancelling your plan. Please contact support.');
        } finally {
            setIsProcessing(false);
        }
    };

    const alternatives = [
        {
            title: "Pause Your Plan",
            description: "Take a break for up to 3 months. Your data stays protected.",
            benefit: "Keep your protection without monthly charges"
        },
        {
            title: "Downgrade Plan", 
            description: "Switch to our basic plan for essential protection only.",
            benefit: "Save money while maintaining core security"
        },
        {
            title: "Family Discount",
            description: "Add family members and save up to 40% per person.",
            benefit: "Better value for multiple people"
        }
    ];

    if (step === 1) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="cancel-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Before you go...</h2>
                        <button className="close-button" onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    
                    <div className="modal-content">
                        <div className="warning-section">
                            <div className="warning-icon">⚠️</div>
                            <h3>Here's what you'll lose:</h3>
                            <ul className="consequences-list">
                                <li>🛡️ Real-time threat monitoring</li>
                                <li>🔍 Automatic data broker scans</li>
                                <li>📧 Instant threat alerts</li>
                                <li>🗑️ Assisted data removal requests</li>
                                <li>📊 Your scan history and reports</li>
                            </ul>
                        </div>

                        <div className="alternatives-section">
                            <h3>Consider these alternatives:</h3>
                            <div className="alternatives-grid">
                                {alternatives.map((alt, index) => (
                                    <div key={index} className="alternative-card">
                                        <h4>{alt.title}</h4>
                                        <p>{alt.description}</p>
                                        <div className="benefit">{alt.benefit}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="secondary-button" onClick={onClose}>
                                Keep My Plan
                            </button>
                            <button className="danger-button" onClick={() => setStep(2)}>
                                Still Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="cancel-modal feedback-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Help us improve</h2>
                        <button className="close-button" onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    
                    <div className="modal-content">
                        <p>We're sorry to see you go. Your feedback helps us improve for everyone.</p>
                        
                        <div className="form-group">
                            <label>What's your main reason for cancelling?</label>
                            <select 
                                value={reason} 
                                onChange={(e) => setReason(e.target.value)}
                                className="reason-select"
                            >
                                <option value="">Select a reason...</option>
                                {cancelReasons.map((r, index) => (
                                    <option key={index} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Any additional feedback? (Optional)</label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Tell us how we could have done better..."
                                className="feedback-textarea"
                                rows={4}
                            />
                        </div>

                        <div className="final-warning">
                            <strong>⚠️ Your cancellation will take effect immediately.</strong>
                            <p>You'll lose access to all protection features and your data will no longer be monitored.</p>
                        </div>

                        <div className="modal-actions">
                            <button className="secondary-button" onClick={() => setStep(1)}>
                                Go Back
                            </button>
                            <button 
                                className="danger-button" 
                                onClick={handleCancel}
                                disabled={!reason || isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Cancel My Plan'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="cancel-modal success-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Plan Cancelled</h2>
                        <button className="close-button" onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    
                    <div className="modal-content">
                        <div className="success-icon">✅</div>
                        <h3>Your plan has been cancelled</h3>
                        <p>You'll have access to your account until the end of your current billing period.</p>
                        <p>We'll send you a confirmation email shortly.</p>
                        
                        <div className="return-offer">
                            <h4>Changed your mind?</h4>
                            <p>You can reactivate your plan anytime within the next 30 days with no setup fees.</p>
                        </div>

                        <div className="modal-actions">
                            <button className="primary-button" onClick={onClose}>
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

// Locked Feature Component
const LockedFeature = ({ icon, title, description, onClick }) => {
    return (
        <div className="nav-item locked-feature" onClick={onClick}>
            <div className="nav-icon-wrapper">
                <FontAwesomeIcon icon={icon} className="nav-icon" />
                <FontAwesomeIcon icon={faLock} className="lock-icon" />
            </div>
            <div className="nav-item-content">
                <span className="nav-title">{title}</span>
                <span className="nav-description">{description}</span>
            </div>
            <div className="premium-badge">
                <FontAwesomeIcon icon={faCrown} />
            </div>
        </div>
    );
};

const Sidebar = () => {
    const location = useLocation();
    const { user, isAdmin } = useAuth();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [modalRequestedFeature, setModalRequestedFeature] = useState('');
    
    // Debug admin status (remove in production)
    if (process.env.NODE_ENV !== 'production') {
        console.log('[Sidebar] User data:', user);
        console.log('[Sidebar] isAdmin:', isAdmin);
        console.log('[Sidebar] user.role:', user?.role);
    }
    
    const getDisplayName = () => {
        if (!user) {
            return 'Welcome Back!';
        }

        // Check for both camelCase and snake_case formats
        const firstName = user.firstName || user.first_name;
        const lastName = user.lastName || user.last_name;

        if (firstName && lastName) {
            return `${firstName} ${lastName}`.trim();
        }

        // If no name is found, use email username
        if (user.email) {
            return user.email.split('@')[0];
        }

        return 'Welcome Back!';
    };

    const calculateSubscriptionStatus = () => {
        if (!user) return 'protected';
        
        // Use the actual subscription status from the API
        const status = user.subscriptionStatus || 'protected';
        
        // Map API status to display status if needed
        const statusMap = {
            'active': 'protected',
            'trial': 'trial',
            'expired': 'expired',
            'cancelled': 'cancelled'
        };
        
        return statusMap[status.toLowerCase()] || status;
    };

    const getMemberSince = () => {
        if (!user) return 'Not available';
        
        // Try different possible date fields from the backend
        const dateField = user.memberSince || user.createdAt || user.created_at || user.joinedAt || user.joined_at;
        
        if (!dateField) return 'Not available';
        
        try {
            const date = new Date(dateField);
            if (isNaN(date.getTime())) return 'Not available';
            
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (error) {
            console.error('Error formatting member since date:', error);
            return 'Not available';
        }
    };

    const subscriptionStatus = calculateSubscriptionStatus();
    const memberSince = getMemberSince();

    // Check if user has premium access
    const hasPremiumAccess = () => {
        if (!user) return false;
        const status = user.subscriptionStatus?.toLowerCase();
        return status === 'premium' || status === 'pro' || status === 'active';
    };

    // Handle locked feature clicks with marketing
    const handleLockedFeatureClick = (featureName) => {
        // Track the specific feature they wanted
        localStorage.setItem('requested_feature', featureName);
        localStorage.setItem('conversion_source', 'sidebar_locked_feature');
        
        // Show premium modal with feature-specific content
        setModalRequestedFeature(featureName);
        setShowPremiumModal(true);
    };

    // Handle trial start from modal
    const handleStartTrial = (planType = 'annual') => {
        // Clear tracking data
        localStorage.removeItem('requested_feature');
        localStorage.removeItem('conversion_source');
        
        // Track conversion
        console.log('Premium trial started:', {
            feature: modalRequestedFeature,
            plan: planType,
            source: 'sidebar_modal'
        });
        
        // Close modal
        setShowPremiumModal(false);
        
        // Redirect to Stripe checkout
        const stripeUrl = planType === 'annual' 
            ? "https://buy.stripe.com/14kcNQafGcpE9HOaEE"
            : "https://buy.stripe.com/fZeg02fA0exMaLS8wA";
        
        window.location.href = stripeUrl;
    };

    return (
        <div className="sidebar">
            <div className="cyber-connector-node"></div>
            <div className="sidebar-profile">
                <div className="profile-pic-wrapper">
                    <img src={profileImage} alt="User" className="profile-pic" />
                    <div className="online-status">
                        <div className="status-dot"></div>
                    </div>
                </div>
                <div className="profile-info">
                    <h3 className="user-name">{getDisplayName()}</h3>
                    <div className="status-badge">
                        <span className="status-icon"></span>
                        {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                    </div>
                    <div className="member-since">
                        Member since {memberSince}
                    </div>
                </div>
            </div>
            <nav className="sidebar-nav">
                <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                    <span>Dashboard</span>
                </Link>
                
                <Link to="/scamai" className={`nav-item ${location.pathname === '/scamai' ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faRobot} className="nav-icon" />
                    <span>AI Chat</span>
                </Link>

                {/* Locked Features Section */}
                <div className="nav-section-divider">
                    <span>PREMIUM FEATURES</span>
                </div>
                
                {hasPremiumAccess() ? (
                    <>
                        <Link to="/ad-blocker" className={`nav-item ${location.pathname === '/ad-blocker' ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faBan} className="nav-icon" />
                            <span>Ad Blocker</span>
                        </Link>
                        <Link to="/vpn" className={`nav-item ${location.pathname === '/vpn' ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faUserSecret} className="nav-icon" />
                            <span>VPN</span>
                        </Link>
                        <Link to="/data-removal" className={`nav-item ${location.pathname === '/data-removal' ? 'active' : ''}`}>
                            <div className="recording-dot nav-icon"></div>
                            <span>Data Removal</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <LockedFeature
                            icon={faBan}
                            title="Ad Blocker"
                            description="Block ads & trackers"
                            onClick={() => handleLockedFeatureClick('Ad Blocker')}
                        />
                        <LockedFeature
                            icon={faUserSecret}
                            title="VPN"
                            description="Secure connection"
                            onClick={() => handleLockedFeatureClick('VPN')}
                        />
                        <LockedFeature
                            icon={faCircle}
                            title="Live Reports"
                            description="Real-time alerts"
                            onClick={() => handleLockedFeatureClick('Live Reports')}
                        />
                    </>
                )}

                {/* Regular Features */}
                <div className="nav-section-divider">
                    <span>ACCOUNT</span>
                </div>
                
                <Link to="/edit-info" className={`nav-item ${location.pathname === '/edit-info' ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faUserEdit} className="nav-icon" />
                    <span>Edit Your Info</span>
                </Link>
                <Link to="/change-plan" className={`nav-item ${location.pathname === '/change-plan' ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faExchangeAlt} className="nav-icon" />
                    <span>Change Plan</span>
                </Link>
                <Link to="/sites" className={`nav-item ${location.pathname === '/sites' ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faListAlt} className="nav-icon" />
                    <span>Sites We Cover</span>
                </Link>
                <Link to="/support" className={`nav-item ${location.pathname === '/support' ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faLifeRing} className="nav-icon" />
                    <span>Support</span>
                </Link>

                {isAdmin && (
                    <>
                        <div className="nav-section-divider">
                            <span>ADMIN PANEL</span>
                        </div>
                        <Link to="/admin" className={`nav-item admin ${location.pathname === '/admin' ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faShieldAlt} className="nav-icon" />
                            <span>Admin Dashboard</span>
                        </Link>
                        <Link to="/admin/users" className={`nav-item admin ${location.pathname === '/admin/users' ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faUsers} className="nav-icon" />
                            <span>User Management</span>
                        </Link>
                        <Link to="/admin/threats" className={`nav-item admin ${location.pathname === '/admin/threats' ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle} className="nav-icon" />
                            <span>Threat Management</span>
                        </Link>
                    </>
                )}
            </nav>
            
            <div className="sidebar-footer">
                <Link 
                    to="/change-plan" 
                    className="current-plan-button"
                >
                    <FontAwesomeIcon icon={faExchangeAlt} className="button-icon" />
                    <div className="plan-info">
                        <span className="plan-title">Manage Plan</span>
                        <span className="plan-status">{subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)} Plan</span>
                    </div>
                </Link>
                
                {user && subscriptionStatus !== 'cancelled' && (
                    <button 
                        className="cancel-plan-link"
                        onClick={() => setShowCancelModal(true)}
                    >
                        Cancel Plan
                    </button>
                )}
            </div>

            {showCancelModal && <CancelPlanModal onClose={() => setShowCancelModal(false)} user={user} />}
            
            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                requestedFeature={modalRequestedFeature}
                onStartTrial={handleStartTrial}
            />
        </div>
    );
};

export default Sidebar;