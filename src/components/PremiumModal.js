import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faCrown, 
    faBan, 
    faUserSecret, 
    faChartLine,
    faCheck,
    faRocket,
    faShieldAlt,
    faBolt,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { PaymentService } from '../services/paymentService';
import useSubscriptionSync from '../hooks/useSubscriptionSync';
import './PremiumModal.css';

const PremiumModal = ({ isOpen, onClose, requestedFeature, onStartTrial }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('');
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { syncNow } = useSubscriptionSync();
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true);
            try {
                const result = await PaymentService.getPricingPlans();
                if (result.success) {
                    setPlans(result.plans);
                } else {
                    setError(result.error || 'Failed to load pricing plans');
                }
            } catch (err) {
                setError('Unable to load pricing plans.');
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleStartTrial = async (planId) => {
        setIsProcessing(true);
        setProcessingMessage('Creating checkout session...');

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication required');
            }

            // Define pricing based on plan
            const pricingMap = {
                'annual': {
                    priceId: 'price_annual_premium', // Replace with your actual Stripe price ID
                    trialPeriodDays: 5,
                    name: 'Annual Premium'
                },
                'monthly': {
                    priceId: 'price_monthly_premium', // Replace with your actual Stripe price ID  
                    trialPeriodDays: 5,
                    name: 'Monthly Premium'
                }
            };

            const planDetails = pricingMap[planId];
            if (!planDetails) {
                throw new Error('Invalid plan selected');
            }

            // Create checkout session
            setProcessingMessage('Redirecting to secure checkout...');
            const result = await PaymentService.createCheckoutSession(token, {
                priceId: planDetails.priceId,
                successUrl: `${window.location.origin}/dashboard?success=true`,
                cancelUrl: `${window.location.origin}/dashboard?cancelled=true`,
                trialPeriodDays: planDetails.trialPeriodDays
            });

            if (result.success && result.url) {
                // Close modal and redirect to Stripe
                onClose();
                window.location.href = result.url;
            } else {
                throw new Error(result.error || 'Failed to create checkout session');
            }

        } catch (error) {
            console.error('Error starting trial:', error);
            setProcessingMessage('');
            alert(`Error starting trial: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle successful return from Stripe checkout
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        const sessionId = urlParams.get('session_id');

        if (success === 'true' && sessionId) {
            // Handle successful checkout
            handleCheckoutSuccess(sessionId);
        }
    }, []);

    const handleCheckoutSuccess = async (sessionId) => {
        setIsProcessing(true);
        setProcessingMessage('Activating your subscription...');

        try {
            // Monitor subscription activation
            const result = await PaymentService.handleCheckoutSuccess(sessionId, syncNow);
            
            if (result.success) {
                setProcessingMessage('Success! Redirecting...');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            } else {
                setProcessingMessage('');
                console.warn('Subscription activation monitoring failed:', result.error);
                // Still redirect to dashboard as webhook may process later
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 3000);
            }
        } catch (error) {
            console.error('Error handling checkout success:', error);
            setProcessingMessage('');
            // Redirect anyway as webhook should handle activation
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        }
    };

    const features = {
        'Ad Blocker': {
            icon: faBan,
            title: 'Bonus: Advanced Ad Blocker',
            description: 'Free bonus with your data removal plan',
            benefits: [
                'Complete data removal from 200+ sites',
                'Monthly monitoring & re-removal',
                'PLUS: Ad blocker (10x faster browsing)',
                'PLUS: Bandwidth savings up to 50%'
            ]
        },
        'VPN': {
            icon: faUserSecret,
            title: 'Bonus: Premium VPN Access',
            description: 'Free bonus with your privacy protection',
            benefits: [
                'Remove your data from data brokers',
                '24/7 monitoring for new exposures',
                'PLUS: VPN with 50+ locations',
                'PLUS: Military-grade encryption'
            ]
        },
        'Live Reports': {
            icon: faChartLine,
            title: 'Real-Time Data Removal Reports',
            description: 'Track your data removal progress',
            benefits: [
                'Professional data removal service',
                'Monthly removal from 200+ sites',
                'Real-time progress reports',
                'Detailed analytics & proof of removal'
            ]
        }
    };

    const currentFeature = features[requestedFeature] || features['Ad Blocker'];

    const allPremiumFeatures = [
        { icon: faShieldAlt, text: 'Data Removal from 200+ Sites' },
        { icon: faChartLine, text: 'Monthly Monitoring & Re-removal' },
        { icon: faBolt, text: 'Detailed Removal Reports' },
        { icon: faBan, text: 'BONUS: Advanced Ad Blocker' },
        { icon: faUserSecret, text: 'BONUS: Premium VPN Access' },
        { icon: faRocket, text: 'Priority Support 24/7' }
    ];

    // Hardcoded pricing for modal
    const annualPlan = {
        name: 'Premium Annual',
        price: 12700, // $127.00/year
        interval: 'year',
        description: 'Cancel anytime',
        monthlyEquivalent: '$10.58/month',
        savings: 'Save $53/year',
        trial: '5-Day Free Trial'
    };
    const monthlyPlan = {
        name: 'Premium Monthly',
        price: 1500, // $15.00/month
        interval: 'month',
        description: 'Cancel anytime',
        trial: '5-Day Free Trial'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="premium-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    {/* Modal */}
                    <motion.div
                        className="premium-modal"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Close button */}
                        <button className="modal-close" onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        {/* Header */}
                        <div className="modal-header compact">
                            <FontAwesomeIcon icon={faCrown} className="feature-main-icon" />
                            <h2>Upgrade to Premium</h2>
                            <p>Unlock advanced security tools and full dashboard access.</p>
                        </div>
                        {/* Compact Feature List */}
                        <div className="modal-features">
                            <ul>
                                <li><FontAwesomeIcon icon={faCheck} /> Remove your data from 200+ sites</li>
                                <li><FontAwesomeIcon icon={faCheck} /> Monthly monitoring & re-removal</li>
                                <li><FontAwesomeIcon icon={faCheck} /> Priority support</li>
                            </ul>
                        </div>
                        {/* Pricing Options */}
                        <div className="modal-pricing-grid">
                            <div className="modal-price-card">
                                <div className="modal-badge trial">{annualPlan.trial}</div>
                                <div className="modal-badge savings">{annualPlan.savings}</div>
                                <div className="modal-price-title">{annualPlan.name}</div>
                                <div className="modal-price-main">
                                    <span className="modal-price-amount">$127</span>
                                    <span className="modal-price-period">/year</span>
                                </div>
                                <div className="modal-price-desc">{annualPlan.description}</div>
                                <div className="modal-price-monthly-equivalent">{annualPlan.monthlyEquivalent}</div>
                                <a
                                    className="modal-upgrade-btn"
                                    href="https://buy.stripe.com/14kcNQafGcpE9HOaEE"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Upgrade Now
                                </a>
                            </div>
                            <div className="modal-price-card">
                                <div className="modal-badge trial">{monthlyPlan.trial}</div>
                                <div className="modal-price-title">{monthlyPlan.name}</div>
                                <div className="modal-price-main">
                                    <span className="modal-price-amount">$15</span>
                                    <span className="modal-price-period">/month</span>
                                </div>
                                <div className="modal-price-desc">{monthlyPlan.description}</div>
                                <a
                                    className="modal-upgrade-btn"
                                    href="https://buy.stripe.com/fZeg02fA0exMaLS8wA"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Upgrade Now
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PremiumModal;