/**
 * @fileoverview Payment Service for Stripe Integration
 * @description Frontend service for handling Stripe payments and subscriptions
 * @version 1.0.0
 */

import { ENDPOINTS } from '../config/endpoints';
import clerkAuthService from './clerkAuthService';
import { getApiUrl } from '../config/environment';

class PaymentService {
    /**
     * Get available pricing plans
     */
    static async getPricingPlans() {
        try {
            const response = await fetch(getApiUrl(ENDPOINTS.PAYMENTS.PLANS), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch pricing plans: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    plans: result.data,
                    metadata: result.metadata
                };
            } else {
                throw new Error(result.error?.message || 'Failed to fetch pricing plans');
            }
        } catch (error) {
            console.error('Error fetching pricing plans:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create checkout session for subscription with automatic status sync
     */
    static async createCheckoutSession(token, planDetails, options = {}) {
        try {
            const { priceId, successUrl, cancelUrl, trialPeriodDays, couponId } = planDetails;

            const authHeaders = await clerkAuthService.getAuthHeaders();
            const response = await fetch(getApiUrl(ENDPOINTS.PAYMENTS.CHECKOUT), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                },
                body: JSON.stringify({
                    priceId,
                    successUrl: successUrl || `${window.location.origin}/success`,
                    cancelUrl: cancelUrl || `${window.location.origin}/pricing`,
                    trialPeriodDays,
                    couponId
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to create checkout session: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    sessionId: result.data.sessionId,
                    url: result.data.url,
                    customerId: result.data.customerId
                };
            } else {
                throw new Error(result.error?.message || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create one-time payment session
     */
    static async createOneTimePayment(token, paymentDetails) {
        try {
            const { amount, description, successUrl, cancelUrl } = paymentDetails;

            const authHeaders = await clerkAuthService.getAuthHeaders();
            const response = await fetch(getApiUrl(ENDPOINTS.PAYMENTS.ONE_TIME), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                },
                body: JSON.stringify({
                    amount,
                    description,
                    successUrl: successUrl || `${window.location.origin}/success`,
                    cancelUrl: cancelUrl || `${window.location.origin}/pricing`
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to create one-time payment: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    sessionId: result.data.sessionId,
                    url: result.data.url,
                    customerId: result.data.customerId
                };
            } else {
                throw new Error(result.error?.message || 'Failed to create one-time payment');
            }
        } catch (error) {
            console.error('Error creating one-time payment:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create customer portal session
     */
    static async createPortalSession(token, returnUrl) {
        try {
            const authHeaders = await clerkAuthService.getAuthHeaders();
            const response = await fetch(getApiUrl(ENDPOINTS.PAYMENTS.PORTAL), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                },
                body: JSON.stringify({
                    returnUrl: returnUrl || window.location.origin
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to create portal session: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    url: result.data.url
                };
            } else {
                throw new Error(result.error?.message || 'Failed to create portal session');
            }
        } catch (error) {
            console.error('Error creating portal session:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get user's subscription details
     */
    static async getSubscription(token) {
        try {
            const authHeaders = await clerkAuthService.getAuthHeaders();
            const response = await fetch(getApiUrl(ENDPOINTS.PAYMENTS.SUBSCRIPTION), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch subscription: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    subscription: result.data.subscription,
                    customerId: result.data.customerId
                };
            } else {
                throw new Error(result.error?.message || 'Failed to fetch subscription');
            }
        } catch (error) {
            console.error('Error fetching subscription:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Manage subscription (cancel, resume)
     */
    static async manageSubscription(token, subscriptionId, action) {
        try {
            const authHeaders = await clerkAuthService.getAuthHeaders();
            const response = await fetch(getApiUrl(ENDPOINTS.PAYMENTS.MANAGE), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                },
                body: JSON.stringify({
                    subscriptionId,
                    action // 'cancel', 'resume', 'cancel_immediately'
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to manage subscription: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    subscriptionId: result.data.subscriptionId,
                    status: result.data.status,
                    cancelAtPeriodEnd: result.data.cancelAtPeriodEnd,
                    currentPeriodEnd: result.data.currentPeriodEnd
                };
            } else {
                throw new Error(result.error?.message || 'Failed to manage subscription');
            }
        } catch (error) {
            console.error('Error managing subscription:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update subscription plan
     */
    static async updateSubscriptionPlan(token, subscriptionId, newPriceId) {
        try {
            const authHeaders = await clerkAuthService.getAuthHeaders();
            const response = await fetch(getApiUrl(ENDPOINTS.PAYMENTS.UPDATE_PLAN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                },
                body: JSON.stringify({
                    subscriptionId,
                    newPriceId
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to update subscription plan: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    subscriptionId: result.data.subscriptionId,
                    status: result.data.status,
                    newPriceId: result.data.newPriceId
                };
            } else {
                throw new Error(result.error?.message || 'Failed to update subscription plan');
            }
        } catch (error) {
            console.error('Error updating subscription plan:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get payment methods
     */
    static async getPaymentMethods(token) {
        try {
            const authHeaders = await clerkAuthService.getAuthHeaders();
            const response = await fetch(getApiUrl(ENDPOINTS.PAYMENTS.PAYMENT_METHODS), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch payment methods: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    paymentMethods: result.data
                };
            } else {
                throw new Error(result.error?.message || 'Failed to fetch payment methods');
            }
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get invoices
     */
    static async getInvoices(token, limit = 10) {
        try {
            const authHeaders = await clerkAuthService.getAuthHeaders();
            const url = `${getApiUrl(ENDPOINTS.PAYMENTS.INVOICES)}?limit=${limit}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch invoices: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    invoices: result.data
                };
            } else {
                throw new Error(result.error?.message || 'Failed to fetch invoices');
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Redirect to Stripe Checkout
     */
    static redirectToCheckout(checkoutUrl) {
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        } else {
            console.error('No checkout URL provided');
        }
    }

    /**
     * Open customer portal
     */
    static async openCustomerPortal(token, returnUrl) {
        try {
            const result = await this.createPortalSession(token, returnUrl);
            
            if (result.success && result.url) {
                window.location.href = result.url;
            } else {
                throw new Error(result.error || 'Failed to open customer portal');
            }
        } catch (error) {
            console.error('Error opening customer portal:', error);
            throw error;
        }
    }

    /**
     * Format price for display
     */
    static formatPrice(amount, currency = 'usd') {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        });
        
        return formatter.format(amount / 100); // Convert from cents
    }

    /**
     * Check if user has active subscription
     */
    static async hasActiveSubscription(token) {
        try {
            const result = await this.getSubscription(token);
            
            if (result.success && result.subscription) {
                const activeStatuses = ['active', 'trialing', 'past_due'];
                return activeStatuses.includes(result.subscription.status);
            }
            
            return false;
        } catch (error) {
            console.error('Error checking subscription status:', error);
            return false;
        }
    }

    /**
     * Get subscription status for display
     */
    static getSubscriptionStatusDisplay(status) {
        const statusMap = {
            'active': { text: 'Active', color: 'success' },
            'trialing': { text: 'Trial', color: 'info' },
            'past_due': { text: 'Past Due', color: 'warning' },
            'canceled': { text: 'Canceled', color: 'secondary' },
            'unpaid': { text: 'Unpaid', color: 'danger' },
            'incomplete': { text: 'Incomplete', color: 'warning' },
            'incomplete_expired': { text: 'Expired', color: 'danger' }
        };
        
        return statusMap[status] || { text: status, color: 'secondary' };
    }

    // Legacy methods for backward compatibility
    async createCheckoutSession(paymentData) {
        const token = localStorage.getItem('authToken');
        return PaymentService.createCheckoutSession(token, paymentData);
    }

    async verifyPayment(sessionData) {
        // Legacy method - now handled by Stripe webhooks
        console.log('Payment verification is now handled by backend webhooks');
        return { success: true, message: 'Payment will be verified by backend' };
    }

    async getPaymentSession(sessionId) {
        // Legacy method - use getSubscription instead
        const token = localStorage.getItem('authToken');
        return PaymentService.getSubscription(token);
    }

    async testSuccessfulPayment(testData) {
        // Legacy method for testing
        console.log('Test payment method - use createCheckoutSession instead');
        return { success: true, message: 'Use createCheckoutSession for payments' };
    }

    async setupPassword(passwordData) {
        // Legacy method - this was likely for a different purpose
        console.log('setupPassword is legacy - use proper auth flow');
        return { success: false, error: 'Method no longer supported' };
    }

    /**
     * Monitor subscription status after checkout completion
     * This method polls for subscription status changes after a successful checkout
     */
    static async monitorSubscriptionStatus(sessionId, maxAttempts = 10, intervalMs = 3000) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            
            const checkStatus = async () => {
                attempts++;
                
                try {
                    const token = localStorage.getItem('authToken');
                    const result = await this.getSubscription(token);
                    
                    if (result.success && result.subscription) {
                        console.log(`[PaymentService] Subscription status check ${attempts}/${maxAttempts}:`, result.subscription.status);
                        
                        // Check if subscription is active or trial
                        if (['active', 'trialing', 'premium', 'trial'].includes(result.subscription.status)) {
                            resolve({
                                success: true,
                                status: result.subscription.status,
                                subscription: result.subscription
                            });
                            return;
                        }
                    }
                    
                    // Continue monitoring if not active yet
                    if (attempts < maxAttempts) {
                        setTimeout(checkStatus, intervalMs);
                    } else {
                        resolve({
                            success: false,
                            error: 'Subscription status monitoring timeout',
                            lastStatus: result.subscription?.status || 'unknown'
                        });
                    }
                } catch (error) {
                    console.error(`[PaymentService] Error checking subscription status (attempt ${attempts}):`, error);
                    
                    if (attempts < maxAttempts) {
                        setTimeout(checkStatus, intervalMs);
                    } else {
                        reject(error);
                    }
                }
            };
            
            // Start monitoring
            checkStatus();
        });
    }

    /**
     * Handle post-checkout subscription activation
     * Call this after a successful Stripe checkout to monitor and sync status
     */
    static async handleCheckoutSuccess(sessionId, syncCallback) {
        console.log('[PaymentService] Starting post-checkout monitoring for session:', sessionId);
        
        try {
            // Wait a moment for webhook processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Monitor subscription status
            const result = await this.monitorSubscriptionStatus(sessionId);
            
            if (result.success) {
                console.log('[PaymentService] Subscription activated successfully:', result.status);
                
                // Trigger sync callback if provided
                if (syncCallback && typeof syncCallback === 'function') {
                    await syncCallback();
                }
                
                return {
                    success: true,
                    status: result.status,
                    message: 'Subscription activated successfully'
                };
            } else {
                console.warn('[PaymentService] Subscription monitoring failed:', result.error);
                
                // Still try to sync in case webhook processed but we missed it
                if (syncCallback && typeof syncCallback === 'function') {
                    await syncCallback();
                }
                
                return {
                    success: false,
                    error: result.error,
                    fallback: 'Webhook processing may still complete in background'
                };
            }
        } catch (error) {
            console.error('[PaymentService] Error in post-checkout handling:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

const paymentService = new PaymentService();
export default paymentService;
export { PaymentService }; 