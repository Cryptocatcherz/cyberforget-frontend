/**
 * @fileoverview Pricing Plans Component with Stripe Integration
 * @description Dynamic pricing component that fetches plans from backend
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaCrown, FaBuilding, FaSpinner } from 'react-icons/fa';
import { PaymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import './PricingPlans.css';

const PricingPlans = ({ onSelectPlan, showTitle = true }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAnnual, setIsAnnual] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const { user, getToken } = useAuth();

    useEffect(() => {
        fetchPricingPlans();
    }, []);

    const fetchPricingPlans = async () => {
        try {
            setLoading(true);
            const result = await PaymentService.getPricingPlans();
            
            if (result.success) {
                setPlans(result.plans);
            } else {
                setError(result.error || 'Failed to load pricing plans');
            }
        } catch (err) {
            setError('Unable to load pricing plans. Please try again.');
            console.error('Error fetching pricing plans:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = async (plan) => {
        if (plan.id === 'free') {
            // Handle free plan selection
            if (onSelectPlan) {
                onSelectPlan(plan);
            }
            return;
        }

        try {
            setSelectedPlan(plan.id);
            const token = await getToken();
            
            if (!token) {
                // Redirect to login/signup
                window.location.href = '/signup';
                return;
            }

            const checkoutResult = await PaymentService.createCheckoutSession(token, {
                priceId: plan.stripePriceId,
                successUrl: `${window.location.origin}/success?plan=${plan.id}`,
                cancelUrl: `${window.location.origin}/pricing`,
                trialPeriodDays: plan.id === 'premium' ? 7 : undefined // 7-day trial for premium
            });

            if (checkoutResult.success) {
                PaymentService.redirectToCheckout(checkoutResult.url);
            } else {
                setError(checkoutResult.error || 'Failed to create checkout session');
                setSelectedPlan(null);
            }
        } catch (err) {
            setError('Unable to process payment. Please try again.');
            setSelectedPlan(null);
            console.error('Error creating checkout session:', err);
        }
    };

    const formatPrice = (price) => {
        if (price === 0) return 'Free';
        return PaymentService.formatPrice(price);
    };

    const getPlanIcon = (planId) => {
        switch (planId) {
            case 'premium':
                return <FaCrown className="plan-icon premium" />;
            case 'enterprise':
                return <FaBuilding className="plan-icon enterprise" />;
            default:
                return <FaCheck className="plan-icon free" />;
        }
    };

    const filteredPlans = plans.filter(plan => {
        if (isAnnual) {
            return plan.interval === 'year' || plan.id === 'free' || plan.id === 'enterprise';
        } else {
            return plan.interval === 'month' || plan.id === 'free';
        }
    });

    if (loading) {
        return (
            <div className="pricing-plans-container">
                <div className="loading-spinner">
                    <FaSpinner className="spinner" />
                    <p>Loading pricing plans...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pricing-plans-container">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={fetchPricingPlans} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pricing-plans-container">
            {showTitle && (
                <motion.div 
                    className="pricing-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Choose Your Protection Plan</h2>
                    <p>Secure your digital privacy with our comprehensive security solutions</p>
                    
                    <div className="billing-toggle">
                        <span className={!isAnnual ? 'active' : ''}>Monthly</span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={isAnnual} 
                                onChange={() => setIsAnnual(!isAnnual)}
                            />
                            <span className="slider"></span>
                        </label>
                        <span className={isAnnual ? 'active' : ''}>
                            Annual 
                            <span className="savings-badge">Save 17%</span>
                        </span>
                    </div>
                </motion.div>
            )}

            <div className="plans-grid">
                {filteredPlans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ 
                            scale: 1.02, 
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                        }}
                    >
                        {plan.popular && (
                            <div className="popular-badge">
                                <FaCrown /> Most Popular
                            </div>
                        )}

                        <div className="plan-header">
                            {getPlanIcon(plan.id)}
                            <h3>{plan.name}</h3>
                            <p className="plan-description">{plan.description}</p>
                        </div>

                        <div className="plan-pricing">
                            <div className="price">
                                {plan.price === 0 ? (
                                    <span className="price-amount">Free</span>
                                ) : (
                                    <>
                                        <span className="price-amount">{formatPrice(plan.price)}</span>
                                        <span className="price-period">/{plan.interval}</span>
                                    </>
                                )}
                            </div>
                            {plan.interval === 'year' && (
                                <div className="annual-savings">
                                    Save {formatPrice(plan.price * 12 - plan.price)} annually
                                </div>
                            )}
                        </div>

                        <div className="plan-features">
                            <ul>
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex}>
                                        <FaCheck className="feature-check" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            className={`plan-button ${plan.id}`}
                            onClick={() => handleSelectPlan(plan)}
                            disabled={selectedPlan === plan.id}
                        >
                            {selectedPlan === plan.id ? (
                                <>
                                    <FaSpinner className="button-spinner" />
                                    Processing...
                                </>
                            ) : plan.id === 'free' ? (
                                'Get Started'
                            ) : (
                                `Start ${plan.id === 'premium' ? '7-Day Trial' : 'Subscription'}`
                            )}
                        </button>

                        {plan.id === 'premium' && (
                            <div className="trial-notice">
                                7-day free trial, then {formatPrice(plan.price)}/{plan.interval}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <motion.div 
                className="pricing-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <div className="guarantee">
                    <h4>🛡️ 30-Day Money-Back Guarantee</h4>
                    <p>Not satisfied? Get a full refund within 30 days, no questions asked.</p>
                </div>
                
                <div className="security-badges">
                    <div className="badge">
                        <strong>🔒 Secure Payment</strong>
                        <span>256-bit SSL encryption</span>
                    </div>
                    <div className="badge">
                        <strong>💳 Flexible Billing</strong>
                        <span>Cancel anytime</span>
                    </div>
                    <div className="badge">
                        <strong>⚡ Instant Activation</strong>
                        <span>Start protecting immediately</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PricingPlans;